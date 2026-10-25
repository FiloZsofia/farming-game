# Erdős út és vízminta-visszajelzés – 2026-10-25

A korábbi teljes téglalapos fakizárás helyett tagolt lombkorona- és törzstávolság védi az ösvényt. A túl közeli fahelyek körül szabad helyet keresünk, így több fa marad a tájban. A törzsütközés ugyanazokat a fákat használja, mint a rajz. Ha egy mentett falusi pozícióra visszakerül egy törzs, a betöltés csak Samet helyezi a legközelebbi szabad helyre; a mentés többi adata megmarad. Erre külön, a forrásadat érintetlenségét is ellenőrző teszt készült.

Közvetlen Chromium/CDP ellenőrzés: kapu és lefelé mutató tábla; erdei elágazás és a tér megközelítése; tóvízmintavétel; a sikeres visszajelzés P elem, nem gomb; ismételt mintavétel is működik. Böngészőhiba nem jelentkezett. Elkülönített tesztprofil, a játékos mentése nélkül. A Cypress-bináris továbbra sem érhető el, ezért ez a közvetlen böngészős ellenőrzés nem Cypress-futás.

Kötelező ellenőrzések: `npm test` (255 teszt) és `npm run build` sikeres. A build meglévő csomagméret-figyelmeztetése megmaradt.

Képek: [Falu tábla](concepts/village-downward-sign.png), [sűrűbb erdei út](concepts/village-dense-pathside-trees.png), [tér megközelítése](concepts/village-dense-square-approach.png), [vízminta szöveges visszajelzés](concepts/pond-sample-plain-confirmation.png).
