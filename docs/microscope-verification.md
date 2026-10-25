# Mikroszkóp – ellenőrzés (2026-10-25)

- `npm test`: 27 fájl, 253 sikeres teszt. Új esetek: nagyítás/fókusz, tárgylemezmozgatás, részletfelismerés, ismétlés nélküli feljegyzések, változatlan felvételi állapot, hibás adatok visszautasítása, régi mentés és elküldött mintával rendelkező mentés betöltése.
- `npm run build`: sikeres. A meglévő nagy JavaScript-csomag figyelmeztetése megmarad.
- Cypress-spec kiegészítve a levélküldés utáni vizsgálat és a mentett felvétel visszaállításának esetével. Futtatási kísérlet: a 16.2.0 Cypress-bináris nincs telepítve, ezért a spec nem futott le.
- Közvetlen Chromium/CDP ellenőrzés, 1280×900: első homályos kép; Vissza; első történeti megfigyelés változatlan Noah-szöveggel; visszatérés a mikroszkóphoz; valódi pointeres tárgylemezmozgatás; 100× és 400× nagyítás, újrafókuszálás; pollen és növényi rost rögzítése; két felvétel; egy korábbi felvétel pontos állapotának visszaállítása; levél elküldése, újranyitás; levélminta megfigyelése; növény készletből eltávolítása után a tárgylemez megőrzése; tóvíz mintavétele; újratöltés után négy megfigyelés és két felvétel megőrzése. Minden ellenőrzés sikeres, böngészőhiba nélkül.
- 390×844 nézet: nincs vízszintes túlcsordulás, vizsgálat és album használható, a Vissza bezárja az ablakot. A hosszú panel függőlegesen görgethető.
- A tesztek elkülönített böngészőprofilban, saját IndexedDB-fixture-ökkel futottak; a játékos mentése nem módosult.

Képek: [vizsgálat](concepts/microscope-interactive-slide.png), [nagy nagyítás](concepts/microscope-high-magnification.png), [megfigyelések](concepts/microscope-observation-journal.png), [album](concepts/microscope-photo-album.png), [levélminta](concepts/microscope-leaf-sample.png), [tóvízminta](concepts/microscope-pond-sample.png), [telefon](concepts/microscope-mobile.png), [telefonos album](concepts/microscope-mobile-album.png).

A látómezők stilizált játékbeli illusztrációk. A mikroszkóp nem ad fajszintű diagnózist, és nem állapítja meg a méhek megfogyatkozásának okát. A régi mentések opcionális új gyűjtemény nélkül is érvényesek; első megnyitáskor kapnak gyűjteményt, az elvégzett történeti vizsgálat megmarad.
