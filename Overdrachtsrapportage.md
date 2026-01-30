# Overdrachtsrapportage: Project Vabok (VABOK)

Dit document dient als overdracht voor het project **VABOK** (Versterken van de Aansluiting in de Beroepskolom). Het beschrijft de huidige staat van het project, de technische architectuur, en de belangrijkste functionaliteiten.

## 1. Project Overzicht
VABOK is een platform ontworpen om de samenwerking en aansluiting tussen verschillende onderwijsinstellingen (VO, MBO, HBO) te verbeteren. Het biedt een centraal punt voor informatie over projecten, evenementen, en documentatiedeling.

## 2. Technische Architectuur
Het project is gebouwd met een moderne web-stack gericht op snelheid, schaalbaarheid en onderhoudbaarheid.

- **Framework**: [Astro v5](https://astro.build/) (gebruikt voor SSR en statische generatie).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) voor een responsief en consistent design.
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL database, Ready-to-use Auth, en Storage).
- **Kaart Integratie**: [Maplibre GL JS](https://maplibre.org/) voor het weergeven van aangesloten scholen.
- **Hosting**: Geoptimaliseerd voor [Vercel](https://vercel.com/).

## 3. Projectstructuur
De broncode bevindt zich in de `src` map en is als volgt georganiseerd:

- `src/pages/`: Bevat alle routes van de applicatie.
    - `index.astro`: De landingspagina.
    - `api/`: Serverless endpoints voor data-afhandeling (agenda, auth, projecten, etc.).
    - `dashboard/`: Het beheerpaneel voor ingelogde gebruikers.
- `src/components/`: Herbruikbare UI-componenten (bijv. `ProjectCard`, `SchoolMap`, `AgendaSection`).
- `src/lib/`: Utilities en database configuratie (o.a. `supabase.ts`).
- `src/layouts/`: Basis layouts voor de pagina's.
- `src/types/`: TypeScript definities voor de database schema's.
- `public/`: Statische assets zoals afbeeldingen en PDF's.

## 4. Belangrijke Functionaliteiten

### 4.1 Dashboard & Beheer
Geautoriseerde gebruikers kunnen via het dashboard projecten beheren, evenementen toevoegen en documenten uploaden. Er is een rollensysteem aanwezig (Admin, ProjectEditor).

### 4.2 Agenda & Registratie
Een interactieve agenda (`AgendaSection.astro`) toont aankomende evenementen. Gebruikers kunnen zich registreren voor sessies, wat direct wordt verwerkt in de Supabase database.

### 4.3 Interactieve Kaart
De `SchoolMap` component toont geografisch waar de deelnemende scholen zich bevinden. Dit geeft een visueel overzicht van de impact van het project.

### 4.4 Documentbeheer
Beveiligde toegang tot PDF-documenten. Alleen ingelogde gebruikers kunnen specifieke projectdocumentatie inzien via de `PdfList` component.

## 5. Database Schema (Supabase)
De belangrijkste tabellen in de database zijn:
- `projects`: Informatie over lopende onderwijsprojecten.
- `schools`: Gegevens en locaties van deelnemende scholen.
- `project_events`: Kalenderitems en bijeenkomsten.
- `event_registrations`: Koppeling tussen gebruikers en evenementen.
- `profiles`: Aanvullende gebruikersinformatie en permissies.

## 6. Installatie & Lokale Ontwikkeling
1. Clone de repository.
2. Voer `npm install` uit voor de dependencies.
3. Configureer de `.env` file met `SUPABASE_URL` en `SUPABASE_ANON_KEY`.
4. Start de development server met `npm run dev`.

## 7. Toekomstige Ontwikkeling & Onderhoud
- **Borging**: Verdere uitbreiding van de documentatie voor projectresultaten.
- **Optimalisatie**: Verbeteren van de zoekfunctionaliteit binnen de projectlijst.
- **Monitoring**: Integratie van Analytics om de gebruikersactiviteit te volgen.

---
*Opgesteld op 28 januari 2026 door Antigravity (AI Assistent).*
