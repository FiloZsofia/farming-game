# Alkatrészes teszt és életerő-segítség

A játék címének végére írd: `?dev=1`, majd folytasd a farmodat. Menü → Fejlesztői eszközök → Műhelyalkatrészek · beszélgetésteszt.

- **Műhely · az egyszeri gondolat előtt**: E-vel vizsgáld meg a tartályt, majd Vissza. Sam jóváhagyott gondolata megjelenik; újabb vizsgálatkor nem ismétlődik.
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
