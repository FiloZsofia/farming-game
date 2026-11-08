# Ablakok és gombok közös arculata

Ez az összes jelenlegi és jövőbeli játékablak alapja. Ne ablakonként másold a stílust: a közös értékeket a `src/dialogue-theme.css` adja, a menük elrendezését a `src/menu.css` kezeli.

- Felület: sötétzöld átmenet (`#2b4332f7` → `#172e23fc`), 1 px meleg aranyszegély (`#bda46a`), 5 px sarok, puha sötét árnyék. Háttérként az elsötétített, megállított játék látszik; a Főmenü és annak alnézetei teljes képernyősek. Az irányítható kivonatkészítés az eredeti Műhely teljes játékterében, külön ablak nélkül zajlik.
- Hosszabb, olvasásra szánt szöveg: `system-ui, sans-serif`. Ablakcímek, menüpontok és gombok: `Trebuchet MS, Segoe UI, sans-serif`. A Silent Pollen képi logó külön marad.
- Gomb: sötétzöld átmenet, aranyszegély, finom belső keret, világos krémszínű felirat. Rámutatás világosít, billentyűzetes fókusz jól látható. A meglévő elrendezést és méretet ne írd felül általános gombszabállyal.
- Inaktív gomb: látványosan szürkített, tényleges `disabled` állapot. Aktív fülek és tárgykártyák saját állapotjelzése megmarad. Törlés megerősítése megtarthatja a figyelmeztető vöröses színt.
- Ablakzárás és bolti továbblépés neve Tovább. Vissza a Beállításokból az előző menübe, a mentett farmok listájából a főmenübe, a Magkatalógusból rendelés előtt, illetve a társítás összeállításából a társításválasztó listára vezető gombon szerepel. Sikeres magrendelés után Tovább. Konkrét navigációhoz célnevet használunk (Főmenü, Hirdetmények, Mikroszkóp); a Folytatás csak tényleges folytatáshoz használható. Ablakcím és felső címke ne ismételje ugyanazt.
- Tartalmi kivételek: a névtelen figyelmeztetés fehér lapja és ceruzabetűi, a szereplők beszédbuborékai/portréi, a mikroszkóp vizsgálati képe, az ünneplések és szirmok megmaradnak. A körülöttük lévő ablakkeret és a műveleti/Tovább gombok azonban közösek.
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

- A teszttérkép maga tölti ki a megnyíló ablakot, külön fejléc/párnázott keret nélkül. A Tovább gomb a térképre kerül; külön Sam-helye jelmagyarázat nincs.
- A világban megjelenő Phaser-szövegek legalább 4-es felbontással készülnek, beleértve az interakciós kérdőjelet/három pontot, Sam gondolatait és a táblákat.

- Annie első érkezése is a közös portrés beszédablakot használja. Az érkezési felső felirat és a szereplő neve látszik, ismétlődő külön cím nélkül; a szereplő szavai a beszédbuborékba, a készletbe kerülésről és kezelésről szóló kezdő segítség külön, a buborék alá kerül. Más ablak nyitása törli ezt a kiegészítő megjegyzést.


### Fejlesztői eszközök

Minden teszt és előnézet azonos `.developer-tool-section` szakaszt használ: cím, szükség esetén leírás és kezdőpontválasztó, majd az indítógomb. A szakaszok között egyetlen közös elválasztóvonal és azonos térköz van. A látványteszt is ezt követi. A teszt neve a címben, a művelet a gombon szerepel („Teszt indítása” / „Előnézet”).


- A bolti beszélgetésmenü gombjai balra igazított, szövegszélességű gombok, egységes 10 px térközzel. Hosszú témák mobilon tördelhetők; ne nyújtsd minden gombot a teljes ablak szélességére.


### Bolti választóablak és éles világfeliratok — 2026-11-06

A beszélgetési témák a buborék alatt, külön sorokban szerepelnek. Az alsó, jobbra igazított gombsorban egymás mellett áll a Tovább és a Vásárlás, egyforma minimális szélességgel. Mobilon szükség esetén tördelhető. Ez váltja a korábbi, függőlegesen sorolt kicsi gombokat.

A világfeliratok natív HTML-réteget használnak (`world-text.ts`). A réteg követi a kamerát, nagyítást, forgatást, szülőkonténert, láthatóságot és áttűnést, az interakciót a Phaser-tárgy őrzi. A pixeles táj renderelése változatlan. A gondolat saját krémszínű háttere a hárompontos jelzés fölött marad.

