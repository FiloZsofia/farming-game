# Alkatrészes teszt és életerő-segítség

A játék címének végére írd: `?dev=1`, majd folytasd a farmodat. Menü → Fejlesztői eszközök → Műhelyalkatrészek · beszélgetésteszt.

- **Műhely · az egyszeri gondolat előtt**: Vizsgáld meg a tartályt, a csöveket, a szűrőházat és a hűtőspirált. A haladás 1 / 4-től követhető; a negyedik rész után megjelenik a javítás és az anyaglista, az ablak bezárásakor Sam gondolata. Újabb vizsgálatkor nem ismétlődik.
- **Annie** vagy **Leo**: E-vel nyílik a beszélgetés a megfelelő konkrét alkatrészes gombbal.
- A felső TESZTMÓD gombbal újra megnyitható az eszközpanel és más kezdőpont választható. A Kilépés a tesztmódból visszatölti a normál farmot.

A teszt a `SaveStore.beginTest()` védett, memóriabeli mentését használja. A kiinduló normál farm és a biztonsági másolata nem módosul a teszt műveleteitől. A három kezdőpont külön, előkészített példányt készít; a szokásos játék nem változik tesztfarmra.

## Ellenőrzés — 2026-11-06

- 410 teszt / 62 fájl; sikeres build. Régi mentés, új opcionális életerő-jelző és mindhárom tesztkezdőpont érvényessége ellenőrizve.
- Cypress-bináris nem állt rendelkezésre; Chromium CDP-vel, izolált böngészőprofilon ellenőrizve a három kezdőpont, a gondolat és a témák, Simon szövege, az öntöző leírása, az erdei segítség egyszerisége és az evés tényleges +1 szíve.
- A normál mentés exportált tartalma a memóriateszt előtt és után azonos.
- Az animáció időpontjaiban ellenőrizve az 5 → 3 → 4 teli szív. Mobilnézet: 390 × 844. Csökkentett mozgásnál statikus szívek jelennek meg.

[Kezdőpont a műhelyben](concepts/material-test-workshop-start.png) · [Gondolat](concepts/material-test-once-thought.png) · [Annie](concepts/material-test-annie-topic.png) · [Leo](concepts/material-test-leo-topic.png) · [Simon és az öntöző](concepts/simon-stick-exception-irrigation.png)

[Öt szív](concepts/forest-first-health-help.png) · [Sérülés](concepts/forest-health-help-damaged.png) · [Evés után](concepts/forest-health-help-healed.png) · [Mobil](concepts/forest-first-health-help-mobile.png)


## Életerő-animáció előnézete

Menü → Fejlesztői eszközök → **Életerő-segítség · animáció**. Bármikor újranézhető; nem változtatja meg a farm életerejét vagy a segítség egyszeri megjelenési jelzőjét.

2026-11-06: Chromium CDP-vel ellenőrizve az egymás utáni sérülés, az alma és öt aranyló fénypont, az alulról feltöltés, a dobbanás és fényudvar, a 390 × 844 mobilnézet és a csökkentett mozgás statikus változata. A normál mentés változatlan maradt. Cypress-bináris továbbra sem állt rendelkezésre.

[Alma és fénypontok](concepts/health-help-animated-motes.png) · [Feltöltődés](concepts/health-help-animated-filling.png) · [Gyógyulás](concepts/health-help-animated-healed.png) · [Mobil](concepts/health-help-animated-mobile.png)


## Egységes panel és tárgyátadás ellenőrzése — 2026-11-06

410 teszt és a build sikeres. Chromium CDP-vel, izolált profilban és memóriateszten ellenőrizve: öt egységes szakasz, sorrend és elválasztók, asztali és 390 × 844 mobilnézet, aktív látványteszt saját szakaszában maradó összehasonlító gombjai. Az üvegedény és a lenszövet sikeres átvétele bezárja a párbeszédet; az animáció megjelenik, követi a kamerát és két másodperc után eltűnik. Nincs ismételt ajándék. Szimulált mentési hibánál nincs animáció vagy tárgy; helyreállított mentés után újrapróbálható. A normál farm exportja a memóriateszt előtt és után azonos. Cypress-bináris helyett Chromium CDP futott.

[Panel](concepts/developer-tools-unified-desktop-bottom.png) · [Mobil](concepts/developer-tools-unified-mobile-bottom.png) · [Aktív látványteszt](concepts/developer-tools-unified-art-active.png) · [Üvegedény](concepts/annie-glass-gift-animation.png) · [Lenszövet](concepts/leo-linen-gift-animation.png)

## A négy vizsgálat és a Célok sorrendje — 2026-11-06

413 teszt / 62 fájl, sikeres build. A Cypress-forgatókönyv új elvárása szerint az első tartályvizsgálat még nem mutat anyaglistát vagy javítógombot, a HUD és a Célok 1 / 4 vizsgálatot jelez. Cypress-bináris helyett az alábbi böngészős ellenőrzés Chromium CDP-vel, izolált profilban, memóriabeli tesztfarmon futott.

- Az első három vizsgálatnál nincs javítási cél, anyaglista vagy gondolat. A negyedik után megjelenik a javítópanel, az ablak bezárásakor az anyaglistás cél és Sam új gondolata.
- A Célok fül sorrendje: melléképület felfedezése → berendezés megvizsgálása (teljesítve, 4 / 4) → javítás (folyamatban).
- Szimulált mentési hibánál a negyedik vizsgálat és a gondolat jelzője nem mentődik el tévesen; újrapróbálás sikeres. További vizsgálat nem ismétli a gondolatot.
- Régi részleges mentés 2 / 4 vizsgálata, már átvett üvegedénye és korábbi segítségjelzője megmarad. A már javított berendezések vizsgálati célja teljesített.
- A kisebb beszélgetésgombok asztali és 390 × 844 mobilnézetben is elférnek. A tárgyátadó animáció tovább működik.
- A normál farm exportja a teszt előtt és után azonos.

[1 / 4 vizsgálat](concepts/workshop-inspection-goal-one-of-four.png) · [Célok vizsgálat közben](concepts/workshop-inspection-goals-tab-partial.png) · [Negyedik vizsgálat](concepts/workshop-fourth-inspection-repair-panel.png) · [Gondolat és anyaglista](concepts/workshop-four-parts-thought-and-materials.png) · [Célok sorrendje](concepts/workshop-goals-inspect-before-repair.png)

[Kisebb Annie-gombok](concepts/merchant-compact-annie-desktop.png) · [Leo](concepts/merchant-compact-leo-desktop.png) · [Mobil](concepts/merchant-compact-leo-mobile.png)
