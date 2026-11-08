# Mi működik a rendes játékban, és mi maradt teszt?

Aktuális állapot: 2026-11-08. Játékverzió: 0.2.0; a legutóbbi javítások nem jártak verzióemeléssel.

## Legújabb tesztek

- **Terményátadó · Mara fuvarja:** külön teszt, kilenc láda, többféle készlet, kézi fuvar és napléptetés, megszólítható Mara és próbabeli Ismerősök-bejegyzés. A rendes eladóláda nem változott. [Útmutató](termenyatado-teszt.md).
- **Kertészeti próba:** 50/100 pont alapú szintek, teljes betakarítási feltétel nélkül; mulcs és tárgyjelzések, javított növények, táblák, öntözés és úthelyfoglalás. [Útmutató](elo-agyas-teszt.md).
- **Frissítésismertető:** csak az új kertészkedés jövőbeli kiadási üzenetének előnézete. Aktív kertészeti teszt újratöltésekor friss próba és ismertető indul; a rendes készletkompenzáció még nincs végrehajtva. [Szöveg](kert-frissites-ismerteto.md).

## A rendes játék része

- A gyümölcsfák 15 nap után évszakkorlát nélkül kezdhetik a meglévő terméskötődési ciklusokat a csak Tavaszt tartalmazó változatban; látványosabb csemete–termő fa fejlődéssel. A tervezett nyári/őszi évszakok dokumentációja megmarad.
- Kacsalábak és rövid, megállásokkal kísért tóparti séták; a tojás és beköltözés szabályai változatlanok.
- A Magkatalógus kilépőgombja rendelés előtt Vissza, sikeres rendelés után Tovább.
- A „Mit ültessünk legközelebb?” ablak új címe: Magkatalógus.

- A teljes Noah-fejezet és a térkép (M), az erdőbe visszatérve újra megjelenő ellenfelek.
- A boltok nem nyitják meg automatikusan a vásárlást. A pult elől E-vel vagy kattintással indul beszélgetés, a vásárlás külön választható.
- A konkrét üvegedényes/lenszövetes témák, és az alsó Tovább–Vásárlás gombsor.
- A négy géprész vizsgálati célja 1 / 4–4 / 4 haladással, a Célok fülön a felfedezés és javítás között.
- Csak a negyedik rész után elérhető javítási cél, anyaglista, alkatrészes témák és Sam egyszeri gondolata.
- Annie és Leo eredeti átadási mondata; az ablak bezárása után a tárgyátadó animáció.
- Az egyszeri erdei életerő-segítség, öt animált szívvel és az evést szemléltető almával. Régi farmokon is egyszer megjelenik, ha még nem látták.
- Az Öntözőrendszer hatókörének leírása és Simon túrabotos kivételt jelző bolti szövege.
- Az éles, natív gondolat-, jelzés-, tábla-, Zzzz- és életerő-feliratok.

Ezek a közös játékútvonalakon működnek; egyik sem kizárólag a fejlesztői indítógombokhoz kötött.

- Az ablakzáró gombok neve Tovább; a Beállítások és mentett farmok valódi visszalépő gombja Vissza marad. A konkrét célra visszavezető gombok célnevet használnak (Főmenü, Hirdetmények, Mikroszkóp).

## Csak tesztmód

- Az **Élő ágyás kertészeti próba** teljes bővítése: több szabad ágyás; közvetlen eszközsávos műveletek; öt elfogadott társítás; csoportos Magkatalógus, posta és tényleges átvétel; komposztálós mulcs; 20/40 pontos feloldás ünnepléssel; megfigyelési napló egyszeri pontokkal; fajonkénti maggyűjtés; automatikusan kézbe kerülő, mozgatható kézírásos jelölők; egy ágyásos öntöző; 160 goldos ládatervrajz a próba Simon-vásárlásában. Ez nem váltja le a normál kertészkedést és nem törli a régi növényeket. [Kipróbálás és hatókör](elo-agyas-teszt.md).
- A kertészeti tesztben szabad, kilenc helyes összeállítás és ajánlott arányok; a megszokott Készlet/Magkatalógus eredeti ablaka; öt alapeszköz, csak gondozáskor látható vetőmagválasztó, külön bal oldali +. Külön, alapból csukott Segítség ? gombos megnyitással; a küldetéskövető a történeti céloké marad. Önálló ösvényépítés a Tervrajzok egyetlen Ösvény kártyájáról, három választható burkolattal és visszafelé javítható rajzzal.
- A Kidolgozott farm alternatív grafikája, új növényzettel és részletesebb formákkal.
- Sam átdolgozott külseje, copfja, ruhája, arányai és könnyedebb járása.

Ezek normál játékba emelésére még nincs jóváhagyás. A látványtesztben az eredetivel való összehasonlítás a tesztpanelen érhető el.

## Mit csinálnak a fejlesztői tesztindítók?

Az alkatrészes, mikroszkópos és Noah-kezdőpontok előkészített, memóriabeli másolatot indítanak a rendes játék mechanikáinak gyors kipróbálásához. Az életerő-előnézet csak megnyitja a közös segítséget. A normál farm és biztonsági másolata a teszt műveleteitől nem változik; kilépéskor a normál farm töltődik vissza.


A kertészeti teszt jártasságjelzője ideiglenes. Amikor az új kertészkedés bekerül a normál játékba, az eredeti jelző arculata és animációja megmarad, bal oldali elhelyezéssel. A teszt Jártasságok füle külön választja a három alaptársítást és az elért szintek jutalmait.


Mara legújabb arc-/fonat-/üvegezésjavítása és az átadó balra helyezése továbbra is tesztmód. Éles áruszállításkor a fonott kosár/Nádkosár, ikraadagok és kacsatojás eladását is be kell kötni a teljes meglévő eladási nyilvántartás alapján. A felhasználó kérésére ezek még nem kerülnek a teszt készletébe.


A pickup kidolgozott fülkebelseje és hippis apró részletei, a mindig csukott társításlistával megnyíló Magkatalógus, valamint a világosabb jelölőfelirat továbbra is a megfelelő tesztmódok részei. Mara későbbi bolti kínálata még nyitott ötlet; új vásárlási funkció nem került be.
