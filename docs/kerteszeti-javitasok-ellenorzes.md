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
- A vízigényről szóló két felismerés és a két takaráseltűnés mentésen át is egyszeri. Minden felismeréshez, a takaráseltűnéshez is az ágyás megvizsgálása kell; a közelségi automatikát eltávolítottuk.
- Elkülönített böngészőben a Komposztáló közepétől 20 egységre, egy szintén elérhető tárolóláda mellett E-interakció: a Komposztáló ablaka nyílt meg.
- Faösvény az alapválasztás; az ösvény ára faikont, a tó ára gold- és kőikont használ.
- [Fűszernövények és terményikonok](concepts/production-herbs-and-produce-refined.png), [tervrajz-alapanyagikonok](concepts/production-blueprints-material-icons.png), [karózási guggoló póz](concepts/production-staking-crouch.png).

## Túlérett bogyók, támasz és talajjelzés

- A távoli növényhely hullott gyümölcse az ágyás széléről is egyszer gyűjthető, kizárólag komposztálási alapanyagként. A termő tő és a mentés megmarad. Elkülönített böngészőben a gyűjtőgomb sikeresen 1 hullott gyümölcsöt adott és eltávolította a kupacot.
- Málna, szeder és paradicsom rövid újratermési ciklusa is megáll támasz nélkül; megfelelő támasz után beérik. A közös `support` mozdulat megmarad, a jövőbeli támaszokra vonatkozó szabály az AGENTS.md-be is bekerült.
- Kavicstakart Száraz fűszerszegély két nap után: a nedvességszám már 1 lehet, de a vízellátás még megfelelő, repedés nincs. A szükséges következő öntözésnél a rendszer vizet ad, repedés nincs.
- [Túlérett gyümölcs gyűjtése](concepts/production-overripe-berry-collection.png), [körte és facsemeteikon](concepts/production-pear-shape.png).

## Fajtánkénti bogyós támrendszer
- Menta kiválasztása mellett is megjelenik a málna és a szeder külön építőgombja. Málna építése: fa 20 → 14, csak a málna támasza kész, mozdulat `support`. Szeder építése: fa 14 → 8, külön szedertámasz kész, mozdulat `support`.
- A mentésteszt a két faj külön állapotát és a régi közös támasz kizárólag szedertámaszként történő, ismételhető betöltését ellenőrzi.
- [A külön támaszok oszlopai, huzalai és kötözései](concepts/production-separate-berry-supports.png).
