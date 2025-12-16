/**
 * Database Types voor Supabase
 * ============================
 * Deze types worden automatisch gegenereerd door Supabase CLI
 * maar hier is een handmatige versie voor snelle setup.
 * 
 * Na het uitvoeren van de SQL scripts kun je deze regenereren met:
 * npx supabase gen types typescript --project-id "jouw-project-id" > src/lib/database.types.ts
 */

export type UserRole = 'admin' | 'landingpage_editor' | 'project_editor' | 'viewer';
export type AccountStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole | null;
          account_status: AccountStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole | null;
          account_status?: AccountStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole | null;
          account_status?: AccountStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          short_description: string | null;
          full_description: string | null;
          goals: string | null;
          section_image_url: string | null;
          section_image_path: string | null;
          target_audience: string | null;
          contact_person: string | null;
          tags: string[] | null;
          status: 'active' | 'archived';
          is_published: boolean;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          short_description?: string | null;
          full_description?: string | null;
          goals?: string | null;
          section_image_url?: string | null;
          section_image_path?: string | null;
          target_audience?: string | null;
          contact_person?: string | null;
          tags?: string[] | null;
          status?: 'active' | 'archived';
          is_published?: boolean;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          short_description?: string | null;
          full_description?: string | null;
          goals?: string | null;
          section_image_url?: string | null;
          section_image_path?: string | null;
          target_audience?: string | null;
          contact_person?: string | null;
          tags?: string[] | null;
          status?: 'active' | 'archived';
          is_published?: boolean;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      landing_page_content: {
        Row: {
          id: string;
          title: string;
          intro: string | null;
          body: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          intro?: string | null;
          body?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          intro?: string | null;
          body?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      pdf_files: {
        Row: {
          id: string;
          project_id: string | null;
          is_landing_page: boolean;
          url: string;
          filename: string;
          file_size: number | null;
          uploaded_at: string;
          uploaded_by: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          is_landing_page?: boolean;
          url: string;
          filename: string;
          file_size?: number | null;
          uploaded_at?: string;
          uploaded_by: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          is_landing_page?: boolean;
          url?: string;
          filename?: string;
          file_size?: number | null;
          uploaded_at?: string;
          uploaded_by?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id: string | null;
          old_values: Record<string, unknown> | null;
          new_values: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}

// Helper types voor gemakkelijk gebruik
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type LandingPageContent = Database['public']['Tables']['landing_page_content']['Row'];
export type PdfFile = Database['public']['Tables']['pdf_files']['Row'];
export type AuditLog = Database['public']['Tables']['audit_log']['Row'];
export type School = Database['public']['Tables']['schools']['Row'];
