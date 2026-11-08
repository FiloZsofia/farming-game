# Fejlesztési szabályok

- A közös döntések forrása a `docs/jatekterv.md`; a nyitott ötleteket ne kezeld elfogadott követelményként.
- TypeScript és Phaser az alap. Új függőséget csak konkrét igényhez adj.
- A farm biztonságos, a tempó nyugodt. Játékmeneti számokat a felhasználóval egyeztess.
- Ne hivatkozz végleges grafikaként a helykitöltőkre. Külső assetekhez ellenőrizd és dokumentáld a licencet.
- Kötelező ellenőrzés: `npm test` és `npm run build`. Böngészős teszthez Cypress használatos, nem Playwright.
- A mentést érintő módosításoknál adatvesztés és verzióváltás ellen is ellenőrizz.
- Vizuális változásról készíts ellenőrizhető képet. A felhasználónak a GitHubon tárolt képek működtek.

- A Készlet tárgykártyáin csak a tárgy vagy növény neve jelenjen meg. Ne adj hozzá árat, leírást, „Eszköz”, „Küldetéstárgy” vagy „1 db” toldalékot. A szükséges mennyiséget külön számozott jelvény jelezheti; a receptek a Tervrajzok fülre tartoznak.

- A történeti célok és Sam gondolatai ne árulják el a megoldás helyét vagy lépéseit. Ne adj hozzá „menj ide”, „beszélj vele”, „itt keresd” útmutatást vagy korábbi felfedezésre alapozott célzott tippet külön felhasználói kérés nélkül. A már elfogadott cél- és gondolatszövegeket őrizd meg; az új mechanikai feltétel nem engedély ezek átírására.

- Az összekapcsolódó ösvények egyetlen hálózatként készüljenek: előbb az összes külső szegély, utána az összes belső réteg. Tilos külön, teljesen körvonalazott útdarabokat egymásra rajzolni, mert az elágazásban belső ív vagy varrat marad. Az új és módosított csomópontokat közeli böngészős képen ellenőrizd, a farmkapunál és az erdei elágazásnál is.
- Az irányjelző deszkája és felirata együtt kövesse a ténylegesen továbbvezető ösvény irányát; a tartóoszlop függőleges maradjon. Ne tekints elegendőnek egy minimális forgatást, ha a felirat és a nyíl továbbra is természetellenesen áll.
- A felhasználó 2026-11-08-i döntése szerint az ablakot lezáró és a bolti továbblépő gomb alapneve Tovább. A Vissza név jóváhagyott kivételei: Beállításokból az előző menübe, a mentett farmok listájából a főmenübe, a Magkatalógusból rendelés előtt visszalépés, valamint a társítás összeállításából a társításválasztó listára visszalépés. Sikeres magrendelés után a kilépőgomb Tovább. A konkrét célra mutató navigáció gombja viselheti a cél nevét, például Főmenü vagy Hirdetmények. A Folytatás név csak tényleges folytatást jelentsen, például mentett farm megnyitását. Vásárlásnál/rendelésnél a végrehajtó és a kilépő gomb egyértelműen különüljön el.

- Minden játékbeli szövegnél kerüld a szájbarágást és túlmagyarázást. Ne ismételd szöveggel azt, amit a felület, ikonok, számok vagy gombállapot már egyértelművé tesznek. A recepteknél elég a birtokolt/szükséges mennyiség és az inaktív elkészítőgomb; ne írj külön hiány- vagy készültségi mondatot.

- Minden lehelyezett, mozgatható tárgyat (a jövőben készülőket is) Bontóvassal veszünk vissza a Készletbe, majd onnan helyezünk le újra. Használd a `placed-items.ts` közös felvételi útvonalát; ne adj külön Felveszem/Üres láda felvétele gombot. A teli tárolók, dolgozó gépek és át nem vett termékek védelmét őrizd meg.