Üvegedény vagy lenszövet átadásakor először a boltos eredeti mondata látható a portrés ablakban. A Tovább vagy Esc bezárása indítja a tárgyátadó animációt. Az alkatrész mentése megelőzi az átadási ablakot; hiba esetén nincs átadási mondat vagy animáció. Más ablakra váltás törli az elhalasztott animációt.

### Élő ágyás gondozópanelje — csak teszt

A panel közeli E/kattintásra jelenik meg. Tovább, Esc, eltávolodás és az ágyáson kívüli talajra kattintás zárja. A célkövetőt csak a nyitott panel idejére rejti el. Mobilon a nyitás fenntartott kameraterületet ad, bezáráskor visszatér a teljes nézet. A helyválasztási előnézethez külön, kis megerősítőgomb tartozik; ez nem a gondozóablak és nem takarhatja a célkövetőt vagy a mozgásgombokat.


A kertészeti próba kizárólag az ágyás gondozását kezeli jobb oldali panelben; a Készlet eredeti lapjai, Magkatalógus, posta, Tervrajzok és megfigyelési napló a közös normál ablakban jelennek meg. Az eredeti öt eszközt csak gondozáskor egészíti ki a társítás magválasztója. Új ágyás külön bal oldali + gombbal indul. A panel alja a tényleges eszközsáv-magasságot követi; teteje a Menü alá kerül. Mobilon a mozgásgombok és a kamera a fenntartott játéktérben maradnak. Beviteli mezőben a nyilak mennyiséget módosítanak, nem Samet mozgatják. A napló saját SVG-vázlatokat és natív betűket használ. A feloldás a meglévő ünneplős ablakban jelenik meg, teljes ablakon hulló szirmokkal, a kilépés Tovább. Minden társításarány ajánlottként, a kilenc hely szabad felosztásának jelzésével jelenjen meg.


### Segítség és önálló ösvényépítés — 2026-11-08, csak kertészeti próba

Az ágyáskezelő saját ÁGYÁSKEZELŐ feliratot kap. A benne lévő Segítség világos, külön címezett jegyzet, kérdőjeles nyitó/záró gombbal, témaválasztóval és Értem gombbal. Nem veszi át a küldetéskövető tartalmát vagy cél-/teljesítésjelölését. Alapból mindig csukva van; csak a ? gomb nyitja. Másik helyzetre váltás vagy az ágyáskezelő bezárása összecsukja. A rendes követő történeti tartalma megmarad, gondozáskor átmenetileg rejtve.

Az ösvény a Tervrajzokban egyetlen kártya, Burkolat választóval. A rajzoló kis megerősítőpanelje önálló építési felület, nem ágyáskezelés vagy küldetés. Előre mutatja a teljes költséget; külön megerősítés, utolsóelem-visszavonás, rajztörlés és Befejezem gomb tartozik hozzá. Mobilon sem fedheti a Menüt vagy az eszközsávot.


A társítás összeállításának Vissza gombja a gondozópanel láblécében balra, a Tovább gombbal egy sorban áll. A vetőmagválasztó ugyanakkora eszközhelyet foglal, mint az öt alapeszköz, teljes nevű natív választóval. A teszt postaládája a rendes postaláda ikonozott `.mail-seed-card` sorait és ablakát használja; minden új növény saját rajzot kap. Az Ösvény kártya ikonja a kiválasztott burkolatot ábrázolja, a gomb neve Ösvény kialakítása.


### Frissítésismertető és Mara tesztablakai

A kertészeti próba frissítésismertetője a közös beszélgetésablakban jelenik meg: cím, négy rövid szakasz, segítségsor, külön előnézeti lábléc és közös Tovább gomb. Mobilon a teljes tartalom görgethető. A Terményátadó feltöltőablaka és Készlete a natív inventory keretet használja; Mara a közös portrés beszélgetéselrendezést. A bal oldali rövid kertészkedési haladásjelzés nem foglalja el a jobb oldali ágyáskezelőt.

### Átvételi animáció — minden szereplőtől kapott tárgyhoz

Az üvegedény, lenszövet és műhelykulcs mellett a későbbi tárgyak is a közös `showItemGift(scene, actor, icon, name, count)` átadást használják. A hat vadvirágmag és a madárodú átvételekor is ez jelenik meg. Csak sikeres mentés után látható az átadó mondat; annak Tovább/Esc bezárása indítja a tárgy animációját. Átvétel után ne térjen vissza automatikusan a szereplő alapmondata vagy a vásárlóablak. Más ablakra váltás és jelenetlezárás ne hagyjon később előugró animációt.
