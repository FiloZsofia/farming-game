# Tóbővítés és tórajz ellenőrzése

A rendes játék elkülönített böngészőpéldányában, a SaveStore.beginTest() mentési védelmével ellenőrizve. A játékos saját mentése nem módosult.

- Tervrajzkártya, indítás, csatlakozó partszakasz, visszafelé javítás az első pontig, megszakítás eszközválasztással.
- A kipróbált +6,2%-os bővítés ára 112 gold és 16 kő; egyszeri levonás, a lerakott tavirózsa, nád és fészek megőrzése.
- Érvénytelen, különálló kijelölésnél inaktív megerősítés.
- Mentésellenőrzés és visszaolvasás megőrzi a partvonalat; más farm validálását nem befolyásolja a pillanatnyilag betöltött tó.
- A térkép közös geometriából követi a bővítést. Mobilfelület 390 × 844 méretben ellenőrizve.
- Kacsák szárazföldi lábakkal, részletesebb tollazattal; új tavirózsa és szalmafészek.

Képek: `concepts/production-natural-pond-lily-nest-ducks.png`, `concepts/production-pond-expansion-preview.png`, `concepts/production-pond-expansion-built.png`, `concepts/production-map-expanded-pond.png`, `concepts/production-pond-expansion-mobile.png`.

## Látható bővítés javítása

Valódi böngészős egérkattintás az Elkészítem gombon: az ablak bezárult, a 112 gold / 16 kő egyszer levonódott, a mentett bővítés megmaradt és a táj gyorsítótára újraépült. A látható víz követi az új partot. A gyümölcsfák és az ugró hal közeli képen ellenőrizve. A teljes tesztsor 522 tesztje és a production build sikeres.

Képek: `concepts/production-pond-expanded-orchard-refined.png`, `concepts/production-orchard-sparse-pointed-leaves.png`, `concepts/production-pond-fish-ripples.png`.

## Automatikus partsimítás és visszatérítés

- A sarkos kijelölés kisimul, területe numerikus pontossággal megmarad; az előnézet és az ár ugyanazon a geometrián alapul.
- Régi part betöltéskori rendezése díjmentes, idempotens, tárgy- és játékosvédett. Adatbázisos mentés/betöltés megőrzi a rendezést és a visszatérítést.
- Többlépcsős új vásárlások pontos gold/kőösszege mentődik. Visszabontás után az eredeti egyenleg helyreáll, második visszatérítés nincs. Régi vásárlásoknál területarányos visszatérítés.
- Valódi böngészős kattintás a Tervrajzok visszabontó gombján, majd a megerősítésen: 4888 gold / 484 kő → 5000 gold / 500 kő, bővítés törölve, panel bezárva.
- Mozgó hullámrajz két időpillanatban eltér, halaktól függetlenül. A gyümölcsfák egyetlen koronája közeli képen ellenőrizve.
- 530 sikeres teszt és sikeres production build.

Képek: `concepts/production-automatic-pond-smoothing.png`, `concepts/production-orchard-single-crown.png`, `concepts/production-pond-removal-refund.png`.