- Minden jelenlegi és új ablak/gomb kövesse a [közös arculati szabályzatot](docs/ablakok-es-gombok.md). A közös alapstílus forrása `src/dialogue-theme.css`; ne kizárólag kézzel felsorolt ablakcímekhez kösd az egységesítést. Vizuális módosításnál ellenőrizd a szabályzat teljes ablaklistáját, beleértve a beszélgetések és a boltok Vissza gombjait, illetve a névtelen figyelmeztetés gombjait is.

- Játékkiadásokhoz kövesd a [verziózási szabályzatot](docs/verziozas.md): egyetlen verzióforrás a `package.json`, látható szám a `src/version.ts`-ből, változáslista a `CHANGELOG.md`-ben, kiadási Git-címke. Verziószámot csak előzetes kérdés és kifejezett felhasználói jóváhagyás után emelhetsz; jóváhagyásig a módosításokat változatlan verziószámmal töltsd fel. Nem minden commit vagy deploy új kiadás. A mentésformátum verzióját ettől külön kezeld.

- A fejlesztői teszthelyzetek csak külön, memóriában tartott farmmásolatot módosíthatnak. A `SaveStore.beginTest()` mentési védelmét minden új teszteszköznél őrizd meg; a rendes farmot vagy biztonsági másolatát teszt közben tilos felülírni. Teszteszközt ne köss farmnévhez.

- Minden megtermelt zöldség és gyümölcs egy darab elfogyasztásával 1 szívet tölt vissza. Ez a játék kezdetétől, szint- és küldetésfeltétel nélkül működik; a későbbi terményekre is automatikusan érvényes. A közös növény- és gyümölcsfa-nyilvántartás alapján kezeld az ehetőséget (`food.ts`), ne külön felsorolt kivételekkel. Hullott/túlérett gyümölcs nem ehető; teljes életerőnél az Eszem gomb nem jelenik meg.
- Minden átvehető postai levél vagy csomag érkezését a postaláda meglévő sárga zászlója jelzi. Ne készíts külön új jelzést egy új levéltípushoz. Átvétel után a jelzés csak akkor tűnjön el, ha sem levél, sem csomag nem vár átvételre.
- A történetarchívum csak átélt eseményt mutathat. Új mentésekben őrizd meg a felfedezések tényleges sorrendjét; régi mentések hiányzó időpontját ne találd ki. A normál játékba kerülő Noah-fejezetnél is őrizd meg ezt és a kezdettől működő ehetőséget.
- A vörösfenyőgyantát külön, Noah mellékelt előkészítő anyagával kell hordozóvá készíteni; nyers gyanta nem kerülhet közvetlenül a vizes főzetbe. A koncentrátumot csak a lehűlt keverékhez adjuk. Ezek a játékbeli kísérlet lépései, nem valós recept vagy természetben alkalmazható kezelés.

- A kivonatkészítés az eredeti Műhely valódi játékterében működjön, ugyanazzal a szobával és főhőssel; ne válts külön, újrarajzolt minijátékszobára. A felhasználó kérésére itt feltűnő animált célpont és rövid aktuális műveleti útmutató segíthet; ez nem engedély a történeti célok túlmagyarázására.
- A térkép a normál játékban is elérhető M-mel (nyitás/zárás), és szerepeljen az Irányításban. Jóváhagyott területnevek: Öregfák ligete, Déli erdő, Mocsár. A térképi neveket külön jóváhagyás nélkül ne cseréld fantázianevekre.

- A játékvilágban látható szövegek (kérdőjel, három pont, gondolat, táblafelirat, Zzzz, életerő-felirat) a közös `worldText()` útvonalon készüljenek (`src/world-text.ts`): natív HTML-betűk, a Phaser-pozíció, kameranagyítás és interakció megtartásával. Ne rajzold vissza őket a pixeles vászonba. A Phaser-mérési tartalék legalább négyszeres felbontású maradjon; a képernyőhöz rögzített címkék szintén valódi HTML/szöveget használjanak. Talajátmenettel ne takard ki a korábban rajzolt lombkoronát; a talaj és a fák külön gyorsítótárazott rétegek legyenek.
- Dekoráció elhelyezésekor a füves, festett ösvény nélküli átjárókat is hagyd szabadon, különösen az erdei pihenőpadtól a patakhídhoz vezető sávot. Ne csak a kirajzolt úthálózat alapján ellenőrizd a helyet.

