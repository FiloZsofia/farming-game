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
- A pusztán ablakot bezáró, játékba visszalépő gomb neve Vissza vagy Vissza a játékba legyen, soha ne Folytatás. A Folytatás név csak tényleges folytatást jelentsen, például mentett farm megnyitását. Vásárlásnál/rendelésnél a végrehajtó és a kilépő gomb egyértelműen különüljön el.

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
- A térkép egyelőre kizárólag memóriabeli tesztmódban érhető el M-mel (nyitás/zárás), és csak ilyenkor szerepeljen az Irányításban. Jóváhagyott területnevek: Öregfák ligete, Déli erdő, Mocsár. A térképi neveket külön jóváhagyás nélkül ne cseréld fantázianevekre.
