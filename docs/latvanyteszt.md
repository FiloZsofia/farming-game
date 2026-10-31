# Kidolgozott farm — bejárható látványteszt

A jelenlegi játék rajzos formáinak részletesebb változata. Ez a próba **felváltja az elvetett, nagy pixelcsoportokkal rajzolt lilás–türkizes tesztet**; a menüben egyetlen aktív látványteszt marad.

## Megnyitás

A játék `?dev=1` paraméterrel megnyitott változatában: mentett farm folytatása → Menü → Fejlesztői eszközök → **Látványteszt · Kidolgozott farm**.

- Mozgás: a meglévő WASD/nyilak vagy a képernyő gombjai.
- **V**: ugyanabban a helyzetben az eredeti és az új látvány váltása. Az Eszközpanelről is elérhető.
- A felső tesztjelzés megnyitja az Eszközpanelt. Itt **Nappali fény**, **Esti fény** és **Kilépés a tesztmódból** választható.
- Az idő magától nem halad, így nyugodtan körbejárható a terület.

A teszt saját memóriabeli mintafarmot használ. A normál farmot és biztonsági másolatát a `SaveStore.beginTest()` védi; a teszt mozgása, kertészkedése és automatikus mentése nem kerül a tárhelyre. Kilépéskor a kiválasztott normál farm töltődik vissza. Másik tesztmód választásakor az új rajzolás kikapcsol.

## Vizuális alap

A jelenlegi farm meleg, olívazöld–krém–terrakotta színeiből indulunk ki. Hegyes, erezett levelekkel rajzolt ágas bokrok; tömörebb cserjék; tagolt páfrányok; keskeny levelű sások; mohás kövek. A növényzet tudatos csoportokban kerül a szélekhez; a középső gyep, az utak, a veranda tárgyai, az ágyások és a tó megközelítése szabadon marad.

A korábbi kétpixeles lépcsőzés helyett finom vonalak, levélformák, ellipszisek és sokszögek építik a növényeket. A táj tesztbeli gyorsítótárazott rétegei kétszeres felbontásúak, ugyanakkora játékbeli mérettel. A füvön apró, ritkás szálak vannak, nincsenek festett színfelhők vagy elszórt virágszirmok. A ház vakolatán, faanyagán és tetőzetén finom kopások, a zsalugátereken zsanérok és néhány futó levél jelenik meg. Minden elem saját, programmal rajzolt grafika, nem generált háttérkép.

A normál farm alapértelmezett rajzolása megmarad. Samhez külön, csak itt aktív próbaváltozat tartozik: a jelenlegi karakterre épülő, lejjebb kötött összefüggő copf, finomított váll–kar arányok, gallér, gombolás, mellzseb, felhajtott ujjak, öv, nadrágzsebek és részletesebb bakancs. A járásnál kisebb a kar- és fejbólintás, a láb finoman elemelkedik, a copf visszafogottan követi a mozgást. A felső tesztjelzésből nyíló panel **Sam · eredeti megjelenés / Sam · javított copf és ruházat** gombjával összehasonlítható. A normál játékban és a többi tesztmódban az eredeti Sam marad. A teljes világ átrajzolásáról a kipróbálás után döntünk; a változat nem új számozott kiadás.

## Ellenőrzés

- `npm test`: 394 sikeres teszt, köztük a mintafarm érvényessége, a szabad átjárók és a normál elsődleges/biztonsági mentés védelme.
- `npm run build`: sikeres.
- Elkülönített Chromium-eredeten ellenőrizve: indítás a felületről, mozgás, V-váltás, esti fény, mobilos elrendezés, másik két tesztmódba váltás, visszatérés a normál farmra. A tárhely teljes mentési exportja a próbák előtt és után azonos. A böngészőpróba CDP-n futott; Cypress nem állt rendelkezésre.

### Képek a tényleges játékból

- [Nappali látvány](concepts/refined-farm-day.png)
- [Esti látvány](concepts/refined-farm-evening.png)
- [Eredeti rajzolás összehasonlításhoz](concepts/refined-farm-original.png)
- [Mobilos nézet](concepts/refined-farm-mobile.png)
- [Eszközpanel](concepts/refined-farm-tools.png)


### Sam próbaváltozata

- [Játékbeli nézet](concepts/sam-study-in-farm.png)
- [Kidolgozott ruházat és javított copf közelről](concepts/sam-study-refined-detail.png)
- [Eredeti Sam ugyanott](concepts/sam-study-original-detail.png)
- [Járás közben](concepts/sam-study-walking.png)

A megjelenés nem része a farmmentésnek. Külön belépési védelem tiltja a javított változat használatát normál farmon. A karaktereszközök munkafázisai, az egyetlen érintési esemény, az irányváltás és a nyugalmi helyzetbe visszaállás mindkét megjelenéssel ellenőrzött. A böngészős próbában a mentési export a karakter kipróbálása előtt és után azonos, másik tesztmód és normál farm betöltése az eredeti megjelenést adja.
