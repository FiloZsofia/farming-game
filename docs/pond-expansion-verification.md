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

## Új alapforma és 95 gold / 16 kő ár

- A feltöltött 113. napi mentés 64 partvonalpontja bitpontosan egyezik az új alapforma adataival.
- A feltöltött mentés decodeSnapshot eredménye változatlan; a 224 gold / 32 kő korábbi fizetési összesítés megmarad.
- Új farm: saját alapforma-azonosító, 100%-os tóméret, 0 befizetés, visszabontógomb nélkül.
- Az adott alaphoz számolt pontos 10%-os növekedés ára 95 gold / 16 kő, új és régi alapformánál is.
- Böngészős próba új alapról: +4,6% bővítés, 44 gold / 8 kő levonás. Visszabontás után pontosan az új alapforma és az eredeti 5000 gold / 500 kő állt vissza.
- Régi farm ellenőrzése aktív új partvonal mellett is független; új mentés visszaolvasása és befizetés-visszatérítés automatikus tesztben.
- 534 sikeres teszt, sikeres build. Melegebb vízszín közeli böngészős képen ellenőrizve.

Képek: `concepts/production-estate113-default-pond-warm-blue.png`, `concepts/production-pond-price95-stone16.png`.

A melegebb kék színt a felhasználó a képek alapján elvetette; az eredeti zöldeskék palettát visszaállítottuk. A végleges szín és az új alapforma képe: `concepts/production-estate113-default-pond-approved-color.png`. Az új ár és a farmonkénti alapforma megmaradt; ismételt böngészős ellenőrzésben a feltöltött régi mentés és a korábbi befizetés továbbra is változatlan.
