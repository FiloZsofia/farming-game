# Erdőszéli látványteszt

Első bejárható formanyelvi prototípus a lilás–türkizes, finoman meseszerű irányhoz. A ház–veranda–kert–tó ismerős elrendezésén próbálható ki. Saját, kóddal rajzolt elemekből épül, nem generált háttérképből.

## Megnyitás

A játék `?dev=1` paraméterrel megnyitott változatában: mentett farm folytatása → Menü → Fejlesztői eszközök → **Látványteszt · Lilás–türkizes erdőszél**.

- Mozgás: a meglévő WASD/nyilak vagy a képernyő gombjai.
- **V**: ugyanabban a helyzetben az eredeti és az új látvány váltása. Az Eszközpanelről is elérhető.
- A felső tesztjelzés megnyitja az Eszközpanelt. Itt **Nappali fény**, **Esti fény** és **Kilépés a tesztmódból** választható.
- Az idő magától nem halad, így nyugodtan körbejárható a terület.

A teszt saját memóriabeli mintafarmot használ. A normál farmot és biztonsági másolatát a `SaveStore.beginTest()` védi; a teszt mozgása, kertészkedése és automatikus mentése nem kerül a tárhelyre. Kilépéskor a kiválasztott normál farm töltődik vissza. Másik tesztmód választásakor az új rajzolás kikapcsol.

## Vizuális alap

Határozott, lépcsőzetes pixelcsoportok; homogénebb fűalap kevés apró fűjellel; türkizes árnyékok, mályvás részletek; rétegzett bokrok, páfrányok, kevés száron álló lila virágzat. Nincsenek elszórt virágszirmok. A növénycsoportok elkerülik az utakat, a verandát, a használható tárgyakat, az ágyásokat és a tó megközelítését. Az új díszfák törzsei akadályt képeznek, a bokrok alacsony dísznövényzetként működnek.

A normál farm alapértelmezett rajzolása megmarad. Sam haját és ruháját ez a próba még nem módosítja. A teljes világ átrajzolásáról a kipróbálás után döntünk; a változat nem új számozott kiadás.

## Ellenőrzés

- `npm test`: 391 sikeres teszt, köztük a mintafarm érvényessége, a szabad átjárók és a normál elsődleges/biztonsági mentés védelme.
- `npm run build`: sikeres.
- Elkülönített Chromium-eredeten ellenőrizve: indítás a felületről, mozgás, V-váltás, esti fény, mobilos elrendezés, másik két tesztmódba váltás, visszatérés a normál farmra. A tárhely teljes mentési exportja a próbák előtt és után azonos; JavaScript-kivétel nem jelentkezett. Cypress nem állt rendelkezésre, a böngészőpróba CDP-n futott.

### Képek a tényleges játékból

- [Nappali látvány](concepts/art-study-woodland-day.png)
- [Esti látvány](concepts/art-study-woodland-evening.png)
- [Eredeti rajzolás összehasonlításhoz](concepts/art-study-original-comparison.png)
- [Mobilos nézet](concepts/art-study-woodland-mobile.png)
- [Eszközpanel](concepts/art-study-tools.png)
