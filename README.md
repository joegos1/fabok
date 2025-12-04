# VABOK - Versterken van de Aansluiting in de Beroepskolom

Interne informatiesite voor onderwijsprojecten, gebouwd met Astro, Supabase en Vercel.

## 🚀 Technologie Stack

- **Frontend:** Astro met Server-Side Rendering (SSR)
- **Styling:** Tailwind CSS (Firda huisstijl kleuren)
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

## 📁 Project Structuur

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── PdfList.astro         # PDF lijst component
│   │   ├── PdfUpload.astro       # Upload component met validatie
│   │   └── ProjectCard.astro     # Project kaart voor overzicht
│   ├── layouts/
│   │   ├── Layout.astro          # Basis layout met navigatie
│   │   └── DashboardLayout.astro # Dashboard layout met sidebar
│   ├── lib/
│   │   ├── supabaseClient.ts     # Supabase client configuratie
│   │   ├── database.types.ts     # TypeScript types voor database
│   │   └── auth.ts               # Auth helpers en middleware
│   └── pages/
│       ├── index.astro           # Landingspagina
│       ├── login.astro           # Login pagina
│       ├── projecten/
│       │   ├── index.astro       # Projecten overzicht
│       │   └── [id].astro        # Project detail pagina
│       ├── dashboard/
│       │   ├── index.astro       # Dashboard home
│       │   ├── projecten/        # Admin projectbeheer
│       │   ├── mijn-projecten.astro # Project editor view
│       │   ├── landingpage.astro # Landingpage editor
│       │   └── gebruikers.astro  # Admin gebruikersbeheer
│       └── api/
│           ├── auth/             # Login/logout endpoints
│           ├── projects/         # Project API's
│           └── upload-pdf.ts     # PDF upload API
├── supabase/
│   └── schema.sql                # Database schema en RLS policies
├── .env.example                  # Voorbeeld environment variabelen
└── vercel.json                   # Vercel deployment config
```

## 🛠️ Installatie

### 1. Clone de repository

```bash
git clone <repo-url>
cd fabok
npm install
```

### 2. Supabase Setup

1. Maak een nieuw project aan op [supabase.com](https://supabase.com)
2. Ga naar **SQL Editor** en voer het script uit in `supabase/schema.sql`
3. Kopieer je API keys van **Settings > API**

### 3. Environment Variabelen

Kopieer `.env.example` naar `.env` en vul in:

```env
PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. Eerste Admin Aanmaken

1. Maak een gebruiker aan via Supabase Auth (Dashboard > Authentication > Users)
2. Update de rol naar admin:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

### 5. Development Server

```bash
npm run dev
```

## 👥 Rollen en Rechten

| Rol | Beschrijving |
|-----|--------------|
| **admin** | Volledige toegang: projecten CRUD, gebruikersbeheer, alle content |
| **landingpage_editor** | Kan alleen de landingspagina bewerken |
| **project_editor** | Kan alleen eigen toegewezen projecten bewerken |
| **viewer** | Alleen lezen en PDF's downloaden |

## 📄 Belangrijke Features

### PDF Upload
- Alleen .pdf bestanden toegestaan (mime-type + extensie check)
- Maximaal 10MB per bestand
- Automatisch gesorteerd op upload datum (nieuwste eerst)
- Opgeslagen in Supabase Storage

### Row Level Security (RLS)
Alle database toegang is beveiligd met RLS policies:
- Viewers kunnen alleen actieve projecten lezen
- Project editors kunnen alleen hun eigen projecten bewerken
- Landingpage editors kunnen alleen landingpage content bewerken
- Admins hebben volledige toegang

## 🚀 Deployment naar Vercel

1. Push naar GitHub
2. Importeer in Vercel
3. Voeg environment variabelen toe in Vercel dashboard
4. Deploy!

## 📝 Commando's

| Commando | Actie |
|----------|-------|
| `npm run dev` | Start development server |
| `npm run build` | Build voor productie |
| `npm run preview` | Preview productie build |

## 🎨 Kleurenschema

Het project gebruikt een Firda-achtig kleurenschema:

- **Primair blauw:** `#007dc3` - Headers, knoppen
- **Accent groen:** `#009b69` - Succesberichten, CTA's
- **Grijs tinten:** Achtergronden, tekst

## 🔒 Beveiliging

- Auth via Supabase met httpOnly cookies
- RLS policies op alle tabellen
- PDF upload validatie (type + grootte)
- CSRF bescherming via SameSite cookies

## 📞 Support

Voor vragen of problemen, neem contact op met de projectbeheerder.

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
