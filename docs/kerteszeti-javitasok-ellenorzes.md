# Kertészeti javítások ellenőrzése – 2026-11-13

- `npm test -- --maxWorkers=2`: 84 tesztfájl, 558 sikeres teszt.
- `npm run build`: sikeres TypeScript-ellenőrzés és Vite build.
- Elkülönített Chromium, védett tesztmentés: mind a hat Tervrajz-kártya címe 17 px, fejlécképe 36 px, alapanyagikonja 24 px. Mobil: 390 px nézetben nincs vízszintes túllógás, minden kártya 306 px széles.
- Esős ágyás reggeli ütemezése: nulla vízsugár; napos ágyás: 5500 ms.
- Öntözött Száraz fűszerszegélyre kattintás: „A szárazságtűrő növényeket csak 2 naponta kell öntözni.”
- A mentésen át megőrzött, egyszeri megfigyeléseket, a faültetés/szüret egy pontját és szinthatárát, az egyszeri virágok újravethetőségét automatikus regressziós tesztek fedik.

Képek:
- [Egységes tervrajzkártyák](concepts/production-blueprints-unified.png)
- [Mobilnézet](concepts/production-blueprints-unified-mobile.png)
- [Kidolgozott borsóhüvelyek](concepts/production-pea-pods-refined.png)
