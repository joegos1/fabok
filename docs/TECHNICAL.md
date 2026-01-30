TECHNICAL.md (uitgebreider)
1. Architectuur-overzicht
De Fabok webapplicatie is opgezet als een moderne webapplicatie met een scheiding tussen frontend en backend, ondersteund door een relationele database.
​
De architectuur ondersteunt zowel een publiek portaal als een beveiligd dashboard, waarbij herbruikbare API’s gebruikt worden voor alle datastromen.
​

2. Backend & Frontend Stack
De applicatie is gebouwd met moderne webtechnologieën:

Framework: Astro 5 (SSR & Static generation).


Database & Auth: Supabase (PostgreSQL, Auth, Storage).


Styling: Tailwind CSS.


Interactiviteit: Maplibre GL voor de scholenkaart.


Deployment: Vercel (Hosten van Astro en API routes).
​

3. Architectuur
De backend bestaat uit Astro API-endpoints die communiceren met Supabase. De frontend is component-gebaseerd met herbruikbare Astro-componenten voor de UI.
​

End-to-end flow:

Frontend stuurt een verzoek naar een beveiligd endpoint met een geldige sessie of token.
​

De API valideert input, controleert rechten en voert databaseoperaties uit via een ORM of querylaag.
​

3. Frontend
De frontend levert zowel het publieke deel als het dashboard.
​
Belangrijke kenmerken:

Component-gebaseerde opzet, zodat navigatie, formulieren en lijsten hergebruikbaar zijn.
​

Gebruik van gestileerde UI-componenten voor tabellen, filters, formulieren en detailweergaves.
​

Routing voor: home, projectenlijst, projectdetail, agenda, documenten en dashboardsecties.
​

4. Database-model
Het datamodel bevat in ieder geval de volgende entiteiten:
​

Project: titel, omschrijving, doelen, doelgroep, provincie, status, publicatiestatus, tags, contactpersoon, sociale links, image metadata.


ProjectEvent: titel, omschrijving, start_date, end_date, locatie, gekoppeld project-id.


PdfFile: bestandsnaam, url, grootte, uploaddatum, is_landing_page, gekoppeld project-id.


Profile: e-mail, naam, rol (`admin`, `landingpage_editor`, `project_editor`, `viewer`), status (`pending`, `approved`, `rejected`).


School: naam, adres, stad, provincie, coördinaten (lat/long) voor Maplibre GL.


LandingPageContent: titel, intro, body tekst voor de homepage.


EventRegistration: Voornaam, achternaam, e-mail en gekoppeld event-id.


AuditLog: Registratie van acties, tabellen, records en old/new values.
​

Relaties:

Eén project kan meerdere events en documenten hebben (1-n-relaties).
​

Documenten kunnen ook algemeen zijn, zonder directe projectkoppeling.
​

5. Beveiliging en authenticatie
Authenticatie: Inloggen via e-mail en wachtwoord; wachtwoorden worden alleen als gehashte waarden opgeslagen.
​

Sessies: Na succesvolle login wordt een sessiecookie of token uitgegeven, die bij elk verzoek naar het dashboard wordt meegestuurd.
​

Autorisatie:

Admins hebben volledige toegang tot beheerfunctionaliteit.
​

Editors kunnen content beheren (projecten, agenda, documenten) maar geen gebruikersrollen wijzigen.
​

Viewers hebben alleen leesrechten binnen het dashboard of specifieke onderdelen.
​

6. Bestandsopslag
PDF-documenten worden opgeslagen in een beveiligde opslaglocatie, met:
​

Validatie op bestandstype en -grootte bij upload.
​

Opslag van de verwijzing in de database (pad/URL en metadata zoals grootte en datum).
​

Mechanisme om documenten via de publieke site of via het dashboard te benaderen, afhankelijk van de configuratie.
​

7. Logging & monitoring
De applicatie logt belangrijke gebeurtenissen, zoals:
​

Logins en mislukte inlogpogingen.
​

CRUD-acties op projecten, events en documenten.
​
Deze logs zijn nuttig voor foutanalyse, beveiligingscontrole en audit-trails.
​