- Minden jelenlegi és új bolt a közös `shop-conversation.ts` beszélgetési menüt használja: belépéskor nincs automatikus vásárlóablak, a pult elől E/kattintás indít beszélgetést. A történeti témák külön, feltételes gombok, a Vásárlás külön művelet; a napi mondatok megmaradnak. Az új boltos nevét, találkozási jelzőjét és esetleges alkatrész-szerepét a közös nyilvántartásban add meg; ne kapja meg véletlenül más szereplő témáját.

- Az új kertészkedés normál játékba emelésekor a meglévő `#gardening-skill` jártasságjelző arculatát és animációját őrizd meg (függőleges feltöltődés, számkiemelés, +pont-jelzés, mozdulatok és időzítés); a jobb oldalról balra kerül. A kertészeti teszt egyszerűbb külön jelzője csak ideiglenes próba, nem az éles megjelenés mintája.

- Minden szereplőtől történő tárgyátvétel kapjon átadási animációt a közös `showItemGift()` útvonalon (`material-gift.ts`). Sorrend: sikeres mentés, az átadást kísérő mondat, majd a játékos általi ablakbezárás után az animáció. Ne nyíljon vissza automatikusan a szereplő alapmondata/bolti menüje. Ez a műhelykulcsra és a jövőbeli ajándékokra is vonatkozik; más ablakra váltás törölje az elhalasztott átadást.

- Szedhető bokor teljes látható lombja maradjon minden ösvény és út festett felületén kívül, legalább kis füves hézaggal. Nem elég a középpontot ellenőrizni. Nem kerülhet fa, épület, tábla vagy más tárgy takarásába, és legalább egy oldalról gyalog megközelíthető legyen. Az összes szedhető bokrot együtt ellenőrizd út- vagy növényzetváltozáskor, ne csak az utoljára mozgatottat. Használd a `forageBushBounds()` / `forageBushOffPaths()` ellenőrzést, a fák teljes sziluettje pedig kerülje a bokrok fenntartott helyét. Áthelyezéskor a gyűjtési azonosító és a szedési előzmény megmaradjon. Közeli böngészős képen ellenőrizd az eredményt.

- Az első ágyás kijelölésére vezető + gombot Leo bemutatkozásának bezárása után, az aktív „Alakíts ki egy ágyást” cél alatt Naplóéhoz hasonló, meleg arany pulzáló kör jelezze. Ne világítson már teljesített cél mellett vagy a nyitott ablak alatt; kijelölés közben tűnjön el, csökkentett mozgásnál maradjon statikus.
- Az Esti napló minden bejegyzése egységes: `<strong>` fejléc, sortörés, normál szövegtörzs. A fejléc fogja össze a bejegyzés típusát, dátumát és tárgyát; új bejegyzés is ugyanazt a közös hozzáadó útvonalat használja.
- Mara új autóútja balról jobbra vezet a teljes látható pályán át. Az átadónál a füves rakodóhelyre húzódik le, majd visszasorol, nem fordul meg és nincs fordulóöböl. Sam előtt lelassít és megáll, a játékos felszabaduló útján folytatja. A jármű talajon elfoglalt és mozgás közben végigsöpört területét közösen ellenőrizd a próbában és a rendes játékban is. Az útba eső meglévő fákat fajta és méret megtartásával közeli helyre helyezd át.
- A közös tárgyátadási animáció rövid, finom csilingelést indítson. Kövesse a Menühangok beállítást, háttérben maradjon néma, hanghiba nem akadályozhatja a mentett tárgyat vagy az animációt.
