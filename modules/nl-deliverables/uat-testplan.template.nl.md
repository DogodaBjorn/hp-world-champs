# UAT-testplan — <projectnaam>

<!-- Gegenereerd door de nl-uat skill vanuit de contracten. Datum en
templateversie invullen. Geschreven voor de eindgebruiker die test, niet
voor de bouwer. -->

Versie: <x> · Datum: <dd-mm-jjjj> · Rapport: <naam> · Status: concept

## 1. Doel en aanpak

Dit testplan controleert of het rapport doet wat is afgesproken: kloppen de
cijfers, beantwoorden de pagina's de afgesproken vragen, en werkt het rapport
prettig in dagelijks gebruik. Elke test heeft een verwacht resultaat; noteer
afwijkingen in de bevindingenlijst (hoofdstuk 5).

**Nodig om te testen:** toegang tot het rapport, <eventueel: toegang tot het
bronsysteem ter controle>, ongeveer <x> minuten.

## 2. Cijfercontroles (per kengetal)

<!-- Eén blok per metric contract. Verwachte waarde onafhankelijk bepalen
(bronsysteem, bekende totalen), nooit uit het rapport zelf. -->

### <Kengetal, exact zoals in het rapport>

- **Definitie (afgesproken):** <plain_language uit het metric contract>
- **Test:** open pagina <p>, zet de filters op <periode/selectie>.
- **Verwacht:** <waarde of controlebron, bijv. "gelijk aan rapport X over
  dezelfde periode, afwijking max <x>%">
- **Resultaat:** ☐ akkoord ☐ afwijking → bevinding nr. <…>

## 3. Paginacontroles (per pagina)

### <Paginanaam> — beantwoordt: "<vraag uit het page-purpose contract>"

- In één oogopslag: is de kernboodschap van de pagina duidelijk?
- Kloppen periodes, labels en totalen met de verwachting?
- Werken de filters/doorklikken zoals beschreven: <interacties>?
- Resultaat: ☐ akkoord ☐ bevinding nr. <…>

## 4. Gebruikstest

- Vind binnen 1 minuut het antwoord op: "<realistische gebruikersvraag>".
- Controleer de definitiepagina: staan alle kengetallen erop, is de
  peildatum zichtbaar?
- Open het rapport op het scherm waarop het echt gebruikt wordt
  (vergaderzaal/laptop): blijft alles leesbaar?

## 5. Bevindingen

| Nr | Pagina/kengetal | Wat zag u | Wat verwachtte u | Ernst (blokkerend/hoog/laag) |
|---|---|---|---|---|
| 1 | | | | |

## 6. Akkoord

| Rol | Naam | Datum | Akkoord |
|---|---|---|---|
| Opdrachtgever | | | ☐ |
| Tester(s) | | | ☐ |
