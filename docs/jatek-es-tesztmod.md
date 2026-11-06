# Mi működik a rendes játékban, és mi maradt teszt?

Aktuális állapot: 2026-11-06. Játékverzió: 0.2.0; a legutóbbi javítások nem jártak verzióemeléssel.

## A rendes játék része

- A teljes Noah-fejezet és a térkép (M), az erdőbe visszatérve újra megjelenő ellenfelek.
- A boltok nem nyitják meg automatikusan a vásárlást. A pult elől E-vel vagy kattintással indul beszélgetés, a vásárlás külön választható.
- A konkrét üvegedényes/lenszövetes témák, és az alsó Vissza–Vásárlás gombsor.
- A négy géprész vizsgálati célja 1 / 4–4 / 4 haladással, a Célok fülön a felfedezés és javítás között.
- Csak a negyedik rész után elérhető javítási cél, anyaglista, alkatrészes témák és Sam egyszeri gondolata.
- Annie és Leo eredeti átadási mondata; az ablak bezárása után a tárgyátadó animáció.
- Az egyszeri erdei életerő-segítség, öt animált szívvel és az evést szemléltető almával. Régi farmokon is egyszer megjelenik, ha még nem látták.
- Az Öntözőrendszer hatókörének leírása és Simon túrabotos kivételt jelző bolti szövege.
- Az éles, natív gondolat-, jelzés-, tábla-, Zzzz- és életerő-feliratok.

Ezek a közös játékútvonalakon működnek; egyik sem kizárólag a fejlesztői indítógombokhoz kötött.

## Csak tesztmód

- Az **Élő ágyás kertészeti próba**: vegyes ágyás, nedvesség, mulcs, szedés/virágoztatás és kézzel léptethető napok. Nem váltja le a normál kertészkedést. [Kipróbálás és hatókör](elo-agyas-teszt.md).
- A Kidolgozott farm alternatív grafikája, új növényzettel és részletesebb formákkal.
- Sam átdolgozott külseje, copfja, ruhája, arányai és könnyedebb járása.

Ezek normál játékba emelésére még nincs jóváhagyás. A látványtesztben az eredetivel való összehasonlítás a tesztpanelen érhető el.

## Mit csinálnak a fejlesztői tesztindítók?

Az alkatrészes, mikroszkópos és Noah-kezdőpontok előkészített, memóriabeli másolatot indítanak a rendes játék mechanikáinak gyors kipróbálásához. Az életerő-előnézet csak megnyitja a közös segítséget. A normál farm és biztonsági másolata a teszt műveleteitől nem változik; kilépéskor a normál farm töltődik vissza.
