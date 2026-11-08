# Terményátadó · Mara fuvarja

2026-11-08. Önálló, memóriabeli próba a Fejlesztői eszközökből. A normál eladóláda és gazdaság változatlan. A próba nem igényli a kertészeti teszt használatát.

## Kipróbálás

1. Fejlesztői eszközök → Terményátadó · Mara fuvarja → Teszt indítása.
2. A déli kerítésnél, a kapu bal oldalán álló vászontetős átadó elé lépve E vagy kattintás nyitja a feltöltést. A Készletben többféle termés vár.
3. Egy kattintás teljes halmot, Shift+kattintás egy darabot tesz át. Kilenc doboz van három oszlopban: dobozonként egyféle termés, azonos fajtából több darab. A dobozra kattintva fuvar előtt visszavehetők a termések. A világban is látszanak a tartalmak.
4. Fuvar indítása: Mara teherautóval érkezik, kiszáll, dobozonként rakodik. Közelről E vagy kattintás indít beszélgetést; az első megszólítás után szerepel az Ismerősök között. Beszélgetés közben megáll a rakodás.
5. A bevétel az utolsó doboz átvételekor érkezik, egyszer. A próba a meglévő eladási árakat használja. A fuvar indításától a készletmozgatás zárolt, a napi árukészlet rögzített.
6. Következő nap után új fuvar indítható. Az aznap már lezárt fuvar nem fizethet újra.
7. Menü → Kilépés a tesztmódból visszatér a saját farmhoz.

## Mara

Jóváhagyott név és irány: határozott, csipkelődő humorú női fuvaros. Felhajtott ujjú ing, munkásmellény, fonott haj és munkáskesztyű. Eredeti, kódból rajzolt próbasprite és portré; nem külső asset. A munkájáról és a fuvarról lehet kérdezni. A pontos mondatai és grafikája tovább finomíthatók.

A végleges napi érkezési idő még egyeztetendő. Ebben a próbában kézi indítás és napléptetés működik. Nem kerül át a rendes játékba Mara ismeretsége vagy a próba bevétele.

## Mentés és ellenőrzés

A SaveStore.beginTest() védelme indulás előtt bekapcsol. Az alapfarm jelenete szünetel, külön jelenet rajzol és kezeli az inputot; a tételek és pénz csak memóriában élnek. A teszt kilépése teljes újratöltéssel tisztítja az eseménykezelőket.

Három modellteszt ellenőrzi a dobozok korlátját, készletmozgatást, zárolást, meglévő árakat, egyszeri fizetést és következő napot. Izolált Chromium CDP-próba ellenőrizte a tényleges E-interakciót, feltöltést, rakodást, beszélgetést, Ismerősök fület, kifizetést, második napot, kilépést és a normál mentés/backup változatlanságát. Cypress-bináris a környezetben nem érhető el.

Képek: [megtöltött átadó](concepts/market-trial-stocked-stand.png), [feltöltés](concepts/market-trial-transfer-window.png), [Mara](concepts/market-trial-mara-conversation.png), [rakodás](concepts/market-trial-mara-loading.png).
