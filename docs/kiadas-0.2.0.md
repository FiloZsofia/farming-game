# 0.2.0 kiadásellenőrzés — 2026. október 31.

A felhasználó jóváhagyásával a teljes tesztelt Noah-fejezet és minden kapcsolódó kiegészítés a normál játék része. A mentésformátum változatlanul 18.

- `npm test`: 57 tesztfájl, 388 sikeres teszt. A korábbi mentések és az adatvesztés elleni védelem mellett a teljes fejezet normál IndexedDB-mentése, a déli pozíciók, a félbehagyott kivonatkészítés és a tesztmód mentési elszigetelése is ellenőrzött.
- `npm run build`: sikeres.
- Elkülönített böngészőeredeten (`127.0.0.1`, a meglévő `localhost` farmok érintése nélkül), fejlesztői mód nélkül végzett Chromium-ellenőrzés: levél átvétele és újratöltése; botfejlesztés egyszeri levonása és újratöltése; M-térkép; déli mentett pozíció; mindkét erdő ellenfeleinek visszatérése; kivonatkészítés közbeni mentés és folytatás; eredmény megfigyelése és nyugtázása; korábbi mikroszkópos minták elérése; biztonságos kilépés a Műhely munkateréből; mindkét menü verziószáma. JavaScript-kivétel nem jelentkezett.
- Cypress-futtatás nem történt; a fenti böngészőellenőrzés Chromium DevTools Protocolon keresztül zajlott.

Ellenőrzött képek:

- [Térkép a normál játékban](concepts/release-020-normal-map.png)
- [Mentett kísérlet folytatása a Műhelyben](concepts/release-020-normal-extraction.png)
- [A jelenlegi történet vége az eredmény megfigyelése után](concepts/release-020-normal-story-end.png)
- [0.2.0 a játék menüjében](concepts/release-020-version-menu.png)
- [0.2.0 a főmenüben](concepts/release-020-version-start.png)
