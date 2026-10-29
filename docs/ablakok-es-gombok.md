# Ablakok és gombok közös arculata

Ez az összes jelenlegi és jövőbeli játékablak alapja. Ne ablakonként másold a stílust: a közös értékeket a `src/dialogue-theme.css` adja, a menük elrendezését a `src/menu.css` kezeli.

- Felület: sötétzöld átmenet (`#2b4332f7` → `#172e23fc`), 1 px meleg aranyszegély (`#bda46a`), 5 px sarok, puha sötét árnyék. Háttérként az elsötétített, megállított játék látszik; a Főmenü és annak alnézetei teljes képernyősek. Az irányítható kivonatkészítés az eredeti Műhely teljes játékterében, külön ablak nélkül zajlik.
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

- A Menü gombjai között megjelenő navigációs hivatkozások (pl. Hibabejelentés) a közös gombstílust használják: azonos szegély, belső keret, háttér és hover. A Főmenü lábléchivatkozása továbbra is visszafogott szöveg.

- A boltok termékkártyáin a keretes vásárlógomb és az ikon ne tapadjon a kártya széléhez: asztali belső térköz 14×16 px, mobilon 12 px, kártyák között 10/8 px. Mobilon a gomb a termékszöveg alatt, balra igazodva jelenjen meg; a görgetősáv mellett is maradjon tér.

### Teszttérkép és műhelyfeliratok

- A térkép meleg papírra rajzolt, botanikai terepnaplót idéz. A helynevek vektoros, nagyobb betűk; épületikonjai és útvonalai a meglévő pályából származnak. Hangulati látványterv nem jogosít fel új épület vagy helyszín hozzáadására.
- A kivonatkészítés világ fölötti célpontnevei képernyőtérben, rendszerbetűvel készülnek, nem kis felbontású, felnagyított játéktextúraként. A felirat szükség esetén feljebb mozdul, hogy ne fedje Samet.

- A teszttérkép maga tölti ki a megnyíló ablakot, külön fejléc/párnázott keret nélkül. A Vissza gomb a térképre kerül; külön Sam-helye jelmagyarázat nincs.
- A világban megjelenő Phaser-szövegek legalább 4-es felbontással készülnek, beleértve az interakciós kérdőjelet/három pontot, Sam gondolatait és a táblákat.

- Annie első érkezése is a közös portrés beszédablakot használja. Az érkezési cím és felirat megmarad; a szereplő szavai a beszédbuborékba, a készletbe kerülésről és kezelésről szóló kezdő segítség külön, a buborék alá kerül. Más ablak nyitása törli ezt a kiegészítő megjegyzést.
