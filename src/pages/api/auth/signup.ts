/**
 * Signup API Endpoint
 * ===================
 * Verwerkt registratie verzoeken
 */

import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const fullName = formData.get('full_name')?.toString();

    if (!email || !password || !fullName) {
      return redirect('/signup?error=missing_fields');
    }

    // Check of gebruiker al bestaat in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (existingProfile) {
      // Als account was afgewezen, geef nieuwe kans
      if (existingProfile.account_status === 'rejected') {
        // Update wachtwoord
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingProfile.id,
          { password: password }
        );

        if (updateError) {
          console.error('Error updating password for rejected user:', updateError);
          return redirect('/signup?error=server_error');
        }

        // Reset profiel status naar pending
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({ 
            account_status: 'pending',
            full_name: fullName,
            role: null, // Reset rol
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
          return redirect('/signup?error=server_error');
        }

        return redirect('/login?message=account_pending');
      } else {
        return redirect('/signup?error=email_taken');
      }
    }

    // Nieuwe gebruiker aanmaken
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      return redirect('/signup?error=server_error');
    }

    if (data.user) {
      // Zorg dat profiel correct is ingesteld
      // We gebruiken upsert voor het geval er een trigger is die al een row heeft aangemaakt
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: null,
          account_status: 'pending',
          updated_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return redirect('/login?message=account_pending');

  } catch (error) {
    console.error('Signup error:', error);
    return redirect('/signup?error=server_error');
  }
};
