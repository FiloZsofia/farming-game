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

## Második javítási kör

- Határos takarási tesztek: mulcs 6 nap, kavics 5 nap; előző napon teljes takarás, határnap reggelén teljes eltűnés, alap vízigény és újratakarás helyreállása.
- A vízigényről szóló két felismerés és a két takaráseltűnés mentésen át is egyszeri. A takaráseltűnés a vezérlő közelségi ellenőrzéséből, ablak nélkül észlelhető; az egyéb felismerésekhez megvizsgálás kell.
- Elkülönített böngészőben a Komposztáló közepétől 20 egységre, egy szintén elérhető tárolóláda mellett E-interakció: a Komposztáló ablaka nyílt meg.
- Faösvény az alapválasztás; az ösvény ára faikont, a tó ára gold- és kőikont használ.
- [Fűszernövények és terményikonok](concepts/production-herbs-and-produce-refined.png), [tervrajz-alapanyagikonok](concepts/production-blueprints-material-icons.png), [karózási guggoló póz](concepts/production-staking-crouch.png).
