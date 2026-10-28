# Ablakok és gombok közös arculata

Ez az összes jelenlegi és jövőbeli játékablak alapja. Ne ablakonként másold a stílust: a közös értékeket a `src/dialogue-theme.css` adja, a menük elrendezését a `src/menu.css` kezeli.

- Felület: sötétzöld átmenet (`#2b4332f7` → `#172e23fc`), 1 px meleg aranyszegély (`#bda46a`), 5 px sarok, puha sötét árnyék. Háttérként az elsötétített, megállított játék látszik; csak a Főmenü és annak alnézetei teljes képernyősek.
- Hosszabb, olvasásra szánt szöveg: `system-ui, sans-serif`. Ablakcímek, menüpontok és gombok: `Trebuchet MS, Segoe UI, sans-serif`. A Silent Pollen képi logó külön marad.
- Gomb: sötétzöld átmenet, aranyszegély, finom belső keret, világos krémszínű felirat. Rámutatás világosít, billentyűzetes fókusz jól látható. A meglévő elrendezést és méretet ne írd felül általános gombszabállyal.
- Inaktív gomb: látványosan szürkített, tényleges `disabled` állapot. Aktív fülek és tárgykártyák saját állapotjelzése megmarad. Törlés megerősítése megtarthatja a figyelmeztető vöröses színt.
- Visszalépés neve Vissza / Vissza a játékba; a Folytatás csak tényleges folytatáshoz használható. Ablakcím és felső címke ne ismételje ugyanazt.
- Tartalmi kivételek: a névtelen figyelmeztetés fehér lapja és ceruzabetűi, a szereplők beszédbuborékai/portréi, a mikroszkóp vizsgálati képe, az ünneplések és szirmok megmaradnak. A körülöttük lévő ablakkeret és a műveleti/Vissza gombok azonban közösek.
- Minden új vagy módosított ablaknál ellenőrizd a billentyűzetet, a mobilnézetet, az inaktív gombokat és a közös stílus tényleges érvényesülését. Ne csak a legutóbb említett kivételeket nézd át.

## Kötelező ellenőrzési kör

Főmenü, Menü és Beállítások; Történet és Irányítás; Postaláda (a laborlevéllel is), Eladóláda, Magkatalógus, Napló; a Készlet valamennyi füle; gépek és tárolóláda; hirdetőtábla mindkét lapja; mindhárom bolt vásárlási ablaka; Annie, Leo és Simon beszélgetései; kutatási ablakok, jutalmak és megerősítések. A speciális tartalmakat ne alakítsd át általános menüvé.

## Tárgyak áthelyezése

A mozgatható tárgyak felvétele Bontóvassal, a `placed-items.ts` közös útvonalán történik. Külön Felveszem gomb nincs. E-vel megvizsgáljuk/használjuk, Bontóvassal rákoppintva visszavesszük a Készletbe. A teli tárolóládák és a dolgozó vagy át nem vett terméket tartalmazó gépek nem vehetők fel; sikertelen mentés vagy teli hátizsák esetén a tárgy a helyén marad.
