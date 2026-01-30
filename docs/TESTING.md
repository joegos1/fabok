TESTING.md (uitgebreider)
1. Inleiding
Dit document beschrijft de teststrategie voor de Vabok webapplicatie, met als doel de kwaliteit, stabiliteit en gebruiksvriendelijkheid van het platform te borgen gedurende de volledige ontwikkelcyclus.
​
De focus ligt op het gestructureerd testen van zowel de functionaliteit (werken de features zoals bedoeld) als de technische aspecten (performance, beveiliging, betrouwbaarheid).
​

2. Testdoelen
De belangrijkste doelen van het testtraject zijn:
​

Valideren dat alle kernfunctionaliteiten (projectbeheer, agenda, documenten, dashboard) correct werken volgens de documentatie.
​

Waarborgen dat wijzigingen en nieuwe features geen bestaande functionaliteiten niet kapot maken .
​

Beoordelen of de performance voldoende is voor de verwachte aantallen gebruikers en data.
​

Controleren dat de beveiligingsmaatregelen rondom accounts, rollen en sessies correct zijn geïmplementeerd.
​

3. Testtypen
3.1 Unit tests
Unit tests richten zich op individuele functies, services of componenten binnen de codebase.
​

Doel: Logica valideren in isolatie (bijvoorbeeld validatie van projectvelden, datumcalculaties voor de agenda).
​

Scope: Backend-services en front-end componenten (formuliervalidatie).
​

3.2 Integratietests
Integratietests verifiëren het samenspel tussen meerdere modules, zoals API, database en frontend.
​

Voorbeelden:

Aanmaken van een project via het dashboard en controleren of het correct zichtbaar is in de publieke projectenlijst.
​

Koppelen van een agenda-item aan een project en verifiëren dat deze relatie in de UI en database consistent is.
​

3.3 End-to-end (E2E) tests
E2E-tests bootsen het gedrag van een echte gebruiker na, van login tot publicatie.
​
Typische scenario’s:

Een editor logt in, maakt een nieuw project aan, voegt een document toe en publiceert dit project.
​

Een bezoeker opent de publieke site, filtert projecten op provincie en bekijkt gekoppelde documenten.
​

3.4 Acceptatietests
Acceptatietests worden uitgevoerd samen met de opdrachtgever (bijvoorbeeld Fabok/VABOK) om te beoordelen of de applicatie voldoet aan de functionele behoeften.
​
Hierbij worden de afgesproken user stories systematisch doorlopen, inclusief randgevallen en realistische scenario’s uit de praktijk.
​

4. Testomgeving
Omgeving: Er wordt getest op een aparte test- of stagingomgeving die qua configuratie zoveel mogelijk overeenkomt met productie (zelfde database-engine, identieke configuratie voor authentication, etc.).
​

Testdata: Gebruik van representatieve testdata, met voorbeeldprojecten, meerdere agenda-items en documenten, inclusief gearchiveerde projecten en verschillende roltypes.
​

Browsers & apparaten: Minimaal testen in moderne browsers (Chrome, Edge, Firefox) en op verschillende resoluties (desktop, tablet, mobiel).
​

5. Testcases & scenario’s
Testcases worden gekoppeld aan de user stories en modules uit de functionele documentatie.
​

Voorbeelden:

Projectbeheer:

TC-P-01: Nieuw project aanmaken met alle verplichte velden ingevuld → Project verschijnt als draft in de lijst.
​

TC-P-02: Project publiceren → Project wordt zichtbaar in de publieke lijst.
​

Agenda & Inschrijvingen:

TC-A-01: Agenda-item koppelen aan een project → In projectdetailpagina wordt het bijbehorende event getoond.
​

TC-A-02: Bezoeker schrijft zich in voor een event → Inschrijving verschijnt in het dashboard bij het betreffende event.
​

Scholenkaart:

TC-S-01: Kaart laden → Alle scholen uit de database zijn zichtbaar als markers op de Maplibre kaart.
​

Landingspagina:

TC-L-01: Editor wijzigt landingspagina tekst → Wijziging is direct zichtbaar op de homepage.
​

6. Regressietesten
Bij iedere release wordt een set regressietests uitgevoerd op de belangrijkste flows (login, projectbeheer, agenda, documenten).
​
Deze set wordt stapsgewijs uitgebreid naarmate er meer features bijkomen, zodat stabiliteit over meerdere iteraties heen is gegarandeerd.
​

7. Rapportage
Na elke testronde wordt een kort testrapport opgesteld met:
​

Uitgevoerde tests en datum.
​

Bevindingen per prioriteit (kritiek, hoog, middel, laag).
​

Advies over go/no-go voor deploy naar productie.
​