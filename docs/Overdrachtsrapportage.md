# Overdrachtsrapportage: Project Vabok (VABOK)

Dit document dient als overdracht voor het project **VABOK** (Versterken van de Aansluiting in de Beroepskolom). Het beschrijft de huidige staat van het project, de technische architectuur, en de belangrijkste functionaliteiten.

## 1. Project Overzicht
VABOK is een platform ontworpen om de samenwerking en aansluiting tussen verschillende onderwijsinstellingen (VO, MBO, HBO) te verbeteren. Het biedt een centraal punt voor informatie over projecten, evenementen, en documentatiedeling.

## 2. Technische Architectuur
Het project is gebouwd met een moderne web-stack gericht op snelheid, schaalbaarheid en onderhoudbaarheid.

- **Framework**: [Astro v5](https://astro.build/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/).
- **Backend & Database**: [Supabase](https://supabase.com/) gebruikt voor de database,opslag en auth.
- **Kaart Integratie**: [Maplibre GL JS](https://maplibre.org/) 
    voor het weergeven van de betrokken scholen.
- **Hosting**: Momenteel nog op Vercel maar binnenkort naar een VPS.

## 3. Projectstructuur
De broncode bevindt zich in de `src` map en is als volgt georganiseerd:

- `src/pages/`: Bevat alle routes van de applicatie.
    - `index.astro`: De landingspagina.
    - `api/`: Back-End (agenda, auth, projecten, etc.).
    - `dashboard/`: Het beheerpaneel voor ingelogde gebruikers.
- `src/components/`: Herbruikbare UI-componenten (bijv. `ProjectCard`, `SchoolMap`, `AgendaSection`).
- `src/lib/`: database configuratie (o.a. `supabase.ts`).
- `src/layouts/`: Basis layouts voor de pagina's.
- `src/types/`: TypeScript definities voor de database schema's.
- `public/`: Files zoals afbeeldingen en PDF's.

## 4. Belangrijke Functionaliteiten

### 4.1 Dashboard & Beheer
Geautoriseerde gebruikers kunnen via het dashboard projecten beheren, evenementen toevoegen en documenten uploaden. Er is een rollensysteem aanwezig (Admin, ProjectEditor en Landingspagina editor).

### 4.2 Agenda & Registratie
Een interactieve agenda (`AgendaSection.astro`) toont aankomende evenementen. Gebruikers kunnen zich registreren voor evenementen, wat direct wordt verwerkt in de Supabase database.

### 4.3 Interactieve Kaart
De `SchoolMap` component laat een kaart zien waar de deelnemende scholen zich bevinden.

### 4.4 Documentbeheer
Beveiligde toegang tot PDF-documenten. Alleen ingelogde gebruikers kunnen specifieke projectdocumentatie inzien via de `PdfList` component.

## 5. Database Schema (Supabase)
De belangrijkste tabellen in de database zijn:
- `projects`: Informatie over lopende onderwijsprojecten.
- `schools`: Gegevens en locaties van deelnemende scholen.
- `project_events`: Kalenderitems en bijeenkomsten.
- `event_registrations`: Koppeling tussen gebruikers en evenementen.
- `profiles`: Aanvullende gebruikersinformatie en permissies.
