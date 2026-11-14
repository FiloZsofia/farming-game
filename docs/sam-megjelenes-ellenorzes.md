# Sam és eszközök ellenőrzése

A kiválasztott arc és haj, a törtfehér blúz, magas derekú farmer és bokacsizma a rendes játék főhősén és alvó változatán is megjelenik. A régi rajz nem kerül vissza helyszínváltáskor. A többi szereplő külseje megmarad.

- Elkülönített böngésző, `SaveStore.beginTest()` védelemmel: valódi gazgyűjtéskor 0 → 1 gaz, a gaz eltávolítása mentve, az indított munkamozdulat `harvest` (kosár).
- A tenyérhez kötött fogási pontot mind a hat eszköznél, több méret/nyújtás/elfordítás mellett automatikus teszt ellenőrzi.
- A kanna kiöntőjének célirányát és fogási pontját négy fő- és átlós irányban, eltérő kartartás mellett teszt ellenőrzi.
- A nehéz és finom munkamozdulatok célirányát és visszatérését, a tükrözést, az egyszeri munkavégzési pontot és a haj járás közbeni rögzítését automatikus tesztek fedik.

Kiválasztott és ellenőrzött képek:
- [Jóváhagyott Sam](concepts/sam-ivory-selected-peach-hair-close.png)
- [Játékbeli méret](concepts/sam-ivory-selected-peach-hair-game.png)
- [Kosaras gazgyűjtés](concepts/production-sam-weed-basket.png)
- [Arányos eszközök és kosár](concepts/sam-palm-fit-five-tools.png)

Végső ellenőrzés: `npm test -- --maxWorkers=2` – 85 tesztfájl, 569 sikeres teszt; `npm run build` – sikeres. A felső méretét és a végleges eszközöket elkülönített, mentésvédett böngészőben ellenőriztük. A kanna végső füle a tartályhoz két ponton csatlakozó D alakú ív, a tenyér ennek hátsó szakaszát fogja. A [használat közbeni kép](concepts/sam-palm-fit-tools-working.png) ezt a javított változatot mutatja.
