FUNCTIONAL.md (uitgebreider)
1. Navigatie & Interface
De Fabok webapplicatie bestaat uit een publiek gedeelte en een beveiligd dashboard (CMS), elk met een eigen navigatiestructuur.
​
Het publieke deel richt zich op bezoekers die inspiratie zoeken in projecten, terwijl het dashboard bedoeld is voor gebruikers die content beheren en modereren.
​

Publiek:

Homepagina met korte toelichting op Fabok/VABOK, landingspagina content en verwijzingen.
​

Projectenlijst met filters op status, provincie en tags, plus detailpagina’s met beschrijvingen en documenten.
​

Interactieve Scholenkaart die de locaties van partners en scholen in Nederland toont met Maplibre GL.
​

Agenda-overzicht met evenementen en de mogelijkheid voor bezoekers om zich in te schrijven.
​

Documentenoverzicht voor algemene documenten en projectgebonden PDF’s.
​

Dashboard:

Zijbalknavigatie met secties voor overzicht, beheer-projecten, mijn-projecten, agenda, inschrijvingen, landingspagina en gebruikersbeheer.
​

Overzichtspagina’s met tabellen, zoek- en filtermogelijkheden.
​

2. Features per module
Projectbeheer
Overzicht:

Lijstweergave met kolommen zoals titel, status, provincie, publicatiestatus en datum van laatste wijziging.
​

Filters op actieve/gearchiveerde projecten en op gepubliceerd/draft.
​

Aanmaken/Bewerken:

Formulieren voor titel, omschrijving, doelen, doelgroep, tags, provincie en contactgegevens.
​

Ondersteuning voor rich-text velden waar nodig (bijv. uitgebreide beschrijvingen).
​

Publiceren:

Mogelijkheid om projecten als concept op te slaan, later te publiceren of te depubliceren.
​

Gepubliceerde projecten worden direct zichtbaar in de publieke projectenlijst.
​

Agenda & Evenementen
Tijdlijn:

Overzicht van aankomende en eerdere events, gesorteerd op datum.
​

Visuele aanduiding van verlopen events of belangrijke deadlines.
​

Koppeling:

Mogelijkheid om bij het aanmaken van een event een gekoppeld project te selecteren.
​

Weergave van gekoppelde events op de projectdetailpagina en vice versa.
​

Documentenbeheer (PDF)
Upload:

Interface voor slepen of selecteren van PDF-bestanden.
​

Validatie op bestandstype; alleen PDF wordt geaccepteerd.
​

Categorisering:

Instelling of een document algemeen is (aan landingspagina/thema) of gekoppeld aan specifiek project.
​

Filtermogelijkheden in het dashboard op categorie, project of uploaddatum.
​

Metadata:

Automatische registratie van bestandsgrootte, bestandsnaam en uploaddatum.
​

Optioneel veld voor een korte omschrijving of titel voor het document.
​

Beheer (Admin)
Gebruikerslijst:

Overzicht van alle accounts met naam, e-mail, rol en status.
​

Mogelijkheid om te zoeken en te filteren op rol of status.
​

Accountstatus:

Functies om nieuwe gebruikers te activeren, accounts te blokkeren of te deactiveren.
​

Feedback in de interface (bijvoorbeeld badges of labels) die de status visueel aangeven.
​

Rollenbeheer:

Instellen van rollen (`admin`, `landingpage_editor`, `project_editor`, `viewer`) per gebruiker.
​

Rollen bepalen de toegang tot dashboardsecties (bijv. Landingspagina Editor heeft alleen toegang tot de landingspagina sectie).
​

Accountstatus beheer (`pending`, `approved`, `rejected`) door admins.
​

3. User stories (uitgebreider)
Rol	Ik wil...	Zodat ik...
Bezoeker	De nieuwste projecten zien	Geïnspireerd raak en actuele voorbeelden voor mijn onderwijs vind. 
​
Bezoeker	Documenten bij een project kunnen openen	Materialen direct kan gebruiken in lessen of overleg. 
​
Projectleider	Een deadline toevoegen aan de agenda	Mijn stakeholders op tijd op de hoogte zijn van belangrijke momenten. 
​
Projectleider	Gearchiveerde projecten terugvinden	Eerdere ervaringen en resultaten kan raadplegen. 
​
Admin	Een overzicht van gearchiveerde projecten zien	De historie van het platform kan bewaken en rapportages kan maken. 
​
Editor	De tekst van de landingspagina aanpassen	De actuele visie en projecten van VABOK kan communiceren. 
​
Editor	Projecten als concept opslaan	Later wijzigingen kan doorvoeren vóór publicatie. 
​
4. UI/UX flow (uitgebreider)
Inloggen:

Gebruiker voert e-mailadres en wachtwoord in.
​

Systeem valideert de gegevens via de login-API, controleert accountstatus en rol.
​

Bij succes wordt een sessiecookie gezet en gaat de gebruiker naar het dashboard-overzicht.
​

Project publiceren: