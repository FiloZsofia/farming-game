# Farmjáték – közös játékterv

Ez a dokumentum a tervezés során elfogadott döntéseket rögzíti. A nyitott kérdések és későbbi ötletek nem végleges követelmények. A játék címe még nincs kiválasztva.

Az „Erdőszéli birtok” csak munkacím. Felmerült címjavaslatok: Új gyökerek, Vadvirág, Lombok alatt; még egyik sem elfogadott.

## Alapélmény és platform

- Nyugodt kertészkedés és egy barátságosan elhanyagolt birtok fokozatos újjáélesztése.
- Böngészőben futó játék, GitHub Pagesen megnyitható változattal.
- Később telefonon, érintéssel is kényelmesen használható legyen.
- Irányítható karakter, aki odasétál a tevékenység helyéhez.
- Az első prototípus karakterének méretét és mozgási sebességét a felhasználó megfelelőnek találta.
- A karakter a játék kezdetén a háza ajtajából indul.
- A karakter ugrani is tud; mozgás közben az ugrás kis sebességlöketet ad. A prototípusban Space vagy külön Ugrás gomb indítja; futás Shift lenyomásával.
- Tartós mentés szükséges. Bezáráskor megáll a játékidő; nincs távolléti növekedés.
- Az idő, növekedés, árak és egyéb egyensúlyi értékek menet közben, közös egyeztetéssel alakulnak ki.

## Vizuális irány

- Kevés állandó képernyőgomb: a korábbi Napló, Eladóláda, Bevétel és jobb alsó Művelet/Ugrás/Futás gombok megszűnnek. A házhoz teleportáló próbagombot is eltávolítjuk.
- A tárgyakat közelről E-vel vagy kattintással/koppintással használjuk. Egyetlen Menü mögött van a történet, irányítás és készlet.
- Készletnyitás és -zárás Tab-bal, bezárás Escape-pel is; külön termény- és ültetőanyag-mennyiségek. Betakarítás után a termény itt azonnal látható.
- A gyakran nézett napszak- és goldfelirat nagyobb, hangsúlyos szöveg legyen, mobilon is.

- A játék töltse ki a böngészőablakot, külön szöveges oldalsáv nélkül. A háttértörténet és egyéb szövegek a játéktér fölötti párbeszédablakokban jelenjenek meg. Párbeszéd alatt a karakter nem mozog.

- Részletes 2D pixelgrafika, háromnegyedes felülnézettel: látható épületoldalak és tetők.
- A Chef RPG vizuális referencia, saját megjelenítéssel és világgal.
- Természetesebb karakter- és tárgyarányok; kerülendők a nagy fejű karakterek és túlzottan rajzfilmes formák.
- Gazdag, akár élénk színek a természetesség határain belül.
- Otthonos, meleg fények, kopott fa, változatos növényzet, vidéki anyagfelületek.
- A játék legyen egyszerűbb és áttekinthetőbb a hangulattervnél: ritkább díszítés, felismerhető növekedési állapotok, elkülönülő járható és használható területek.

Elfogadott hangulati referencia: [tavaszi farm-látványterv](concepts/farm-spring-concept.png). Ez generált koncepciókép, nem kész, elemekre bontott játékasset vagy végleges pályaterv. A felhasználható assetcsomagokat és licenceket még ki kell választani, illetve ellenőrizni. A fejlesztés során képi mintákat és képernyőképeket is mutatunk; a GitHubra feltöltött koncepciókép a felhasználónál megnyitható volt, a chaten belüli képmegjelenítés nem működött.

Verandával kiegészített változat: [tavaszi farm verandával és naplóasztallal](concepts/farm-spring-veranda-concept.png). Az eredeti képet összehasonlításhoz megőrizzük.

## Alap főhős megjelenése

- Aktuális felhasználói döntés: az első barna hajú főhős külsejének visszaállítása (`8d40544`), a későbbi arc- és testarány-változtatások nélkül. Az eredeti barna haj, magas lófarok, arc, öltözék és testforma tér vissza; a mostani mozgás és eszközhasználat megmarad. A B tervből készült játékbeli változat elutasítva.

- Felnőtt nő, vékony, természetes testalkattal és barátságos arccal.
- Világos bőr, de nem túl sápadt tónussal.
- Barna haj, a fej tetején induló, magasra kötött lófarok.
- Egyszerű vidéki munkaruha: törtfehér ing, mohazöld nadrág és barna bakancs.
- Természetes arányú, a környezethez illő részletes 2D pixelgrafika.
- A farm koncepcióképein szereplő alak helykitöltő, nem a végleges karakterterv.
- Személyre szabható karakterválasztóról még nincs döntés.

## Helyszín és birtok

- Általános vidéki környezet, konkrét ország vagy régió nélkül.
- Erdőszéli birtok lankás, rétes vidéken, kis tóval.
- A farm biztonságos otthon marad.
- A ház, a tó és a történethez kötődő lezárt épület helye rögzített.
- A hangulatterven látható elrendezés elfogadott: ház bal felül, lezárt melléképület jobb felül, tó jobb alul. Az új veranda miatt ezeket nem helyezzük át.
- A ház bejáratánál kis veranda legyen, asztallal, székkel és az esti napló helyével.
- A többi terület szabadon berendezhető: termőföldek, ösvények, kerítések, dekorációk és későbbi gazdasági épületek.
- Elhelyezéshez háttérben működő négyzetrács, amely építéskor és földműveléskor látszik; a karakter szabadon mozog.
- A birtok nagy része kezdettől bejárható. Gaz, kövek és kidőlt ágak eltakarításával fokozatosan válik használhatóvá.
- A ház közelében kevés munkával kialakítható az első veteményes.

## Farmnév és kezdés

A nyitó történettel közös ablakban a játékos elnevezi a farmját (1–40 karakter). Ez kerül a felső cím helyére és mentődik. A régi mentéseknél is kérünk nevet, az összes korábbi állapot megőrzésével. A névadás közben az idő áll.

## Történet

A játékos már a kezdéskor megtudja, hogy a főhős kutatólaborban dolgozott, elfáradt, és vidéken szeretne új életet kezdeni. A birtok barátságosan elhanyagolt, a kezdésben nincs zombi- vagy horrorhangulat.

A lezárt épülethez odasétálva egyelőre csak kérdőjeles gondolatbuborék jelenik meg; belépni nem lehet. A feloldás időzítése és az épület tartalma még nyitott.

Nem elfogadott történeti tény a korábbi gazda személye vagy a birtok megszerzésének módja. A beszélgetésben felmerült ilyen részletek csak javaslatok.

## Idő és napi ritmus

- Nappal–éjszaka ciklus és évszakok a tervezett játék részei.
- A nappal első 3 percében Délelőtt, második 3 percében Délután felirat jelenik meg.
- Egy teljes ciklus legfeljebb 10 perc aktív játékidő: 6 perc nappal és legfeljebb 4 perc éjszaka.
- Az éjszaka kezdetétől számított 2. percben figyelmeztetés a pihenésre, a 3. percben újabb, határozottabb figyelmeztetés jelenik meg.
- Ha a játékos nem zárja le önként a napot, az éjszaka 3 perc 30 másodperce és 4 perce közötti véletlenszerű időpontban a főhős összeesik a fáradtságtól, majd másnap reggel otthon ébred.
- Az éjszakai összeesés nem jár gold- vagy tárgyvesztéssel. Nem indul automatikusan új reggel az összeesés vagy az önkéntes napzárás nélkül.
- Az éjszakai kialvatlanság külön rendszer a staminától: a nulla stamina önmagában nem okoz ájulást.
- Nem kell minden feladatot minden nap elvégezni.
- Menük és párbeszédek alatt megáll az idő.
- Fokozatos fényváltás jelzi az estét.
- A napot a verandán vezetett esti naplóval zárjuk, majd másnap reggel folytatjuk.
- Az esti naplóval korábban is önként lezárható a nap.
- Az automatikus mentés a nap lezárásától függetlenül is működjön.
- A verandán lévő napló a napzárás és az ahhoz kapcsolódó mentés helye; az automatikus mentéshez nem kell odasétálni.
- A napló pontos kezelése és bejegyzéseinek tartalma még tervezendő.

## Stamina

- A fizikai munka, például ásás, favágás és öntözés energiát fogyaszt.
- A séta és a rendezgetés nem fogyaszt energiát.
- Pihenéssel vagy étellel visszanyerhető a stamina.
- Nulla staminával a karakter tovább sétálhat és rendezgethet, de fizikai munkához előbb energiát kell visszanyernie.
- Nincs ájulás vagy pénzbüntetés a stamina elfogyása miatt.
- A fogyasztás, visszatöltés és pihenés pontos szabályai még nyitottak.

## Növények és kezdőcsomag

Tavaszi kezdés, összesen 12 elültethető növénnyel:

| Növény | Induló mennyiség | Tervezett szerep |
| --- | --- | --- |
| Retek | 4 mag | 3 megöntözött nap után betakarítható |
| Burgonya | 4 vetőgumó | 5 megöntözött nap után betakarítható |
| Borsó | 4 mag | Először 6, majd 3 megöntözött nap után szedhető |

- Földművelés, vetés, öntözés és betakarítás.
- Ha kimarad az öntözés, a növény aznap nem fejlődik, de nem pusztul el.
- Eső általi öntözés felmerült javaslatként; az időjárás szabályai még nincsenek véglegesítve.
- A 3 / 5 / 6 napos, borsónál 3 napos újratermési idő az elfogadott első próba. Hozamok és szezonhatárok később hangolandók; az elfogadott induló eladási árakat lent rögzítjük. A prototípus egy terményt ad betakarításonként; az érett növény nem rohad el.

## Beszerzés és eladás

### Magkatalógus

- A házban elérhető katalógusból rendelhetők magok.
- Fizetéskor levonjuk a goldot.
- A csomag másnap reggel érkezik a postaládába.
- Elfogadott induló darabárak: retekmag 5, burgonya-vetőgumó 10, borsómag 15 gold.
- A csomagot a kapu bal oldalán lévő postaládából kézzel vesszük át. Az át nem vett csomag megmarad; több rendelés összeadódhat.
- Kezdéskor nem szükséges külön bolt vagy falutérkép.

### Eladóláda

- A birtokon lévő eladóládába napközben bármikor betehető, amit el szeretnénk adni.
- A nap lezárásáig a tárgyak visszavehetők.
- Másnap reggel megérkezik a gold és egy rövid elszámolás.
- Elfogadott induló eladási árak: retek 15, burgonya 30, borsó 12 gold/darab. A borsó újravetés nélküli újratermése megmarad.
- A prototípus eladóládája a veranda bal oldalán áll. Közelről E vagy kattintás nyitja. Képes tárgyhelyeken jelennek meg a termények és a darabszámok; kattintás vagy húzás teljes kupacot, Shift+kattintás egy darabot tesz át. A ládából ugyanígy visszavehetők.
- A gold és a függőben lévő eladás mentődik; az önkéntes és kényszerű napváltás ugyanazt az egyszeri elszámolást használja.
- Nem tervezünk rendelőtáblát vagy kötelező terményrendeléseket az alapváltozatba.

## Eszközök, alapanyagok és tárolás

- Induló eszközök: kapa, öntözőkanna, fejsze és csákány.
- Az öntözőkanna a kis tónál újratölthető.
- A gaz kézzel kiszedhető; ágakhoz és fákhoz fejsze, kövekhez csákány kell.
- Fák és ágak fát, feltört kövek követ adnak.
- Ezek később kerítésekhez, ösvényekhez és építkezéshez használhatók.
- Külön tárolóláda az alapanyagoknak és magoknak, az eladóládától jól megkülönböztetve.
- Kezdetben korlátozott, később bővíthető tárolókapacitás.
- A férőhelyek száma, a halmozhatóság korlátai, a bővítési költségek és a hordozható készlet mérete még nyitott.

## Későbbi ötletek – nem az első változat követelményei

- Sok virág beporzókat vonz, amelyek növelik más növények hozamát.
- Madárodú vagy kis kerti tó madarakat vonz, amelyek csökkentik a kártevőket. A díszletként jelen lévő kezdő tó önmagában még nem jelent működő ökológiai rendszert.
- Lezárt épület kulcsának megszerzése, például az első évszak végén; időzítése nem eldöntött.
- Főzetkészítés üsttel és receptkönyvvel, vagy hibrid növények létrehozása egy géppel; egyik irány sincs kiválasztva.
- Ló vagy jármű használata.
- A laboros múlthoz kapcsolódó apokalipszis-történetszál csak lehetőség. A farm biztonságos marad; a harc szükségessége és helyszíne nyitott.

## Technikai irány és fejlesztési dokumentumok

- Javasolt, még nem telepített alap: TypeScript, Phaser és Vite; publikálás GitHub Pagesre.
- Böngészős folyamatok teszteléséhez Cypress a felhasználó választása, Playwright helyett.
- Játékszabályokhoz Vitest a javasolt egységtesztelő eszköz.
- Helyi mentés natív IndexedDB-vel és verziózott mentési formátummal működik; JSON-export elérhető, import még nincs. Részletek a mentési leírásban.
- Az eszközök közötti felhős szinkron nem része az eldöntött alapváltozatnak.
- Elkészítendő dokumentumok: AGENTS.md fejlesztési szabályokkal, vizuális útmutató, részletes játékszabályok és mentési szabályok.
- Fejlesztés közben folyamatos egyeztetés és kérdések szükségesek a még nyitott döntésekről.

## Az első játszható változat javasolt határa

Ez munkajavaslat, nem véglegesített megvalósítási ütemterv:

1. A farm bejárása és karaktermozgatás.
2. Területtisztítás és az alapanyagok gyűjtése.
3. Az induló három növény termesztése és stamina.
4. Eladóláda, gold, magkatalógus és másnapi kézbesítés.
5. Nap–éj ciklus, esti napló és helyi mentés/visszatöltés.
6. Korlátozott kapacitású tárolóláda.

Az évszakváltás, építkezés és tárolóbővítés pontos ütemezése külön döntést igényel. A kezdeti látványterv elfogadása nem jelenti az összes rajta látható tárgy és mechanika vállalását.

### Grafikai frissítés – 2026-10-21

- Egységesebb, részletesebb 2D-s próbagrafika természetes színekkel: textúrázott talaj és ösvény, cseréptető, vakolat, fa veranda és kerítés, rétegzett lomb, növények, víz és tópart. A köveket és ágakat határozott sziluett és árnyék különíti el.
- Az alsó eszközsávban saját rajzú ikon jelöli a kapát, öntözőkannát, terményeket és szedőkosarat. A fejsze, csákány és kéz ikonja a takarítás eszközeit jelöli.
- A grafika saját, programból rajzolt alkotás; nem külső assetcsomag. Még nem végleges látvány. A korábbi verzió külön Git-commitból visszaállítható.

### Napsütés, magtasakok és takarítás – 2026-10-21

- Élénkebb, természetes zöld fű és türkiz tó; nappal meleg fény, vetett árnyékok és vízcsillanások, éjszakára eltűnő napfény.
- Magok/vetőgumók külön tasakikont kapnak a növény képével, a készletben, eszközsávon, katalógusban és a postaládában. A termények eredeti ikonja megmarad.
- Kéz (7): gaz; Fejsze (8): lehullott ág; Csákány (9): kő. Közelről kattintás vagy F. A fák kivágása még későbbi feladat.
- Egy ág egy fát, egy kő egy követ ad a készlet Alapanyagok részébe; a gaz a Gaz alapanyag halomba kerül. Az erőforrások felhasználása még nincs bekötve.
- Elfogadott visszatérés: minden eltakarított gaz, ág és kő két nap után egy véletlenszerű, szabad helyen tér vissza. A régi mentésekben már meglévő föld is védett. Ha nincs alkalmas hely, későbbi reggeleken újra próbáljuk.
- Mobilon az eszközsáv vízszintesen görgethető; számbillentyűs választáskor a kiválasztott eszközhöz görget.

### Szomszéd, madárodú és élőbb farm – 2026-10-21

- Az első napon egy szomszéd sétál be a kapun, és a ház előtt madárodút ad. Ha a játékos távol van, megvárja, illetve E-vel/kattintással megszólítható. Régebbi farmon a következő nappali lehetőségnél pótolja a látogatást.
- Az ajándék egyetlen példányban kerül a készletbe. Tab → Alapanyagok → Madárodú → Elhelyezem; közeli, szabad helyre kattintva kerül ki. A növényeket és az épületeket nem lehet vele lefedni; a visszatérő gaz/ág/kő nem jelenik meg az odú alatt.
- A szomszéd tanácsa a madarak későbbi kártevővédő szerepét vezeti be; tényleges kártevőrendszert és hozammódosítást még nem adunk hozzá.
- A második reggelen egyszer jelenik meg a főhős kedves gondolatbuboréka; ha az odú még készletben van, elhelyezésre bátorít. A második naptól ritkán madarak repülnek át, nappal időnként színes pillangó is. Ezek nem gyűjthető, nem akadályozó hangulati elemek.
- Részletesebb, barátságos arcú női karakter, barna, magasra kötött lófarokkal, törtfehér ingben és mohazöld nadrágban. Külön mozgó lábak, karok és lófarok; futáskor gyorsabb léptek. Az éppen választott kertészkedő eszköz a kézben látszik, sikeres munka közben mozog, öntözéskor vízcseppekkel.
- A gaz külön alapanyag a készletben és a mentésben; felhasználása továbbra is nyitott.
- A tó szabálytalan, kisebb öblökkel tagolt partvonalat kap, a víz ütközési határa ugyanazt az alakot követi.

### Karakter, használati irány és készlet finomítása – 2026-10-21

- Kerekebb fej és test, barna magas lófarok, kedves, csukott szájú mosoly. A karakter mérete és mozgási sebessége nem változik.
- A munkamozdulat a tényleges célpont irányába fordul; a tükrözést és a kéz helyzetét figyelembe vesszük. Az utolsó mag elvetésekor a mozdulat még a magtasakot mutatja, utána a kapa válik aktívvá.
- Kisebb, rövidebb szövegű gondolatbuborék.
- A készlet csak pozitív mennyiségű tárgyakat mutat; az elhelyezett madárodú nem foglal benne kártyát. Az elfogyott mag eltűnik az alsó sávból; átvételkor újra megjelenik. A gyorsbillentyűk számai nem változnak.
- Az odú közelről fejszés kattintással vagy F-fel épségben visszavehető, majd a készletből újra elhelyezhető. A visszavétel előbb mentődik, és csak sikeres írás után tűnik el a világból.
- Éjszaka finoman pulzáló, fénylő szentjánosbogarak repülnek át. Nappal néha madár repül a kihelyezett odúhoz, megpihen a bejáratánál, majd rövid bebújás után ismét kirepül. Az odú eltávolítása vagy az éjszaka megszakítja ezt a hangulati jelenetet.

### Annie, kertészkedési jártasság és saját zene – 2026-10-21

- A főhős puhább, enyhén rajzfilmes testformákat kap. Barna magas lófarka szabadon hagyja a szemét; zöld hajdísz nincs.
- Az üres, felásott föld újabb kapálással visszaegyengethető. A növényt a kapa megóvja; visszavonáskor magot és fejlődési pontot nem adunk.
- A szomszéd neve Annie; bemutatkozó cím: „Egy kedves szomszéd, Annie.” Az inventory Készlet és Ismerősök fület kap; az ajándék átvétele után Annie portréval és rövid leírással megjelenik. Régi mentésben is megmarad az ismeretség.
- A kertészkedés 2. szintje 36 érdemi művelet után érhető el, a kezdő kert rendes gondozásával körülbelül 2–3 nap alatt. Művelet közben öt másodpercre megjelenik a jobb alsó függőleges zöld csík.
- Új föld felásása helyenként egyszer, ültetés, üres vagy beültetett föld öntözése és betakarítás naponta/helyenként egyszer, kézi gazszedés naponta/objektumonként egyszer ad pontot. Az öntözés ültetés előtt is fejleszt; az ugyanazon a napon és helyen ismételt azonos művelet, illetve a ki-be kapálás nem ad ismét pontot. A fejszés és csákányos munka nem része a kertészkedésnek.
- A 2. szint jutalma egyszeri 4 eperpalánta, 4 mézbogyócsemete, 4 áfonyacsemete. Ekkor válik elérhetővé a katalógusban a három ültetőanyag; nem csak a jutalom gyümölcse, hanem a saját termés is eladható.

| Növény | Ültetőanyag ára | Termény eladási ára | Első termés, öntözött nap | Újratermés |
| --- | --- | --- | --- | --- |
| Eper | 20 gold / palánta | 14 gold | 4 | 2 nap |
| Mézbogyó | 25 gold / csemete | 16 gold | 5 | 2 nap |
| Áfonya | 45 gold / csemete | 30 gold | 6 | 2 nap |

- A palánták és csemeték a korábbi magokkal azonos rendelési, másnapi kézbesítési és ültetési folyamatot használják. A bokrok és az eper betakarítás után megmaradnak; öntözés nélkül nincs fejlődés. Az induló zöldségárak nem változnak.
- A zene saját, Web Audio hangszintézissel megszólaló instrumentális kompozíció, pengetős és lágy billentyűs hangokkal, külső hangfelvétel nélkül. Az első felhasználói művelet indítja, Menü → Zene kapcsolja, a beállítás helyben megmarad. Háttérbe kerülő lapon szünetel. A hangzás egyelőre kipróbálandó prototípus.

- A két éjszakai figyelmeztetés 8 másodperces jelenetet kap: rövid olvasási idő után felfelé úszik, a képernyő tetején elhalványul és eltűnik. Új figyelmeztetés újraindítja, napváltás megszakítja; az éjszaka játékmeneti időpontjai nem változnak.

- A visszatérő gaz, ágak és kövek helyét véletlenszerűen választjuk ki, az előző helytől legalább 52 világegységre. A művelt föld, ágyások, ösvények, épületek, tó, kerítés, más tárgyak és a madárodú környezete védett. Az új pozíciók a reggeli mentés részei; betöltéskor nem sorsoljuk újra őket. A kövek ütközése az aktuális helyüket követi, eltakarítás után nem marad láthatatlan akadály.

- A zene alaphangereje kissé erősebb. A menü készletgombja egyszerűen „Készlet”; a Tab gyorsbillentyű megmarad. Annie ismerősök közötti képe ugyanazzal a karakterrajzolóval készül, mint a farmon látható alakja, kalappal és barna kabáttal. A főhős ingének lejtős válla és beszűkülő dereka van, arca keskenyebb, ovális, szeme világos szemfehérjével, íriszével és fényfolttal készül.

- A kertészkedés 2. szintjét középre rendezett, nagy betűs jutalomablak ünnepli hulló virágszirmokkal; a játék az elolvasásáig szünetel. A kapott ültetőanyag azonnal kiválasztható az eszközsoron. A v10 mentésre váltás a korábban tévesen terményként adott jutalom mellé egyszer hozzáadja a hiányzó ültetőanyagot, a meglévő készlet megtartásával. Annie avatarképe az arcát és kalapját mutatja.
- A főhős további megjelenésbeli módosítása előtt külön karakterterven kell megegyezni; a jelenlegi alak nem elfogadott végleges grafika.

- A készlet harmadik füle a Jártasságok. A Kertészkedés kártyán az aktuális szint, haladási sáv és a 2. szintig hiányzó tapasztalatpont látható; 2. szinten a 3. szintig hiányzó pontokat mutatjuk; jelenleg a 3. szint a legmagasabb. A fejlődést adó munkákat és a jutalmat is ismerteti. Az ünneplés csak a tényleges szintlépéskor jelenik meg, a Jártasságok fülön nincs visszanézés. A három fül nyilakkal, Home/End billentyűkkel is kezelhető.

- A három verandaközeli tárgy felismerhetőbb saját rajzot kapott: az eladóláda nyitott belsővel, vastag peremmel, deszkázattal, vasalattal és terményjelzéssel; a magkatalógus növénymintás zöld borítóval és faállvánnyal; a napló nyitott lapokkal, könyvjelzőszalaggal és tollal az íróasztalon. Az interakciós helyek és a működés változatlan.

- Felhasználói kérésre visszavontuk a B főhős első játékbeli változatát, a verandaszéket és a kézben tartott kosár legutóbbi módosítását. A korábban elfogadott eladóláda, magkatalógus és napló részletes rajza megmarad.


## Kertészkedés 3. szint és ültetőanyag-utánpótlás

- Új farm indításakor 100 gold jár. A már létező mentések pénzét nem írjuk át.
- A 3. kertészkedési szint további 36 érdemi művelet, összesen 72 tapasztalatpont után érhető el. Egyszeri jutalma 4 sárgarépamag, 4 salátamag és 4 hagymamag. Mindhárom azonnal kiválasztható az alsó eszközsoron, és rendelhető a katalógusból. A szintlépés középen ünnepelhető csak az elérésekor jelenik meg, és a Jártasságok fülön nem nézhető vissza.

| Növény | Vétel, gold/db | Eladás, gold/db | Öntözött nap az érésig | Újraterem |
| --- | --- | --- | --- | --- |
| Sárgarépa | 10 | 22 | 4 | Nem |
| Saláta | 5 | 12 | 2 | Nem |
| Hagyma | 15 | 32 | 5 | Nem |

- Minden sikeresen kiszedett gaz 25% eséllyel ad egy véletlenszerű, eddig feloldott ültetőanyagból 1–3 darabot. A régebben feloldott növények később is a találati készletben maradnak: induláskor 3, a 2. szinten 6, a 3. szinten 9 típus közül sorsolunk. A tele készlethalmazokat a tárolási korlát miatt kihagyjuk. A találat külön, kicsi, ikonos, enyhén szirmozó értesítésben látszik; nem nyit meg szintlépési ablakot. A gaz eltakarítása és a magtalálat ugyanabban a mentésben rögzül.
- A korábbi mentések v11 formátumra frissülnek: a megszerzett pontok, magok, termények, pénz, rendelések és díszek helyei megmaradnak. A 2. szint jutalma frissítéskor nem ismétlődik.
- A visszaállított, első barna hajú főhős ingujja keskenyebb, vállvonala lejtős; arca és haja megmarad.

Nyitott javaslatok, még nem elfogadott követelmények: kapun túli gyűjtögetős rét; fa és gaz felhasználásával komposztáló készítése; később falusi faiskola és tyúkól.

- A fejlődési jelző mindig az aktuális szinten szerzett pontokat mutatja: a 2. szint elérésekor 0/36-ról indul a 3. szint felé. A mentett összes pont változatlan, korábbi haladás nem vész el. A szám a függőleges csík fölött nagy, világos felirat; pontszerzéskor megugrik és +1 visszajelzés kíséri, a csík finoman megrezdül. Csökkentett mozgás beállításánál nincs ugrás vagy remegés. A Jártasságok fül ugyanezt a szintenkénti haladást és az ültetést is tartalmazó leírást mutatja.


## Kezdőmenü és külön farmmentések

- A játék megnyitásakor Folytatás / Új játék kezdőmenü jelenik meg. A Folytatás az utoljára játszott farmot nyitja meg. A Mentett farmjaid listában farmnév, játéknap, gold és mentési idő látszik; a többi birtok innen nyitható meg.
- Az Új játék a bevezetővel közös névadó ablakot nyitja. A létrehozásig vissza lehet lépni, ilyenkor nem keletkezik új mentés. Az új farm 100 golddal, a kezdő 4-4-4 maggal, 1. nappal, 0 jártasságponttal és újra elérhető Annie-látogatással kezd; a kert, rendelések, készlet és történeti események önállók.
- A meglévő aktív mentés első megnyitáskor a farmok listájába kerül, adatvesztés nélkül. A farmoknak egyedi azonosítójuk és külön előző biztonsági mentésük van. Azonos farmnév sem ír felül másik birtokot. A pillanatnyi állapot a farmválasztó megnyitásakor elmentődik; új farm létrehozása és a váltás atomikusan rögzül. Sikertelen íráskor az eredeti állapot és kiválasztás marad meg.
- Játék közben Menü → Kezdőmenü · Farmválasztás vezet vissza a listához. A kezdőmenüben az idő áll. Farmváltáskor a jelenet teljesen újraindul, így nem maradnak át az előző farm eszközei, madarai, szereplői vagy értesítései. A mentés jelenleg Snapshot v12 formátumú, az IndexedDB adatbázisa továbbra is v1; a farmkatalógus és a farmonkénti mentések külön rekordok ugyanabban a tárolóban.

- A Jártasságok fül nem kínál előnézetet vagy visszanézést az ünneplésekhez. A szint, a haladás és a fejlődés leírása látható.
- Új farm létrehozásakor kizárólag a farm nevét kell megadni, legfeljebb 40 karakterrel. A farmer neve nem választható és nem jelenik meg a farmválasztóban. A korábbi v1–v11 mentések v12-re frissülnek, a meglévő farmhoz nem találunk ki farmernevet és nem kérünk kötelező új névadást. A jártasság, pénz, kert, rendelések és külön farmmentések megmaradnak.

- A felület legutóbbi egyszerűsítése: a mentett farmok kártyáin és a Folytatás gomb alatt nincs farmernév, a kártyákon nincs kertészkedési szint. A Jártasságok fülről az ünneplések visszanézését teljesen eltávolítottuk; az automatikus szintlépési ünneplés megmarad. Új farm indításakor kizárólag a „Farm neve” mező látható és szükséges. A korábban mentett farmerneveket adatvesztés elkerülésére megtartjuk a mentésben, de nem jelenítjük meg; az új farmok farmerneve nincs kitöltve.

### Egyszerűbb készletablak és választható dallam – 2026-10-22

- A Jártasságok fülről lekerül a fejlődést és a 2–3. szint jutalmait részletező három bekezdés; a szint és a haladásjelző megmarad.
- A közös „Tab / Escape: vissza a kertbe” súgó egyik készletfülön sem jelenik meg. A billentyűk továbbra is bezárják az ablakot.
- Az eredeti zene mellé saját, „Réti séta” című instrumentális indie dallam kerül, pengetős hangzással, lágy billentyűkkel és halk ritmussal. A Menü → Dallam mezőben választható, a választás és a némítás helyben megmarad. Külső hangfelvételt nem használ.

### Déli út, erdő és falu – 2026-10-22

- A déli kapun át folyamatosan bejárható út vezet a faluba. Balra tölgyes, nyíres és fenyős erdei ösvény kanyarog; a faluban kövezett tér, szökőkút, padok, virágládák és házak adják a hangulatot. A farm korábbi elrendezése megmarad.
- Elsőként a helyszínek készülnek el: a Faiskola és a Tóparti bolt ajtaján E-vel vagy koppintással lehet belépni, belül sétálni és a pultot megnézni. Vásárlás, gyümölcsfák, haltelepítés és kacsafészek egy későbbi, külön egyeztetett lépés; árak még nincsenek.
- Az erdő négy bokráról bokronként egy áfonya szedhető E-vel, F-fel vagy koppintással, külön szerszám nélkül. A bokrok két nap után újrateremnek. A termés a meglévő áfonyaikon alatt jelenik meg, és a meglévő 30 gold/db áron tehető az eladóládába. A bokrok állapota és a kinti/benti tartózkodási hely is mentődik.
- A farmon történő éjszakai összeesés továbbra is veszteségmentes. A birtokon kívül (erdő, út, falu és üzlet) az összeeséskor 50% eséllyel tárgylopás, 50% eséllyel aranylopás történik. A tárgyág egy véletlenszerű, pozitív darabszámú készletfajtából pontosan 1 db-ot vesz el: nálunk lévő magból/ültetőanyagból, termésből, fából, kőből vagy gazból. Az alap szerszámok és a madárodú védettek; eladóládába tett és postai kézbesítésre váró dolgok nem a nálunk lévő készlet részei.
- Az aranyág legfeljebb 10 goldot vesz el, kizárólag a lefekvés előtti egyenlegből, a másnap érkező eladási bevétel előtt. Üres tárgykészletnél vagy üres erszénynél a kisorsolt ág sikertelen; nem vált át a másik ágra. Reggel pontos veszteséglista vagy „megpróbáltak kirabolni, de nem találtak nálam semmit” üzenet jelenik meg. A hős a ház ajtajánál ébred. Az üzenet elolvasásig mentve marad.
- A mentési formátum v13-ra lép. A v1–v12 mentések továbbra is betölthetők, az új terület állapota alapértékekkel egészül ki. A gyűjtés, ajtón átlépés és napváltás sikertelen mentése nem fogyaszt készletet és nem mozgatja át a hőst.
- A falu és a boltbelsők saját procedurális grafikák. Külső asset vagy új függőség nincs. A szökőkút finom fodrozódása, lassú levélsodródás és esti lámpafény teszi élőbbé a teret.
- A közzétételi workflow Node.js 24-et használó actionökre frissül. A GitHub Actions sárga/várakozó közzététele alatt az élő oldalon még a korábbi kiadás látszik; a sikeres feltöltés nem jelenti önmagában a Pages-közzététel sikerét.

### Falutér, üzletek és új dallam – 2026-10-22

- A két pad a tér északnyugati és északkeleti peremére kerül, ülőfelületével a szökőkút felé. A rajzolás, ütközés és interakció ugyanazokat a helyzeteket és irányokat használja.
- A Tóparti bolt új neve Kertitó Szaküzlet. A tér jobb oldalán, feljebb áll, a tér felé forduló oldalsó bejárattal. A napellenző az ajtó fölé kerül. A faiskola kiállított facsemetéi az ajtó két oldalán lévő bemutatósávokban állnak, a bevezető út szabad.
- A Kertitó Szaküzletben Annie áll a pult mögött. A belső térben különböző méretű akváriumok, tavirózsás dézsa, nád, fészek, merítőháló és tárolóláda látható.
- A faiskolában Leo, a barátságos férfi kertész fogad. Első találkozás után saját, a bolti karakterével egyező arcképpel bekerül az Ismerősök közé. Annie a szaküzletben való első találkozással is megismerhető, a farmon átadott ajándéktól függetlenül.
- Minden üzlet nappal nyitva, a 6. percben kezdődő éjszakától zárva tart. Éjszaka sem billentyűvel, sem koppintással nem lehet belépni. Záráskor a bent lévő látogató a térre kerül; sikertelen mentéskor az átlépés nem történik meg, később újrapróbálható. Mentett éjszakai boltbelsőből folytatáskor is érvényes a zárás.
- A Falu tábla feljebb kerül, az Erdei ösvény táblája az elágazáshoz. Mindkettő tartóoszlopos, fából készült, irányt mutató világobjektum.
- Menü → Dallam: új, vidámabb „Napsütötte reggel” kompozíció. A két korábbi zene megmarad. A választás és a némítás továbbra is helyben tárolódik.

### Elfogadott kertitó-kínálat terve – 2026-10-22

Ezek a következő vásárlási és tóba helyezési fejlesztés szabályai; ebben a változatban a boltokban még nem lehet vásárolni.

| Áru | Vételár | Szerep |
| --- | ---: | --- |
| Tavirózsa | 20 gold | Elhelyezhető tavi növény |
| Nád | 8 gold | Elhelyezhető parti növény |
| Aranyhal | 40 gold/db | A tó halállományának része |
| Ponty | 30 gold/db | A tó halállományának része |
| Vadkacsafészek | 80 gold | Beköltözés után 4 naponta véletlenszerűen 2–4 tojás; eladás 13 gold/db |

- Ikrából a teljes tó háromnaponta összesen egy adagot ad, nem halanként. Az aranyhal és a ponty nem ad különböző ikrafajtát. Hal nélkül nincs ikra. Az adag értéke 1–4 halnál 6 gold, 5–10 halnál 8 gold, 11 vagy több halnál 10 gold.
- A faiskola elfogadott első kínálata: tavasszal ültethető alma-, körte-, szilva- és cseresznyecsemete. A termőidőszak külön kezelendő: cseresznye nyár elején, szilva nyár végén, alma és körte ősszel. A fajlista elfogadva; árak és növekedési idők még nincsenek véglegesítve.

### Külön kirablási értesítés és vizuális reggeli elszámolás – 2026-10-22

- A kirablás vagy rablási kísérlet külön értesítés, eladási sorok és egyenleg nélkül. A főhős előtte mindkét kezét az arcához kapja és egyet ugrik, rövid meglepetéshanggal. A hang a meglévő némítási beállítást követi. Az értesítés csak a játékos továbblépésére zárul be.
- Az eladási összesítő külön, középen jelenik meg, terményikonokkal, darabszámokkal és soronkénti bevétellel. A tegnapi bevétel rövid animációval hozzáadódik a középen mutatott meglévő aranyhoz; a fejléc egyenlege is követi a számlálást. Az ablak az animáció után is nyitva marad: az „Indulhat a nap” gombbal vagy Escape-pel a játékos zárja be; addig a játékidő áll. Üres ládánál is helyes, 0 goldos összesítő látható.
- A játék ideje a reggeli értesítések alatt áll. Csökkentett mozgás beállításnál a számláló animáció nélkül frissül. Hosszú terménylista külön görgethető, hogy az egyenleg telefonon is látható maradjon.
- Az egyenleg jóváírása a napváltás mentési tranzakciójában történik; az animáció kizárólag megjelenítés. A kirablási értesítés és a vizuális elszámolás külön mentett, nyugtázható állapot. Újratöltéskor a még meg nem nézett értesítés folytatható, a bevétel nem íródik jóvá ismét.
- A mentés v14-re lép. A v13-as farmállapot, bokrok és reggeli értesítés megmaradnak, újrabetöltés nem ismétli meg a régi eladási jóváírást. A megváltozott bolthely vagy pad által érintett mentett karakterhely a legközelebbi szabad helyre igazodik, készlet- és aranyvesztés nélkül.


## Vásárlás, gyümölcsfák és kerti tó

- Leo szakállas, barna hajú, barátságos férfi; a portré és a bolti alak ugyanabból a rajzból készül.
- Mindkét üzlet nappal árul. A vásárlás azonnal levonja az árat és a készletbe adja az árut, sikeres mentés után. Tab → Készlet → Elhelyezem; közeli szabad helyre kattintás/F, Escape vagy másik szerszám megszakítja az elhelyezést.
- Egy évszak 15 játéknap; a naptár tavasz–nyár–ősz–tél sorrendben ismétlődik. A meglévő vetemények évszakváltáskor megmaradnak. Korábbi mentésnél az eltelt napokból számoljuk az évszakot; az összes eltelt napot továbbra is a mentés őrzi.
- Mind a négy facsemete tavasszal ültethető, külön öntözés nélkül 15 nap alatt nő meg. A fák nem kerülhetnek útra, veteményre vagy másik fa mellé túl közel. A nyári fák legkorábban a 16. napon teremnek; a beérett termés szedésig megmarad. Újratermési időt a szedéstől számolunk, termés csak a megfelelő évszakban keletkezik.

| Facsemete | Vételár | Hozam | Újratermés | Eladási ár/db | Termő évszak |
|---|---:|---:|---:|---:|---|
| Cseresznye | 300 | 3 | 3 nap | 18 | Nyár |
| Szilva | 270 | 4 | 4 nap | 16 | Nyár |
| Alma | 250 | 3 | 2 nap | 16 | Ősz |
| Körte | 250 | 3 | 3 nap | 16 | Ősz |

- Kertitó Szaküzlet: tavirózsa 20, nád 8, vadkacsafészek 80, aranyhal 40, ponty 30 gold. Tavi növények és halak a vízbe, egy fészek a szabad száraz tópartra tehető.
- Az első hal telepítésétől háromnaponta **a tó összesen egy** ikraadagot ad: 1–4 halnál 6, 5–10 halnál 8, 11 vagy több halnál 10 gold értékben. Az aranyhal és a ponty közösen számít. Korábban keletkezett adag értéke a későbbi telepítéstől nem változik meg.
- A kacsapár a fészek kihelyezésétől számított harmadik nap reggelén költözik be. A beköltözéstől négy naponta véletlenszerűen 2–4 vadkacsatojás keletkezik, 13 gold/db eladási árral.
- A termés, ikra és tojás közelről E/F/Szedés használatával gyűjthető; a tó termékei a partról vehetők fel. A készletből a megszokott eladóládába tehetők, másnap reggel jóváírva. A le nem szedett termékek megmaradnak.
- Új vásárlások és begyűjtött termékek is elveszíthetők a falusi rablásnál; az elhelyezett fa, tóban élő hal, fészek és tavi növény nem a hordozott készlet része. A madárodú és az alap szerszámok továbbra is védettek.
- Mentésformátum v15: v14 migráció megőrzi a farmot, tárgyakat, ismerősöket és függőben lévő reggeli üzeneteket; csak üres gyümölcsös/tó állapotot ad hozzá. Az áthelyezett épületben rekedt régi mentési pozíciót közeli járható helyre tesszük.


## Bővíthető birtok és halanimációk

- A korábbi 800×600-as birtok 1600×960-as területre bővül: balra és jobbra 400, északra 360 egységnyi új, bejárható kert kerül. A ház, tó, lezárt épület, meglévő kert és déli falusi kijárat koordinátái megmaradnak. A kamera követi a főhőst az új részeken is.
- Az új részeken 72, szabálytalan helyen elosztott gaz-, ág- és kőfolt tisztítható meg a meglévő eszközökkel. A megtisztított talaj kapálható, vethető és öntözhető; gyümölcsfa és madárodú is elhelyezhető. A két napos visszanövés a nagyobb telken is működik, és elkerüli a művelt földet, fákat, fészket és más rögzített objektumokat.
- Régi mentésben a korábbi eltakarítások és anyagok megmaradnak; csak az új terület kap új tisztítandó pontokat. A kiterjesztett koordináták, új ültetések és visszanövési helyek menthetők.
- A haltelepítés sikeres mentés után felfelé ívelő karlendítéssel és dobással történik; a hal csobbanással és fodrokkal érkezik a kiválasztott vízfelületre. Az animáció nem fogyaszt további halat; sikertelen mentésnél nincs telepítés.
- Nappal a tóba telepített halak időnként kiugranak a vízből, majd rövid fodrozódást hagynak. Üres tónál és éjszaka nincs ugráló hal; az aranyhal és a ponty színe különbözik. Ez hangulati animáció, nem ad új tárgyat vagy ikrát.

- Annie a pultnál kezdeményezett interakciókor kedvesen megemlíti az ajándék madárodút, ha a játékos már megkapta. A szöveg figyel arra, hogy az odú már ki van-e helyezve, vagy még a készletben van. Az üzletbe belépés önmagában nem indítja ezt a megjegyzést; vásárlás után a vásárlás visszajelzése jelenik meg.


## Üzleti beszélgetések és a tó finomításai

- Az üzletekben a pult előtti interakció a vásárlást nyitja. A kereskedő mellé, a pult bal oldala felől sétálva E/F vagy a szereplőre koppintás külön beszélgetést indít, vásárlási táblázat nélkül. Mind Annie, mind Leo megszólítható; első találkozáskor az ismeretség mentődik.
- Annie korábban elfogadott madárodús mondata megmarad, kizárólag a beszélgetési ablakban. Leo a birtok új életéről és a türelmes növekedésről beszél. Nappali nyitvatartás mindkét interakcióra érvényes.
- A nád leírása: „Később kosárfonáshoz hasznosítható.” Kosárfonás egyelőre későbbi mechanika.
- Leo portréja és a boltban álló alakja hangsúlyosabb állvonalat, részletesebb szemeket, szemöldököt és jól látható, csukott szájú mosolyt kapott; szakálla megmarad.
- A tér cserepes növényei a padok mellé kerülnek, az ülőfelületek szabadok. A tavirózsa bemetszett levelekkel, több sziromréteggel és sárga virágközéppel ismerhető fel.
- A halak telepítés után nem láthatók mozdulatlanul a vízfelszínen. A dobás/csobbanás és az időnkénti nappali ugrás animációi megmaradnak; ikratermelés változatlan.
- A vadkacsafészek kezdetben üres. Mindig a **kihelyezéstől** kell eltelnie három teljes játéknapnak, a vásárlás és a készletben tárolás ideje nem rövidíti le. Példa: 5. napi kihelyezés → 8. nap reggeli beköltözés.
- Beköltözéskor két kacsa repül be a fészekhez, a kamera a tóra fordul; külön reggeli üdvözlő ablak jelenik meg. A felhasználó bezárása után következik a külön eladási elszámolás. A már látott érkezés nem ismétlődik visszatöltéskor; egy függőben lévő érkezés visszanézhető marad, jutalmat nem dupláz.
- Az első 2–4 tojás a beköltözés utáni negyedik reggelen keletkezik, majd négy naponta újra. Eladási ár továbbra is 13 gold/db.
- Mentésformátum v16: a v15-ös halak, növények, holmik, korábban keletkezett tojások és ismeretségek megmaradnak. Már kihelyezett régi fészeknél annak mentett kihelyezési napját használjuk; az érkezés a következő alkalmas reggelen történik. A még készletben lévő régi fészek ugyanúgy csak a későbbi kihelyezéstől számít három napot.


## Betakarításjelzés és beszélő szereplők

- Az érett vetemény apró pöttyét nagyobb, világos aranyszínű, sötét szegélyű, halvány fényudvaros pipa váltja fel. A termő gyümölcsfa is ugyanezt a jelzést kapja. A növekedési és betakarítási szabályok változatlanok.
- Leo haja egységes barna; a korábbi világos hajfoltok és szakállfoltok eltűnnek. Az arc és a csukott szájú mosoly finomabb vonalakat kap.
- Annie és Leo beszélgetése és a pultnál elhangzó kereskedői szöveg portrés beszédpanelben jelenik meg. A név és a portré mellett világos papírszínű beszédbuborék, a portréra mutató nyíl és kézi Folytatás gomb látható. A portré a játékbeli rajzból készül.
- Beszélgetésnél a panel a képernyő alsó részén ül; a pultnál ugyanilyen beszélőfejléc alatt, görgethető kínálattal vásárolhat a játékos. Telefonon a portré kisebb és a szöveg alatta tördelődik.
- Más felületek (készlet, napzárás, elszámolás, menü) megőrzik a saját megjelenésüket; a beszélőjelzés bezárás és újbóli megnyitás után sem ragad rájuk.


## Elfogadott kezdő történet — Sam

Az új farm elnevezésekor és a Menü → Történet felületen az alábbi közös szöveg jelenik meg. A főhős neve Sam. A labor rejtélyének későbbi magyarázata nyitott; a bevezető nem rögzít zombis irányt. A korábbi mentésekből is elérhető a Történet menüpontban, új játék nem szükséges az elolvasásához.

> Sam egy kutatólaborban dolgozott, ahol rovarokon élősködő gombákat vizsgáltak.
>
> Az utolsó hónapokban egy szokatlan minta érkezett a laborba. Az eredmények nem illettek ahhoz, amit addig tudtak. Sam még azelőtt eljött, hogy kiderült volna, mit találtak.
>
> „Szeretném megtudni, képes vagyok-e a saját kezemmel otthont teremteni ezen a helyen.”

- Az összeszedhető ikrát a nyugati sekély vízben, vízinövény szárára tapadó, áttetsző aranybarna ikraszemek csomója jelzi. A korábbi közös, nagy világos kör eltűnik; a gyűjthető kacsatojások külön, a fészekben láthatók. A gyűjtés, érték és termelési ütem változatlan.


## A játszható változat vége

- A jelenlegi változat az első tavasz 15. napjáig játszható. A naplóval lezárt utolsó nap és az éjszakai összeesés is a fejlesztés végéről szóló üzenetre vezet, a nyár nem indul el.
- A 15. nap végállapota mentődik, a következő nap növekedése, rendelései, termelése és eladási elszámolása nem fut le előre. A ládába tett termény, holmik, pénz és minden elért eredmény megmarad a későbbi folytatáshoz. A lezárt napot a meglévő óraformátum teljesen eltelt napként őrzi, új mentésverzió nélkül.
- Visszatöltéskor ugyanez a végüzenet jelenik meg. A játékos a farmválasztáshoz térhet vissza, másik vagy új farmot indíthat, illetve letöltheti mentését. Escape nem indítja tovább a lezárt napot.
- A korábban már nyárba vagy későbbre jutott mentéseket nem tekerjük vissza: megnyitásukkor ugyanez a fejlesztési határ fogadja a játékost, az eredeti adatait megőrizve.

- A bevezetőből eltűnt az „EGY ÚJ KEZDET” és a „Végre megérkeztem.” címsor. A farmnév mezőben nincs helykitöltő, a „Farm neve” címke megmarad. Az indítógomb felirata „Tovább”. A Történet menüpont ugyanezt a cím nélküli bevezetőt mutatja.

- A fejlesztési határ véglegesített üzenete: „FOLYTATÁS KÖVETKEZIK” / „Itt tart most a történet.” / „Elérted a játék jelenlegi változatának végét. A történet egy későbbi frissítésben folytatódik, de addig is szabadon gondozhatod a farmodat. Köszönöm, hogy játszottál! 🙂”


## Farmtörlés és a saját tesztfarm

- A kezdőmenüben nincs „JÓ ITT LENNI” felirat.
- A mentett farmok mellett Törlés gomb jelenik meg. Előbb külön megerősítő ablakban látszik a farm neve és a kért figyelmeztetés: „Biztosan törölni szeretnéd ezt a farmot? A farm törlés után nem visszaállítható.” Alapból a Mégse kap fókuszt; Mégse/Escape semmit nem töröl.
- Megerősítéskor csak az adott farm és saját biztonsági mentése törlődik, egyetlen adatbázis-tranzakcióban. A többi farm változatlan marad. Aktív farm törlésekor az aktív/biztonsági másolat aliasai is eltűnnek; a játék farmválasztásra tölt újra, nem hozza vissza a törölt farmot. Az utolsó farm is törölhető, utána új játék indítható. Sikertelen tranzakció esetén a teljes farm és a lista megmarad.
- Az **Erdőszéli birtok** nevű farm a felhasználó tesztfarmjaként továbbjátszható a tavasz után is. A kivétel a farm nevéhez kötött (ékezetes név, kis/nagybetű és szélső szóköz normalizálásával), tehát minden ilyen nevű mentésre érvényes. Más farmokon a 15 napos korlát marad. A tesztfarm pénze, készlete és kertje megmarad. A naptárra vonatkozó későbbi pontosítást és a v17 történeti bővítést az alábbi fejezetek rögzítik.

## A faliméhek nyomában — a gépjavításig

- Már az első napon látható önálló cél: **„Fedezd fel, mit rejt a lezárt melléképület”**. Nincs hozzá útmutatás, kulcsra vagy későbbi küldetésre utalás.
- A 4. napon Leo besétál a farmra. Beszélgetéskor 6 tasak vadvirágmagot ad. Ha a nap kimaradt, a következő nappali alkalommal várja a játékost; a régebbi tesztmentésekből is elkezdhető a történetszál.
- Leo: „Tavaly ilyenkor sok szarvas faliméh járt a csemeték virágaira. Idén eddig alig láttam belőlük. Nálad megfordultak?” A választott, valós faj a **szarvas faliméh (Osmia cornuta)**, sötét fejjel és rozsdabarna potrohhal. Fontos tavaszi gyümölcsfa-beporzó. A történet helyi megfogyatkozást mutat, nem állít általános veszélyeztetettséget vagy bizonyított gombás fertőzést.
- A virágos feladat külön cél, nem árulja el, hogy a kulcshoz vezet. A vadvirágmag a készletből és az alsó eszközsávból ültethető, üres felkapált földbe. Ültetéséért jár kertészkedési pont. **4 megöntözött nap** után virágzik, nem kell újravetni. A történeti virágos kert nem kapálható ki véletlenül.
- Mind a hat virág kivirágzását követő naptól, nappal jelenhet meg a megfigyelhető vadméh. Közelről, külön E/F/buborék interakcióval figyelhető meg. A napló megőrzi a fajt, a napot és a látogatott vadvirágokat. Egy példány megjelenése nem jelenti az állomány helyreállítását.
- A megfigyelésről Leónak a boltban, külön beszélgetésben lehet beszámolni. Ekkor adja át az előző gazdától rábízott melléképületkulcsot.
- A melléképület önálló bejárható belsőt kapott. Először sötét: fel kell húzni a redőnyt. A munkapad és a megkopott jegyzet külön megvizsgálható; a nagy, rozsdás berendezés tartályához, csöveihez, szűrőjéhez és hűtőspiráljához külön oda lehet lépni. A redőny és a vizsgálatok állapota mentődik.
- A gép megvizsgálása után javítási cél jelenik meg. Mind a négy alkatrészt meg kell vizsgálni a javítás előtt. Anyagszükséglet: **35 fa, 30 kő, 18 ócskavas, 1 rézcső, 1 üvegedény és 1 lenszövet**. A javítás egyetlen mentési művelettel, pontosan egyszer fogyasztja el ezeket.
- Kilenc, a kibővített birtokon elhelyezett fémhulladék-kupac egyenként 2 ócskavasat ad; a régi szivattyúból 1 rézcső nyerhető. Annie az üvegedényt, Leo a lenszövetet történeti beszélgetésben adja. A korlátozott történeti készlet és a kulcs nem vész el az éjszakai eseményben, hogy a történet ne váljon teljesíthetetlenné. A fa és a kő továbbra is a szokásos készlet része.
- Javítás után kiderül: **növényi kivonatkészítő berendezés**, tartállyal, csövekkel, szűrővel és hűtőspirállal. A kivonatok és receptek még nincsenek megvalósítva. A gombák szerepe és az élővilág helyreállításának későbbi módja nyitott.
- Mentésformátum **v17**: a v16 farm adatai megmaradnak, külön történeti állapottal bővülnek; a javított gép, a megfigyelés, a felvett tárgyak és az elhasznált anyagok újratöltéskor sem ismétlődnek.

## Tesztnaptár, napi kacsatevékenységek és az erdő

- Az „Erdőszéli birtok” tesztfarmon a kijelzett dátum és az évszakhoz kötött szabályok mostantól mindig **Tavasz 15. napja** szerint működnek. A belső nap számlálója tovább halad: a növények nőnek, a gaz visszanő, a rendelések, ikrák és tojások a szokásos időközönként érkeznek. A meglévő kert és készlet nem áll vissza. Más farmokon a tavasz végi fejlesztési határ változatlan.
- A beköltözött két vadkacsa reggel a parton keresgél, napközben úszik, tollászkodik, majd éjszakára a fészekhez tér pihenni. Folyamatos mozgás és vízgyűrűk, finomabb tollminták és arc szerepelnek; az érkezés és a tojások üteme változatlan.
- Az Erdei ösvény körül többféle sűrűbb facsoport és egymás mögötti lankák erősítik az erdei hangulatot. A törzsek kerülik az ösvényt és a bogyós bokrokat. Új törzsre eső régi mentési pozícióból a hős közeli szabad helyre kerül, tárgyvesztés nélkül.
- A grafika saját Phaser-rajz, új külső asset vagy függőség nélkül.

## Célok és a vadvirágok gondozásának visszajelzése

- Az alsó eszközsáv felirata egyszer szerepel: „Vadvirág magok”.
- A képernyőn megjelenő önálló célok mindegyike gondolatjellel kezdődik; a lezárt melléképület és a virágos feladat elkülönül.
- Tab → **Célok**: negyedik fül a Készlet, Ismerősök és Jártasságok mellett. A teljesített lépések megmaradnak, díszített pipával. A teljesítések a meglévő mentett történeti állapotból következnek, új mentésformátum nélkül. Tab és Escape innen is bezár.
- A gondozás kijelzett, négy napos számlálója a mai öntözést is beleszámítja, amint mind a hat virág megkapta az adott gondozási napot. A tényleges növekedés továbbra is napváltáskor történik. A mai öntözött virágok darabszáma nem jelenik meg.
- A méh megfigyelésének célja rövid marad; nincs hozzá feltételeket magyarázó szöveg. A megfigyelési mechanika nem változott.

- A melléképület célja a kulcs átvétele és a redőny felhúzása után is változatlanul „Fedezd fel, mit rejt a lezárt melléképület”. Sem a HUD, sem a Célok fül nem ad hozzá belépési, redőnyös vagy gépvizsgálati útmutatást.

## A műhely vizsgálatának egyszerűsítése és tárgyikonok

- A szűrőház, hűtőspirál és csőhálózat megvizsgálása csak az adott tárgy szövegét mutatja. A szűrőház leírásából eltűnt a „Leo és Annie talán tudnak segíteni.” mondat.
- Az anyagszükséglet és a javítás gombja csak az üstszerű tartálynál jelenik meg. A „Megvizsgált géprészek: … / 4” számláló külön, lejjebb kerül, elválasztva az anyaglistától. Nincs hozzá vizsgálatra felszólító útmutatás.
- A beszerzési helyek és szereplők felsorolása sem a vizsgálati ablakban, sem a célok között nem jelenik meg. A javítás céljához nincs gyűjtésre felszólító magyarázat; a HUD anyagai előtt gondolatjel áll.
- A javítás gombja hiányzó anyaggal is megnyomható. Ekkor az ablakban „Nincs nálad elég nyersanyag.” figyelmeztetés jelenik meg, anyaglevonás nélkül. A sikeres javítás feltételei változatlanok.
- Az ócskavas, rézcső, üvegedény, lenszövet és melléképületkulcs saját, a meglévő készletgrafikához illő SVG-ikont kapott. Saját rajzok, külső asset nélkül.

## Tavaszi időjárás és a célok tömörítése

- A tavasz 15 napja véletlen sorrendben **9 napos, 3 felhős és 3 esős napból** áll. A farm saját sorsolási magja a mentésbe kerül; frissítés és visszatöltés nem sorsolja újra. Régi mentés az első betöltéskor egyszer kap saját magot. Ez a v17 formátum visszafelé kompatibilis, opcionális bővítése.
- **Napos:** meleg fény, több látható lepke/beporzó. **Felhős:** lágyabb fény és lassan mozgó felhőárnyékok. **Esős:** saját szintetizált esőhang, esőcsíkok, gyűrűk a tó vizén és nedves föld. Az épületek belsejében nem esik az eső.
- Az eső megöntözi az üres felkapált földet, a veteményt és a vadvirágok földjét is, beleértve az esős napon újonnan felkapált földet. Nem ad külön növekedési bónuszt vagy jártasságpontot: a kézi öntözést helyettesíti, a fejlődés továbbra is egyszer, reggel történik. Száraz napon a következő napi földet újra öntözni kell.
- **Nincs másnapi időjárás-előrejelzés.** Csak a mai állapot látszik a dátum mellett. Vihar, terméskár és új nyári mechanika nem került bevezetésre.
- Az Erdőszéli birtok tesztfarm belső napjaihoz kapcsolódik az időjárás; a kijelzett Tavasz 15. változatlan. Minden következő 15 belső nap ugyanilyen arányú, új sorrendet kap. Más farmokon a fejlesztési határ változatlan, a lezárt állapot nem fejlődik tovább.
- A javítási cél nyersanyagai fekete pöttyös listában, normál sorközzel jelennek meg. A „Vadvirág magok” felirat két sorra törik, a gomb szélessége megegyezik a többi eszközével.
- Ellenőrzés: 206 egységteszt, build, valamint közvetlen Chromium-ellenőrzések a három időjárásra, visszatöltésre, esős öntözésre és napváltásra. A Cypress futtató binárisa hiányzik a környezetből; a Cypress-esetek kiegészültek, de itt nem futtathatók.
- A Menü és más játékablakok bezárásakor a billentyűzet fókusza visszatér a játéktérre. A Space azonnal ugrást indít; nem aktiválja újra a korábban fókuszált Menü gombot. Bezárógombbal és Escape-pel is ellenőrizve.

## Eszközmozdulatok, háromnapos visszatérés és gépjavítási ünneplés

- A fejsze, csákány és kapa a vállból induló magas emelést, rövid megtartást, gyors célzott lecsapást és visszarendeződést kapott. A kar nem ugrik többé a csípőhöz, és nem nyúlik meg. A főhős korábban visszaállított külseje megmarad.
- A mozdulat ideje változatlanul 0,52 másodperc; a találat a mozdulat 60%-ánál történik. A mozdulat közben a hős megtámaszkodik, utána a lenyomva tartott irányra azonnal továbbindulhat. A találati képkockán tűnik el a tárgy és jelenik meg a forgács, kőszilánk vagy földhatás. Az öntözés és a kézi munka kíméletesebb mozdulatot használ.
- A készletet érintő mentés előbb sikeresen befejeződik; az animáció és a részecskék nem adhatnak újabb jutalmat. A napváltás megszakítja a régi mozdulatot, miközben a már megszerzett tárgyak megmaradnak.
- A kövek, ágak és gaz mostantól **3 játéknap után** térnek vissza, továbbra is üres helyre. Az ócskavas-kupacok is 3 nap után újra gyűjthetők. A felvételi napjuk mentődik; a régi, dátum nélküli felvételeknél az új szabály bevezetésekor aktuális nap lesz a kiindulás. A szivattyú történeti rézcsöve egyedi marad. A termesztett és erdei növények növekedési/újratermési ideje nem változott.
- Futásjavítás: a párbeszédablak törölhette a Phaser Shift-állapotát, miközben a játékos fizikailag továbbra is lenyomva tartotta. A Shiftet külön, a párbeszédek alatt is követjük. Felengedéskor, fókuszvesztéskor és elrejtett lapnál megszűnik a futás; mindkét Shift használható.
- A javításra váró kivonatkészítő látványosan romosabb: rozsdafoltok és repedés a tartályon, sérült tartóbak, megszakadt csövek, hiányos szűrő, elmozdult és hiányos spirál, üvegszilánkok. A négy vizsgálható rész továbbra is felismerhető. Javítás után ép csőhálózat, rendezett spirál, szűrő, üvegedény és új kőalap látszik.
- A sikeres javítás ablakának hátterében finom cseresznyevirág-szirmok hullanak. A következő párbeszédbe nem kerülnek át, és csökkentett mozgás beállításnál nem animálódnak.
- Ellenőrző képek és a játékban megjelenített mozdulatfázisokból összeállított GIF-ek a `docs/concepts` mappában találhatók. A Cypress-esetek a visszatérésre, Shift-kezelésre és az egyszeri gyűjtési jutalomra is frissültek; a futtató binárisa ebben a környezetben továbbra sem érhető el.

### A régi műhely külseje
- Megtartott hely és bejárat; kő lábazat, kopott faburkolat, enyhén aszimmetrikus, részletes cseréptető, kevés moha, eresz és lefolyó.
- Vaskilincs, kulcslyuk, kopott küszöb, sarokban borostyán, a bejárat mellett agyagcserepek. A redőnyös ablak kívülről is követi a benti redőny állapotát.
- Oldalsó falilámpa: alkonyattól fokozatosan erősödő, meleg fény a lámpás körül és a talajon. A mentések és az interakciók változatlanok.
- Saját, programmal rajzolt grafika. Ellenőrző képek: `docs/concepts/workshop-exterior-day-final.png`, `workshop-exterior-open-final.png`, `workshop-exterior-night-final.png`.
- A képernyőn követett célok fekete pöttyöt kapnak a gondolatjel helyett. A megfigyelés elmesélésének célja csak „Meséld el Leonak a megfigyelésedet”; a Leo mellé lépést magyarázó mondat törölve a képernyőről és a Célok fülről. A cél megnevezése nem tartalmazhatja a megoldás részletes útmutatóját.

### Nagyobb épületek, két redőny és műhelytakarítás
- A melléképület külseje kb. 23%-kal nagyobb, ugyanahhoz a bejárathoz igazítva; ütközése és esti lámpájának fénye követi a méretet.
- Belül a meglévő bal felső ablak megmarad. Az ajtó jobb oldalán belül is ablak van; a takart első falból csak keskeny ablakrész és párkány látszik. Új felfedezéskor mindkét redőnyt külön kell felhúzni, egyenként világosítják a helyiséget. A gép részei a teljes világosságban vizsgálhatók.
- A korábbi mentésben már feltárt műhely második redőnye is nyitott marad. Az új állapotok opcionális, visszafelé kompatibilis mentésmezők.
- A javítatlan műhelyben három kézzel leszedhető pókháló van. Kéz eszközzel, közelről E/F vagy a művelet indításával eltávolíthatók; leszedésük mentődik és nem térnek vissza.
- A lakóház is kissé nagyobb lett, külön szélesebb és mélyebb verandával, széles lépcsőkkel. Törtfehér vakolat, kő lábazat, részletes cseréptető, téglakémény, fa ablakkeretek, mohazöld spaletták, virágos ablakládák, eresz, kopott lábtörlő és sáros csizma díszíti. Az ajtó melletti lámpás este meleg fényt ad. A napló és a magkatalógus megközelítése megmarad.
- Ha egy korábbi mentésben a játékos helyét az épületek új széle elfoglalná, betöltéskor eléjük kerül; készlete és farmja megmarad.
- Saját rajzolt grafika. Képek: `farm-home-larger-day.png`, `farm-home-larger-night.png`, `workshop-larger-exterior.png`, `workshop-two-shutters-dark.png`, `workshop-two-shutters-partial.png`, `workshop-two-shutters-open.png`, `workshop-cobweb-cleared.png` a `docs/concepts` mappában.


### Épületjavítások és bejárható otthon
- A lakóház teljes homlokzata nagyobb lett (az eredeti szélesség 135%-a), külön, alacsonyabb előtetővel a veranda felett. Az ablakládák az előtető fölött, a magkatalógus a veranda jobb oldalán, az eladóláda az oszloptól balra, szabadon áll. A két falilámpa a homlokzat két szélén van.
- A műhely külseje az eredeti 150%-a lett; a bejárat horgonya megmarad, az ütközés és lámpafény követi a méretet.
- Az E-s pókhálós interakció automatikusan kézzel történik, nem igényli a Kéz eszköz előzetes kiválasztását. Eltávolítása továbbra is végleges.
- A futás fizikai billentyűállapotot követ a párbeszédek és átmenetek alatt is. Monoton eltelt idővel mozog, legfeljebb 100 ms-os lépést kezel, kis ütközésvizsgáló részlépésekkel; lassabb képkockák után sem vész el a mozgásidő.
- A ház ajtajánál E-vel vagy az ajtóra kattintva be lehet lépni. Egyszerű belső: ágy, könyvespolc könyvekkel és jegyzetekkel, utazótáska, dobozok, szőnyeg, ablak és függöny. A könyvespolc és a táska megvizsgálható. Első belépéskor Sam gondolata: „Még elég üres. Idővel szeretném igazán otthonossá tenni.”
- Az ágy berendezési tárgy, nem nyit mentést vagy napzárást. A mentés továbbra is automatikus, a napzárás a verandai naplónál marad. A ház a biztonságos farm része, nincs kirablás; a belső helyzet és az első látogatás mentődik, korábbi farmok kompatibilisek.
- Ellenőrizhető képek: `farm-buildings-separated-day.png`, `farm-buildings-separated-night.png`, `home-interior-first-entry.png`, `workshop-window-right-cutaway.png`, `workshop-web-e-fixed.png` a `docs/concepts` mappában.
- Ellenőrzés: 217 egységteszt és build sikeres. Közvetlen Chromium-ellenőrzés: E-s pókhálószedés kapa mellett és újratöltés; házba be-/kilépés, benti mentés, könyvespolc, dekoratív ágy és verandai napló; séta/futás a műhelyben és folyamatos Shift a kilépésnél. 600 ms alatt kb. 62 egység séta és 100 egység futás; kilépés után 250 ms alatt kb. 45 egység futás, késleltetés nélkül. A Cypress tesztek igazítva az új helyekhez, de a futtatást a környezetben hiányzó Cypress bináris blokkolja.

### Mentés betöltése épületváltozás után és veranda arányai
- A mentett kerti dekorációk (eltakarított és aktív gaz, ág, kő) pozíciója és a madárodú is érintett lehet az új épületkontúrokban. Betöltéskor csak az újonnan elfoglalt sávok tárgyai kerülnek közeli, szabad helyre, a készlet, gyűjtési napok, növények és haladás megtartásával. A nyers eredeti mentés a tárhelyen a sikeres további mentésig érintetlen marad. Korábbi fájlformátumok frissítése után is lefut az elrendezés helyreállítása.
- Ha a betöltés továbbra is hibás, az eredeti aktív mentés, biztonsági másolat és kiválasztott farmrekord az „Eredeti mentés letöltése” gombbal kimenthető. A letöltés nem ír az adatbázisba.
- A veranda tetője magasabban, a két ablak spalettái között fut; az oszlopok különítik el az alacsonyabb járófelülettől. A virágládákat és a tető vonalát egymástól elválasztottuk.
- Az ágyások szélesebb földszegélyt, magasabb fa oldalfalat, szegeket és talajárnyékot kapnak. Az ösvény és a mentett ültetések helye megmarad; a művelési szabályok nem változnak.
- Képek: `docs/concepts/farm-porch-raised-roof-and-planters.png`, `docs/concepts/farm-porch-raised-roof-night.png`.

### Hátrébb helyezett lakóház és otthoni textilek
- A teljes lakóház, az esti fali fények, a verandai napló, az eladóláda és a magkatalógus 48 világponttal északabbra került. Az ajtó interakciója, a reggeli indulás, a belsőből való kilépés és az ösvény rövid bekötése együtt követi az elrendezést.
- Az előtető alsó éle az ajtó teteje fölött fut, a teljes ajtó látható. A csizmák a ház falánál, az ajtótól balra vannak, a lépcsőt szabadon hagyva.
- A kinti szőnyeg narancssárga, rojtos széllel. A benti szőnyeg élénkebb türkiz alapot, meleg szegélyt és szőtt mintát kapott.
- Az ágy mellé fiókos éjjeliszekrény és textilbúrás lámpa került. A lámpa alkonyatkor fokozatosan meleg fényt ad; az ablakból érkező nappali fénysáv ezzel párhuzamosan elhalványul, éjjel eltűnik.
- Az ágy továbbra sem ad mentési vagy napzárási lehetőséget. A régi mentésben az új éjjeliszekrény helyén álló játékos közvetlenül mellé kerül, a farm tartalma megmarad. Az ajtó és a napló közül az E a közelebbire hat.
- Ellenőrizhető képek: `farm-house-setback-orange-rug.png`, `farm-house-setback-night.png`, `home-colourful-rug-bedside-day.png`, `home-colourful-rug-bedside-night.png` a `docs/concepts` mappában.

### ESC-kezdőmenü, verandai igazítás és rajzolási terhelés
- Játék közben az ESC a kezdőmenüt nyitja, onnan újabb ESC a kiválasztott farmra tér vissza. Gyors második lenyomás esetén a mentés befejezése után záródik a menü; a lenyomva tartott billentyű nem villogtatja. Más megnyitott ablakban (pl. Készlet) továbbra is csak azt az ablakot zárja. Farm nélkül a kezdőképernyő megmarad, a névadás és a fejlesztési végpont védelme változatlan.
- A menü címe egyelőre „Kezdőmenü”; ez nem végleges játékcím. A „Farmválasztás” kiegészítés törölve a menügombból, a végpont visszatérő gombja is „kezdőmenü” megnevezést használ.
- A verandai napló kicsit jobbra és feljebb került, a veranda járófelületének közepe felé, az oszlop mellett szabad hellyel. Az ágyásokba lógó oldalsó kerítés és a hozzá tartozó gyűjtögetési kizárási sáv törölve.
- Az éjjeliszekrény a lámpával együtt 12 világponttal feljebb került. Az éjszakai fény és az ütközés követi, a régi mentésben érintett játékospozíció helyreállítása továbbra is működik.
- Teljesítmény: a farm statikus talaja és a falu rajza egyszer eltárolt képréteg; a kerti takarításkor és kapáláskor csak a változó réteg frissül. A boltok háttere is eltárolt kép. A nem látható benti helyszínek és bolti szereplők nem kerülnek rajzolásra. Az ismétlődő esőhang-beállítás csak állapotváltáskor ütemeződik, a célok második, képkockánkénti fölösleges frissítése kikerült.
- Azonos helyi Chromium-mérésben a medián képkockaidő 83,4 ms-ról 33,4 ms-ra, a 95. percentilis kb. 100 ms-ról 50 ms-ra csökkent; részletek: `docs/performance-rendering.json`. A mérés nem ígér azonos sebességet más hardveren.
- Képek: `farm-escape-start-menu.png`, `farm-journal-and-open-beds.png`, `home-bedside-raised-night.png`, `village-cached-square.png`, `cached-nursery-interior.png`, `cached-fishShop-interior.png` a `docs/concepts` mappában. Böngészőben ellenőrizve: ESC, gyors dupla ESC mentés alatt, ismétlés, szünetelő idő, Készlet bezárása, napló, takarítás/kapálás és visszatöltés, falu és mindkét bolt, éjjeli lámpa.

## Elfogadott bővítés: erdei mintavétel, 0-tól induló jártasság és tárolás

Ez a rész felülírja a korábbi szintszámozást. Sam 0. kertészkedési szintről indul. Az 1. szint 36 új pont után 4-4 eper-, mézbogyó- és áfonyaültetőanyagot és katalógusfeloldást ad; a 2. szint további 44 pont után 4-4 sárgarépa-, saláta- és hagymamagot, valamint katalógusfeloldást. A 3. szint további 52 pontnál (összesen 132) a tárolóláda tervrajza. A későbbi 4. szinthez 60 új pont tartozik majd; jutalma még nincs meghatározva, ezért nincs megnyitva. A maximumon nem gyűlik pont. A régi jutalmak és készletek megmaradnak; a korábbi 72 pontos maximum az új 2. szint elejére (80 összpont, 0/52) kerül, többletpont nélkül.

A hátizsák 16 rekeszes, halmonként 99 darabbal; az eszközök és történeti kulcs/minta/tervrajz külön vannak. A régi túlméretes készletet nem töröljük: új rekeszt csak helyfelszabadítás után lehet elfoglalni. A szintjutalom helyhiány miatt át nem vett része külön megmarad, a Készletből később átvehető. A betakarítás, vásárlás és gyűjtés mentés előtt ellenőrzi a helyet. Tárgyak földre dobása nincs.

A láda 24 rekeszes, 99 darabos halmokkal, 20 fa és 5 ócskavas árán elkészíthető a házban vagy a műhelyben. A Készletben elkészített láda közeli szabad helyre kattintva tehető a farmon vagy a házban. E/buborék megnyitja; kattintás teljes halmot, Shift+kattintás egy darabot mozgat. Csak üresen vehető fel és helyezhető át. Több láda készíthető. Az eladóláda ettől külön marad.

Az erdő balra bővül: napos, köves gyógynövényes erdőszél; kopott pihenőpad; patak és pallóhíd; domboldalak közti szűk átjáró; árnyas fészkes fatörzs. Vadkakukkfű, lándzsás útifű és csalán gyűjthető, 3 napos újraszedhetőséggel, 4 gold/darab árral. Az erdőszéli pihenőnél egy lehullott ágból Sam túrabotot igazít magának.

Az átjárót indagubanc, a belső részt két spórapamacs védi. Ezek fiktív ellenfelek; jelenlétük nem bizonyítja a méheket érintő gombafertőzést. F/kattintás botütés, Space ugrással kitérés. Sam 5 életerővel indul, találatonként 1-et veszít; a jelzett támadásokat ki lehet kerülni. Vereségnél hazakerül, tárgy- és aranyveszteség nélkül. Az ellenfelek legyőzése megmarad; az átjáró nem zárul vissza. A farmon nincs harc.

A harc után az elhagyott fatörzs felnyílt fészekjáratából mintát vehetünk. Az ép, sárral lezárt járatokat nem bolygatjuk. A javított műhely munkapadján Sam saját mikroszkópja jelenik meg. A fókusz interaktívan állítható; Sam gombafonalakat lát, de sem a fajt, sem az oksági kapcsolatot nem állapítja meg. A megvizsgált minta levéllel a postaládából elküldhető a korábbi laboros kollégának. A történeti szakasz a küldésig tart; a válasz és a kivonatos kísérlet későbbi folytatás.

A menü neve Főmenü, a két magyarázó bekezdés kikerül. A melléképület két oldalán álló rövid kerítések megszűnnek, a visszanövés sem kezeli őket foglalt helynek.

### Megjelenési pontosítások

A tárolóláda receptje és az Elkészítem/Elhelyezem művelet külön Tervrajzok fülön szerepel. A recept két adata: 24 rekesz; 20 fa + 5 ócskavas. Elkészítése nincs helyszínhez kötve. A 3. szint jutalmánál is hullanak cseresznyevirágszirmok. A Készlet kártyáin csak tárgynevek vannak, ár és magyarázó típusmegjelölés nélkül; a mennyiségek külön jelvények. A fészekminta saját, üreges fatörzset idéző ikont kap. Az életerő a bal felső részen jelenik meg, a közeli ellenfél neve a külön alsó állapotsorban olvasható. A falu és az erdő egyetlen, közös talajréteget és azonos farajzolást használ, összekötött ösvénnyel. A patak íves medret, kavicsos partot és vízcsillanásokat kap; a fészkes fatörzs kérget, évgyűrűket és lezárt/nyitott fészekjáratokat.

A vizsgálati eredmény „Vajon ezek okozták a bajt…” kezdetű, a „De” nélkül. A levél címzettje Noah, Sam fiatal, szőke, jóképű korábbi laboros kollégája. A postaládánál a címke: „KORÁBBI KOLLÉGÁMNAK, NOAH-NAK”. A minta elküldése után Noah portréval megjelenik az Ismerősök között; ezt a meglévő elküldési állapot jelzi, így a korábbi mentésekben elküldött levél is feloldja. A túl homályos mikroszkópképnél a Megvizsgálom gomb inaktív marad.

A mikroszkópos eredmény utolsó mondata: „Elküldök egy mintát a korábbi kollégámnak, Noah-nak.”

### Erdei átjárók, ismétlődő harc és tárolóláda – pontosítás

A láda az épületek közelében és az ösvények mellett is elhelyezhető; a korábbi nagy távolsági védősávok helyett a tényleges tárgyalaprajz, az ajtók, a veranda oszlopai, a növények és a víz maradnak védettek. A tároló mindkét oldalán egyforma kártyák vannak, minden tétel saját ikonnal, tárgynévvel és külön mennyiséggel.

Az erdő északi háttere a farm bal szélén túl is részletes, a pályán használt talajt és fákat folytatja. A harci átjárókat sűrű fák és bozót szegélyezik. Két indagubanc és két spórapamacs van. A belső átjáró csak az adott látogatás mind a négy ellenfelének legyőzése után járható; élő ellenfelek mellett gyalog és ugrással sem kerülhető meg. Az első túrabot felvételekor névvel és animált képpel mutatjuk be mindkét ellenféltípust. A korábban már túrabotot szerzett játékos a következő veszélyes megközelítésnél kapja meg egyszer ezt a bemutatót, ha a történeti mintát még nem szerezte meg. A botnak saját, megszerzés után látható és kijelölhető gombja van az alsó eszközsávban.

Az indagubanc tüskéket, sötétebb összefonódott testet, figyelő szemeket és mozgó/csapó indákat kap; a spórapamacs rétegzett, bolyhos testet, fonalakat és mozgó spóraport. A bot melletti tárgy egy régi pihenőpad: most háttámlával, ülőlappal, támaszokkal és lábakkal, valamint saját megnevezéssel jelenik meg.

Az erdő elhagyása és a visszatérés új harci látogatást kezd: mind a négy ellenfél ismét megjelenik. A folyamatban lévő látogatás legyőzött ellenfeleit a mentés külön tárolja, így puszta újratöltéskor nem térnek vissza. A történeti első legyőzések, a fészekminta, a vizsgálat és Noah levele nem nullázódnak. A régi, három ellenféllel már teljesített mintavételt változatlanul teljesítettnek őrizzük meg; az új belső ellenfél ehhez nem von vissza előrehaladást.

### A korai erdei felfedezés történeti korlátja

Az erdő, a túrabot, a harc és a gyűjtögetés a kivonatkészítő javítása előtt is elérhető. A fatörzsnél ekkor kizárólag ez a szöveg jelenik meg: „Apró, sárral lezárt járatok… Faliméhek fészkelhetnek itt. Néhány járat már felnyílt. Az épeket inkább békén hagyom.” Mintavételi gomb nincs, és az összes ellenfél legyőzése sem oldja fel a mintavételt a gép megjavítása előtt. A javítás után a szokásos harci feltételekkel lehet mintát venni. A korábbi mentésekben már megszerzett mintát és elvégzett vizsgálatot megőrizzük.

A gépjavítás utáni gondolat és cél változatlan marad: „Talán az erdőben találok valami hasznosat, amivel elkezdhetem a kísérletezést.” és „Nézz körül az erdő mélyén”. Korábbi fatörzsfelfedezés alapján sem jelenik meg külön, a megoldás helyére utaló gondolat. A célokat nem egészítjük ki a teljesítésük módját szájbarágósan eláruló lépésekkel.

### Déli birtokhatár

A teljes déli farmhatáron meleg árnyalatú, sötétbarna, erős fakerítés húzódik, vastag oszlopokkal, két vaskos vízszintes gerendával és átlós merevítésekkel. A faluba vezető ösvénynél megmarad a kapunyílás. A régi rövid, a birtok belsejében maradt kerítésdarabok és kapuoszlopok megszűnnek. A kapunyílás rajza és átjárhatósága közös elrendezési adatot használ.


### A mikroszkóp megőrzése és szabad vizsgálódás

A mikroszkóp kilépőgombja Vissza. Az első vizsgálat és a Noah-nak küldött levél után is használható: Sam megőrzi a minta egy részét. A korábbi történeti eredmény és levél szövege nem változik. A tárgylemez húzással vagy nyílbillentyűkkel mozgatható; 40×, 100× és 400× nagyítás választható, nagyításváltáskor újrafókuszálással. A homályos részletből nem rögzíthető megfigyelés.

A felismerhető részletek külön Megfigyelések fülre kerülnek, ismételt pont- vagy jutalomszerzés nélkül. A Felvételek fülön a tényleges látómező menthető és törölhető; a kép megnyitása ugyanazt a tárgylemezhelyzetet, fókuszt és nagyítást állítja vissza. A vizsgálati állapot, a gyűjtemény és a felvételek farmonként mentődnek, a régi mentések változatlanul betölthetők.

A fészekminta mellett a begyűjtött vadkakukkfű, lándzsás útifű és csalán levélmintája, a kivirágzott vadvirágok pollenje és a tóparton vett vízminta is vizsgálható. Az előkészített tárgylemezek megmaradnak; nem foglalnak új készletrekeszt. A különféle növényi és tóvízi részletek nem bizonyítanak betegséget vagy kapcsolatot a méhek megfogyatkozásával.

### Történeti változat vége és folytatható farm (a korábbi napkorlát helyett)

A változat végét többé nem a 15. nap lezárása jelzi. A jelenlegi történeti mérföldkő a minta és a levél elküldése Noah-nak. Ez után, az elküldés visszajelzésének bezárásakor egyszer megjelenik a már elfogadott ablak, változatlan szöveggel:

**FOLYTATÁS KÖVETKEZIK**

**Itt tart most a történet.**

Elérted a játék jelenlegi változatának végét. A történet egy későbbi frissítésben folytatódik, de addig is szabadon gondozhatod a farmodat. Köszönöm, hogy játszottál! 🙂

A korábbi Vissza a főmenübe gomb helyén **Tovább játszom** szerepel; bezárja az ablakot, és ugyanazon a farmon folytatható a játék. A nyugtázás farmonként mentődik. Korábban már elküldött mintával rendelkező mentésnél egyszer ugyanígy megjelenik az értesítés. Az üzenet szövegét a folytatható játékmenet ellenére sem írjuk át. A nyári tartalom nincs megnyitva: a kijelzett naptár legfeljebb Tavasz 15., miközben a belső napok, növekedés, visszanövés, szállítás és tóélet továbbhaladnak. A Teszt farm az Erdőszéli birtokhoz hasonló tesztmentés, kijelzett naptára Tavasz 15.; a mentést nem indítjuk újra és a tárgyait nem módosítjuk.

### Látható, tiszta falusi ösvények

A farmkapunál az ösvény egyenes folytatással csatlakozik, egymásra rajzolt lekerekített végződések nélkül. A falusi és erdőszéli dekorfák teljes lombkoronája is elkerüli az ösvények felszínét. A rajz és a törzsütközés azonos, megtartott fahelyeket használ. Az erdei áfonyabokor is az út mellé kerül, a szedési állapota és azonosítója megmarad.

### Erdei sűrűség és apró visszajelzések

A vízminta sikeres megőrzése után a mintavételi gomb helyén egyszerű státuszszöveg jelenik meg: „A tóvízminta megőrizve”, gombkeret és gombműködés nélkül. A farm alatti erdős sáv és az erdei mellékút ismét sűrűbb: a fák lombjának alakjához igazított távolság és a közeli szabad helyre áthelyezett fák szegélyezik a tisztán látható ösvényt. A Falu feliratú fa irányjelző lefelé mutat.

### Hangulatosabb falu és erdőbejárat

A funkció nélküli falusi kis épület megszűnik, az ütközése is; helyét virágos faluszéli kertrész veszi át. A Faiskola virágos ablakokat, falra futó növényzetet, palántatálcát és öntözőkancsót kap. A Kertitó Szaküzlet kirakatában vízinövények és halsziluettek látszanak; mellette virág és apró függődísz van. A tér szellős marad, nappal három kis madár ugrál/repül a szökőkút körül, esőben és éjszaka nem jelennek meg. A lámpák és a boltok ablakai este meleg fényt adnak. A szökőkút vízgyűrűi megmaradnak.

Az erdei bejárat nyugati folytatása az ösvény két oldalán sűrűbb fákat kap, így befelé nem egy nagy tisztás következik. A gyűjthető növényeket és a gyalogos ösvényt szabadon hagyjuk. A Falu jelzőtáblája keskeny, hosszúkás deszkanyíl, lefelé fordítva.

### A birtokon található fa és kő megjelenése

A faanyagok között leszakadt, leveles ágak, kis rönkrakások és korhadt kerítésből származó, szögnyomos deszkamaradványok jelennek meg. A kövek változó méretű, talajba süllyedő, mohás kőcsoportok. A szerszámigény, a nyersanyaghozam és a háromnapos megújulás nem változik. A meglévő mentések tárgyazonosítói és begyűjtési állapotai megmaradnak.

### Evés és életerő

A Készletben az eper, a mézbogyó és az áfonya Eszem gombbal fogyasztható. Egy darab fogy, és egy szívet tölt vissza, legfeljebb ötig. Tele életerőnél az Eszem gomb nem jelenik meg; sérülés után újra látható. Nem fogy el étel tele életerőnél. Evés után Sam 1,2 másodpercre megáll, nem ugrik és nem támad; a harc és az idő továbbhalad, tehát biztonságos pillanatot érdemes választani. A visszatöltést egy rövid, felfelé úszó szívjelzés mutatja. Az életerő a mentés része; az erdő elhagyása és újratöltés nem gyógyít automatikusan. Az alvás teljesen feltölti. A régi, életerőmező nélküli mentés öt szívvel indul. Vereségnél továbbra is biztonságosan hazakerül, tárgy- és aranyveszteség nélkül.

### Ismerősök megjelenése és Noah foglalkozása

Noah leírása pontosan: „Biológus, Sam korábbi munkatársa a laborból.” Leo arca teljesen új rajz: barna haj, rendezett szakáll, formált állkapocs, kifejező szemek és látható, barátságos mosoly. Annie hosszú, szőke hajat kap, a kalapja megmarad. A bolti figurák és a portrék ugyanabból a rajzból készülnek. Sam megjelenése változatlan.

### Kertészkedés: biztos érettségjelzés és szimmetrikus ládák

A talaj, a növények és a pipák külön rajzolási lépést kapnak, ebben a sorrendben. Minden szüretelhető növény felett megjelenik a pipa, újratermő növényen is; később kirajzolt talaj vagy növény nem takarja el. A mentett ültetés sorrendjétől független a megjelenés.

A három láda oldalkerete a meglévő, 3 × 2 darab 16-os ültetőrácsot szimmetrikusan keretezi; megszűnik a jobb oldali, használhatatlan földsáv. Az ültetőhelyek koordinátái és a mentett növények megmaradnak. Az eper saját piros termésformát, a mézbogyó hosszúkás kék termést, az áfonya gömbölyű, csillagos végű bogyót kap. A sárgarépa levelei finoman elágaznak; a burgonyán apró, világos virágok is látszanak. Nagyobb ültetőhely és új, folyamatos egérkezelés egyelőre javaslat, nem elfogadott követelmény.

### A Falu nyíl dőlése és látható esti fények

A keskeny, hosszúkás Falu nyíl deszkája és felirata enyhén, körülbelül 17 fokkal az ösvény folytatása felé dől; a tartóoszlop függőleges marad. Az Erdei ösvény táblája változatlan.

A falu utcai lámpái erősebb, meleg fényudvart és a talajon látható fényfoltot kapnak. A két bolt ablakai este aranyló fényt adnak. A fények az éjszakai kék árnyékolás fölött, a kezelőfelület alatt jelennek meg, kamerahelyzethez és nagyításhoz igazítva. Nappal eltűnnek, szürkületkor fokozatosan erősödnek. A fényréteg a játékterület szélén levágódik, és nem fogja el a kattintásokat.

### Nagyobb kertészkedés és egységes ösvények – véglegesített pontosítás

Az ültetőhely mérete 16-ról 24 egységre nő, a növényrajzok másfélszeres méretben jelennek meg. A három láda továbbra is 3 × 2 helyet ad, nagyobb, szimmetrikus kerettel. A szabad földön is 24-es a rács. A 18-as mentésformátum a régi rács növényeit külön-külön áthelyezi a nagyobb rácsra: terményt, nedvességet, növekedést, újratermést, vadvirágokat, magokat, aranyat és küldetésállapotot megőriz. Ha két korábbi szabadföldi hely ugyanarra az új cellára esne, a legközelebbi érvényes szabad helyet keressük; nem vonunk össze és nem dobunk el növényt. A biztonsági mentés eredetije a sikeres új mentésig megmarad.

Szüretkor Sam lehajol, nyúl és visszahúzó mozdulatot tesz; felúszó, felismerhető terményikon és +1 jelzés jelenik meg, rövid, halk hanggal. A kézi gyűjtögetés és helyreállítás is lehajló, keresgélő mozdulatot kap. Az érettségjelzők továbbra is minden növény után rajzolódnak.

A falusi és erdei utak egyetlen hálózatként készülnek, minden külső szegélyük előbb, minden belső rétegük utána. Az erdei elágazásba nem rajzolódhat külön körvonal vagy végződés. Ez az AGENTS.md kötelező szabálya is. A Falu nyíl az ösvény délkeleti folytatásának irányába mutat, a hosszú deszkával együtt forgatott, jól olvasható felirattal; az oszlopa függőleges.

### A gyűjtögetés reformja – az új szabály felülírja a korábbi fa/kő visszanövést

A farm faanyag- és kőrakásai tartós helyreállítási helyek. Három közeli, kézi munkafázis után a faanyag 6 fát és 2 ócskavasat, a kőrakás 6 követ ad. A félbehagyott munka mentődik, a jutalom csak a harmadik fázisban jár, egyszer. A kész hely végleg megtisztul. A régi szögnyomos kerítésmaradványok, farakások és földbe süllyedt kőcsoportok jól felismerhető rajzot kapnak. E betűvel is dolgozhatunk rajtuk, nem kell szerszámot váltogatva csapkodni.

Az udvaron szétszórt ócskavashalmok megszűnnek; a régi begyűjtési állapot és a már birtokolt ócskavas megmarad, az utánpótlás a faanyag bontásából jön. A rézcsőhöz tartozó egyedi régi szivattyú megmarad. A gyűjtött ócskavas nem jelenik meg újra külön kupacban.

További 12 állandó faanyaghely és 6 kőrakás biztosítja, hogy már korábban kitakarított mentésben is elérhető legyen a géphez és egy tárolóládához szükséges alapanyag: 72 fa, 24 ócskavas és 36 kő. A gép költsége változatlanul 35 fa, 30 kő, 18 ócskavas, rézcső, üvegedény és lenszövet; a láda 20 fa és 5 ócskavas.

Az erdei utánpótlás hat lehullottág-helyen és hat patakparti kavicsos helyen gyűjthető, kézzel, alkalmanként 1 fával vagy 1 kővel. A kövek három nap után szedhetők újra; ágaknál legalább három nap és közben esős vagy szeles/felhős nap szükséges. A meglévő három időjárásállapot megmarad. A természetes ágak nem adnak ócskavasat. A begyűjtési dátumok mentődnek. A tárgyak körül a lombkoronák nem takarhatják el a talajt és a felszedhető mintát. A farm gaznövényei továbbra is három nap után újulnak meg.

### Kilépőgombok és magkatalógus

A játékba visszatérő gomb neve Vissza vagy Vissza a játékba, soha nem Folytatás. Ez az AGENTS.md-ben is rögzített szabály. A Magkatalógusban a Vissza csak bezár; a még el nem küldött mennyiségek az adott játékfolyamatban megmaradnak az újbóli megnyitásig. A Megrendelem hajtja végre és fizeti ki a rendelést; sikeres rendelés után ürül a választás, sikertelen mentésnél megmarad.

### Egységes gyűjtés, hátizsák és újrahasznosítható roncsok

A Szedés és a Kéz egyetlen **Gyűjtés** művelet (6). A terménynél szüretelő, gaznál kézi, patakparti kőnél keresgélő animáció marad. A Fejsze és Csákány helyett **Bontóvas** (8) használatos: kampós fémszerszám, felső suhintással és rövid kifeszítő mozdulattal. A madárodú ezzel vehető vissza. A régi billentyűk aliasai kompatibilisek, külön menüpontjuk nincs.

Az előző helyreállítási szabály helyett a farmon három állandó, nagyobb, felismerhető roncs ad alapanyagot: fa rakfelületű kerti járgány, felborult utánfutó deszkákkal és téglákkal, összeroskadt munkapad szerszámmaradványokkal. Mindegyiknek hat bontható része van, részenként három suhintással. Négy rész egyenként 6 fát és 2 ócskavasat, kettő egyenként 6 követ ad: roncsonként 24 fa, 12 kő, 8 ócskavas, összesen 72 fa, 36 kő, 24 ócskavas. A váz marad, a teljes begyűjtés után három eltelt játéknap múlva újra bontásra kész. A részmunka, megújulás és hely mentődik. A régi külön fa-, kő- és ócskavaspontok nem gyűjthetők; a korábbi mentések anyagai megmaradnak. A gaz továbbra is visszanő. A patakparti kövek Gyűjtéssel, háromnaponta szedhetők; a különálló erdei faanyagpontok megszűnnek.

A Készlet egyetlen kompakt rekeszrács, látható üres helyekkel és szabad/foglalt darabszámmal. Egy halom legfeljebb 99 darab; a 16 rekesz ezért ténylegesen 16 halmot jelent. Az alap eszközök és helyet nem foglaló küldetéstárgyak külön, egyértelmű feliratú sorban látszanak. A tárgykártyákon név és külön mennyiségjelvény szerepel. A postaláda átadáskor feltölti a meglévő és szabad rekeszeket, a többi mag a postaládában marad. A tervrajz saját fülén látszik a birtokolt/szükséges fa és ócskavas, külön a hiányzó mennyiség; elégtelen anyagnál az Elkészítem inaktív.

### Az ültetőhelyek méretének finomítása

A korábban másfélszeresre növelt ültetőhelyek és növények rajzolt mérete további 10%-kal kisebb, középre igazítva. A kijelölési rács és a kattintható terület marad, így a meglévő mentések növényeit nem kell áthelyezni, és a célzás kényelmes marad. A ládák továbbra is hat ültetőhelyet tartalmaznak. A betakaríthatósági pipák nem kicsinyednek.


### Készletkártyák és tömör felületszövegek

A készletkártyák nagyobb ikont és arányosan, középre rendezett nevet kapnak. Az alsó műveleti hely csak akkor fenntartott, ha valóban van gomb a kártyán. A külön sor felirata „Eszközök és küldetéstárgyak”. A Gyűjtés ikonja a kosár a menüsorban és a készletben is. A szerszámnevek átnevezése egyelőre javaslat.

A Tervrajzok fülön nincs külön hiányt vagy minden alapanyag meglétét közlő mondat. A birtokolt/szükséges darabszám és az Elkészítem gomb állapota jelzi a lehetőséget. Általános szabály: kerülendő minden szájbarágós, túlmagyarázó játékbeli szöveg, különösen a felületből már látható információ megismétlése. Ez az AGENTS.md-ben is rögzítve.

### Roncsok: négy rész, kisebb hozam és látható munkapont

Az előző hatrészes bontást felváltja négy rész, továbbra is részenként három csapással. Három rész egyenként 4 fát és 2 ócskavasat ad, egy rész 6 követ. Egy teljes roncs 12 fa, 6 ócskavas és 6 kő; a három együtt 36 fa, 18 ócskavas és 18 kő háromnaponta. Az újragyűjtés továbbra is a teljes bontás befejezésétől számított három eltelt játéknap után indul. A korábban szerzett alapanyagokat nem vonjuk vissza; a régi részmunka arányosan négy részre igazodik, a csapásszám megmarad, a régi teljes bontás megújulási dátuma változatlan.

A roncsok megjelenése 18%-kal nagyobb. Mind a hat korábbi külön rajzolt darab megmarad; csak négy bontható, két darab a váz részeként állandó dekoráció. A soron következő részt finom körvonal jelzi. A három csík ehhez a részhez tartozik, külön előtéri rétegen, a karakter fejét és testét kerülő elhelyezéssel. Minden harmadik csapás találati pillanatában nyersanyagikonok és +4/+2, illetve +6 jelzések úsznak fel. Rövid leválási animáció után eltűnik a bontott darab és a következő rész kap kiemelést. A mentés a találati animáció előtt biztosítja a jutalmat; sikertelen mentésnél nem jelenik meg jutalomjelzés.

### Falusi műhelybolt és kézművesség

A falutér déli részén Műhelybolt nyílik, már az első játéknaptól. Éjszaka ez is zárva, a benti játékost záráskor kikíséri. A bejárat bekötött ösvényt, a homlokzat esti ablak- és lámpafényt kap. Belseje fa pult, szerszámfal, tervrajzok, kosarak, alkatrészek és munkapadok köré épül. Az eladó neve **Simon**; elfogadott külseje negyvenes férfi, erős alkat, kissé szögletes, barátságos arc, barna szem, enyhe borosta, rövid, kissé hullámos sötétbarna haj, néhány ősz halántékszál. Fakókék feltűrt ujjú inget, mogyoróbarna munkakötényt, sötétszürke nadrágot és kopott bakancsot visel, zsebében ceruzával és mérőléccel. A bolti karakter és az arckép ugyanabból a rajzból készül. Beszélgetés után az Ismerősök közé kerül. A bolt kínálata jelenleg tervrajzokból áll; további kész berendezések vagy külön megvásárolható alkatrészek még nincsenek elfogadva.

| Tervrajz | Ár | Elkészítés |
| --- | ---: | --- |
| Komposztáló | 200 gold | 20 fa, 4 ócskavas, 6 kő |
| Nádkosárkészítő | 420 gold | 24 fa, 6 ócskavas, 8 nád, 2 fogaskerék |
| Beporzó-fészkelőhely | 380 gold, későbbre | 16 fa, 12 nád, 4 agyag |
| Öntözőrendszer | 700 gold | 10 ócskavas, 8 kő, 2 rézcső, 2 fogaskerék |

A beporzó-fészkelőhely egyelőre **nem vásárolható és nem készíthető el**. Bolti leírása: „Simon jelenleg nem értékesíti ezt a tervrajzot a beporzók megfogyatkozása miatt.” A korábbi terméstöbblet-ötlet elvetve. Későbbi történeti irány lehet az első sikerélményként megjelenő beporzó, majd a gombásodás és spórapamacsok; ennek időzítése és pontos működése nincs elfogadva, most nem épül be.

A megvásárolt tervrajz megmarad a Tervrajzok fülön; a készítés a valós birtokolt/szükséges mennyiségeket és az Elkészítem gombot mutatja. A kész gép a hátizsákba kerül, onnan lehelyezhető. A mulcs és minden új fizikai alapanyag rekeszt foglal, a tárolóládába is betehető. A gépek és dekoratív nádkosarak bontóvassal visszavehetők; a dolgozó vagy át nem vett kimenetet tartalmazó gép nem bontható le.

**Komposztáló:** 10 gazból a következő reggelre 4 adag mulcs készül. Az eredmény a gépben vár átvételre, amíg el nem fér a hátizsákban. Egy mulcs egy már felásott ültetőhelyre kerül. Tartósan megmarad azon a földön, amíg a játékos vissza nem egyengeti. Öntözés napján, és az azt követő két napon nedves a föld: hétfői öntözés után kedden és szerdán sem kell öntözni, csütörtökön igen. Az eső is feltölti ezt a nedvességet; a termés a szokásos napi ütemben fejlődik.

**Öntözőrendszer:** a növénysorhoz igazodva helyezhető le. Minden reggel automatikusan, irányválasztás nélkül működik, balra és jobbra legfeljebb három-három közvetlen cellapozíciót ér el, kizárólag a vele egy vízszintes sorban lévő beültetett helyeket. Üres földet és szomszédos sort nem locsol; oda vízívet sem rajzol. Hat egymás melletti növény két végére tett öntözők befelé öntöznek. A víz íves sugarakkal, mozgó cseppekkel érkezik. A lehelyezéskor is elvégzi az első öntözést.

**Nádkosárkészítő:** 4 vágott nádból másnapra 1 nádkosár. A kosár 40 goldért eladható az eladóládán keresztül, vagy szabadon lerakható dekoráció. A megvásárolt nád a készletből levágható alapanyagnak; a tóban elhelyezett nád Gyűjtéssel szedhető fel vágott nádnak.

**Új nyersanyagok:** a járgány és a munkapad teljes bontása egyenként 1 fogaskereket ad, az utánfutóé 1 rézcsövet. A korábbi fa-, kő- és ócskavashozam változatlan. A háromnapos megújuláskor ezek a részek is újra gyűjthetők. A patakpart vöröses agyagfoltjai 2 agyagot adnak, háromnaponta szedhetők újra. Az agyag a fészkelőhely későbbi receptjéhez már összegyűjthető. A történet első, régi szivattyúból nyerhető rézcsöve is megmarad.

Simon első mondata pontosan: „Szia! Simon vagyok. Ha valami lötyög a birtokon, előbb nézd meg, javítható-e. Újat venni még mindig ráérsz.” A gyakorlatias, türelmes, finom humorú karakter mellett a visszafogott kézmozdulatok és pislogás adnak életet a bolti alaknak.

### Géphasználati hibák és egyértelmű inaktív állapotok

Mindkét patakparti agyagfolt egyenként **1 agyagot** ad; a háromnapos újraszedhetőség marad. A beporzó-fészkelőhely bolti sorában a megbeszélt **380 gold** áthúzott szövegként látszik, nem gombként, a korábban elfogadott leírás mellett.

A nem használható gombok egyértelműen szürkék, natív disabled állapottal. Az Üres láda felvétele tartalom esetén inaktív, és a művelet külön állapotellenőrzéssel sem hajtható végre. A láda tartalma így programozott vagy elavult kattintáskor sem veszhet el.

Az E-s gépinterakció mindig az ablakot nyitja meg: a kiválasztott bontóvas miatt sem veheti fel a gépet. Korábban ez okozhatta azt, hogy a játékos a komposztálót újra a hátizsákban találta. Felvétel csak külön Felveszem gombbal, vagy szándékos bontóvasas kattintással/F-művelettel történhet. Dolgozó vagy kész kimenetet tartalmazó gép továbbra sem vehető fel. A reggel és a kimenet átvétele nem változtatja meg a lehelyezett gép helyét.

A kézműves receptek és a nádkosárkészítő együtt számolják a vásárolt nádat és a korábban vágott nádat. Előbb a vágott készlet fogy, majd a szükséges maradék a vásároltból. Nem kell külön Levágom művelettel előkészíteni a vásárolt nádat. A kosárkészítő bemenete továbbra is összesen 4 nád.

A működő komposztáló gőzölgő, mozgó növényi tartalmat, a kosárkészítő mozgó szövőrészt és forgó hajtást kap a farmon. Az ablakban ugyanezeket animált gépillusztráció, forgó alkatrész, gőz és a kész kimenet jelzi. Az animációk nem hamis időmérők; az eredmény továbbra is másnap készül el. Csökkentett mozgás mellett az animációk leállnak.

A műhelybolt belső átalakítása és a tóba ültetett nád megújulása még egyeztetés alatt. Javaslat, nem végleges szabály: megmaradó nádtő, háromnaponta 1 levágható nád és idővel látható új hajtások. A belső tervezett munkasarkai: satu/forgács/javítás alatt álló tárgy; kosaras-zsineges-alkatrészes polcok; felismerhető szerszámfal és tervlapok; melegebb fények és kopott padló, szabad bejárattal és oldalról megközelíthető pulttal. A megbeszélés előtt a bolt belsejét nem alakítjuk át.

### A nád két szerepe, megmaradó tövek és a műhely berendezése

Ez a döntés felülírja az összevont nádfelhasználást: a vásárolható és elültethető tárgy neve **Nád**, az elkészítéshez használt alapanyagé **Vágott nád**. A „nádtő”, „gyökeres nád” és „ültethető nád” nem kerül a tárgy nevébe. A receptek és a kosárkészítő kizárólag vágott nádat fogadnak el.

A Nád készletkártyája két lehetőséget kínál: **Elhelyezem** a tóba, vagy **Levágom**, ami egy megvásárolt nádból egy vágott nádat készít. Így azonnali vásárlásból is elkészíthető a kosár; a levágás külön, tudatos döntés marad. Az alapanyagköltséget a gép nem vonhatja le automatikusan az ültetésre való nádból.

A tóba telepített nád töve megmarad. Az ültetéstől három eltelt játéknap után egyszer 1 vágott nádat ad, majd az utolsó vágástól számított három nap után ismét vágható. Ültetés az 1. napon: első vágás a 4. napon, újabb a 7. napon. Vágáskor a növény nem tűnik el: rövidebb szárak maradnak, amelyek újranőnek. Az idősebb foltokon több fiatal hajtás látszik. A vágható nád ugyanazt az érettségjelzőt kapja, mint a többi begyűjthető növény. A betakarítás időpontja mentődik; újratöltés nem ad ismételt aznapi vágást.

Simon boltjába bekerül a megbeszélt teljes belső kialakítás: kopott, erezett és karcolt deszkapadló; visszafogott terrakotta mintás, rojtos szőnyeg; enyhén foltos vakolat és gerendák; ablakon beeső meleg fény; növény és asztali munkalámpa. Bal oldalt satu, mérőléc, fakalapács, alkatrész és faforgács van a munkapadnál, alatta egy javítás alatt álló kocsikerék. Jobb oldalt eltérő magasságú kosarak, rézidomok, zsinegtekercsek, hajtogatott szövet, fiókok és kis szerszámos láda kerül a polcokra. A szerszámfalon külön felismerhető kézifúró, kalapács, fűrész, derékszög és fogó, mellette egy öntözővázlat és feltekert rajzlapok látszanak. A bejárat, a pulthoz vezető folyosó és Simon bal oldali beszélgetőhelye szabad marad; az eredeti ütközési területeken belül maradnak a berendezések.

### Öt eszköz az alsó sorban; kosár felvétele

Az alsó sorban kizárólag **Kapa (1), Öntözés (2), Gyűjtés (3), Bontóvas (4), Túrabot (5)** szerepel. A túrabot megszerzéséig négy eszköz látható. Mag, vadvirágmag, mulcs és lehelyezhető tárgy nem kerülhet ide. Ezeket a Készletből lehet kiválasztani, utána a játékban a szokásos művelettel használni. Az ültetőanyagok számát a készletrekeszek jelvényei mutatják. A korábbi 6–9-es szerszámgyorsbillentyűk megmaradnak kompatibilis aliasnak, magot nem választanak.

A lehelyezett dekoratív nádkosár saját ablakában is megjelenik a **Felveszem** gomb. Ez egyszer adja vissza a kosarat a készletbe; a bontóvasas célzott művelet is használható marad.

A Nád kártyáján az Elhelyezem és Levágom választás mindkét képernyőméreten olvasható marad: telefonon a két művelet egymás alatt jelenik meg.

### A postaláda részleges átvételének állapotfrissítése

Részleges magátvételkor a mentett és a játék közben használt rendelésállapot együtt frissül. A postaláda azonnal újrarajzolja a bent maradó mennyiségeket; az átvett magok kártyái eltűnnek, részben átvett fajtánál csak a maradék látszik. Ha semmi nem fér a hátizsákba, az átvételi gomb inaktív; üres postaládánál rejtett. Hely felszabadítása után, újratöltés nélkül is kizárólag a maradék vehető át. A még úton lévő rendeléseket az átvétel nem módosítja. A javítás a korábbi, helyes mentett állapotot is megőrzi, nem írja felül a régi képernyőkészlettel.

A műhelybolt vásárlóablakának elfogadott fejléce: **SIMON**, cím: **Műhelybolt**, bevezető szöveg pontosan: „A lentieknek a tervrajzát vásárolhatod meg.”

Az öntözők kétirányú használatához a szabad farmi rét az ágyások mellett is kapálható, a védett ösvények, épületek, víz és fakeretek kivételével. A ládák sorai a mellettük lévő réten folytathatók azonos 24-es osztással: az öntöző túloldalára ültetett három növény is ugyanabba a sorba kerül.

Az öntözőrendszer közelében E-vel vagy kattintással megnyíló ablakban legyen „Felveszem” gomb. Felvételkor a készletbe kerül, onnan az „Elhelyezem” művelettel áttehető másik helyre. A meglévő növények, mulcs és postaládacsomagok ettől nem változnak. A jobb oldali rét kijelölése folytassa az ültetőládák sorait távolabb is; ne váltson vissza elcsúszó rácsra. A korábban más rácson elültetett növények helye és célzása megmarad, az új földkockák nem fedhetik őket.

Gyűjtésnél a kijelölt gaz felszedése elsőbbséget kap a mögötte vagy előtte lévő roncs, berendezés és más farmi tárgy kezelésével szemben. A berendezések kattintható felülete nem nyelheti el a gazgyűjtést; a hatótávolság és a hátizsák ellenőrzése megmarad. A rácskijelölés a kocka sarkához közeli gazt is eléri. A sötét melléképületben mindkét zárt redőny alól látszódjon keskeny meleg fénysáv és finom beszűrődés, az alsó ablaknál a szoba belseje felé.

A gaz közvetlen kijelölése a roncsoknál bármely szokásos kézben lévő eszközzel elsőbbséget kap, nem csak a Gyűjtés kiválasztásakor. A bontóvas se indítson bontást a kijelölt gaz helyett, kimerült roncsnál sem. Ez egyezzen a roncsoktól távol lévő gazok működésével; az építési, kihelyezési és mulcsozási módok külön műveletei megmaradnak.

A napok kijelzett számozása nem áll meg 15-nél: a játék HUD-ja, a Folytatás gomb és a mentett farmok listája a tényleges, folyamatos napszámot mutassa. Ez az Erdőszéli birtokra és a Teszt farmra is érvényes. Az évszak jelenleg továbbra is Tavasz; a kijelzett napok növelése önmagában nem vezeti be a kidolgozatlan nyári tartalmakat. A meglévő mentés belső napszáma megmarad, nincs újraszámolás vagy újrakezdés.


A használati statisztika bevezetését egyelőre elvetettük. Nincs beépített vagy bekapcsolt analitikai mérés.

## A mikroszkóp előkerülése és a Műhely neve

A kivonatkészítő javítása után a mikroszkóp még nem jelenik meg. A fészekminta begyűjtésekor változatlanul a „Vizsgáld meg a fészeknél talált mintát” cél következik; a játékos szabadon folytathatja az erdei kalandot. Az első farmra visszaérkezés indítja el a rövid jelenetet. Áttűnéssel Sam hálószobájába kerülünk: a meglévő bőröndjében keresgél, három ruhadarabot dob maga mögé, majd óvatosan előveszi régi mikroszkópját. Újabb áttűnés után a Műhelyben a jelenlegi munkapadra helyezi. Nem sétál végig a helyszínek között. Ezután visszakapjuk az irányítást, a vizsgálatot a játékos indítja. A jelenet idejére megáll a játékidő, a ruhák a hálószobában maradnak. Csökkentett animációt kérő böngészőbeállításnál rövidebb, visszafogott mozdulatok láthatók.

A jelenet függőben lévő és kész állapota mentődik, megszakításkor a hálószobai jelenet újraindítható, az alapanyagok ismételt levonása nélkül. A korábban megjavított géphez már elhelyezett mikroszkópot tartalmazó régi mentések tovább használhatók, nem kényszerítjük rájuk utólag a jelenetet.

A lezárt melléképület az első tényleges belépéstől **Műhely** néven szerepel. A mentés ezt akkor is megjegyzi, ha még egyik redőny sincs felhúzva. Az aktuális helyszíncím, belépési jelzés, kulcs neve, párbeszédek és súgó ezt a nevet használja. A már teljesített első felfedezési cél címe történeti emlékként marad az eredeti; még folyamatban lévő változata az első belépés után már a Műhelyt nevezi meg.

A **Teszt farm** nevű mentés játék közbeni menüjében elérhető a **Fészekminta tesztje** gomb. A kivonatkészítő megjavítása után az Előkészítem művelet a fészek mellé helyez, nappalra állítja az órát, és az adott erdei látogatás harcait teljesítettnek jelöli. A mintát újra fel lehet venni, hazasétálva újra elindul a bőröndös jelenet. A fészekminta vizsgálati/elküldési állapota, hozzá tartozó mikroszkópos megfigyelései és képei visszaállnak, ezt indítás előtt jelezzük. Más minták megfigyelései megmaradnak. A pénz, készlet, kert, rendelések, napszám és egyéb farmi eredmények megmaradnak. Más nevű farmokhoz ez a tesztművelet nem érhető el.

## Beporzóhiány: terméskötődés és az élővilág megjelenése

Az eper, mézbogyó, áfonya és a gyümölcsfák terméskötődési ciklusainak körülbelül egyharmada sikeres. A sikeres ciklus az eddig megbeszélt teljes hozamot adja; a többi virágzás termés nélkül zárul. A bokor/fa életben marad, a következő ciklus újravetés nélkül indul. A sikeres kötődés a farm mentett magjából, a növény helyéből, fajtájából és mentett ciklusából következetesen számolódik, ezért az újratöltés nem sorsolja újra. Az öntözés továbbra is a növekedés feltétele a veteményesben, de nem garantálja a terméskötődést. A zöldségek, köztük az önbeporzó borsó hozamát ez nem csökkenti. A fák évszakhoz kötött termésideje megmarad.

A növényen érett gyümölcs három játéknapig szedhető: az érés napján és a következő két napon. Az utolsó napon kissé túlérik/aszalódik, de még leszedhető. A következő reggel lehullik, eltűnik az érési jel, majd új ciklus indul. A készletben, tárolóládában vagy eladóládában lévő termények nem romlanak ettől. A korábbi mentésben már érett gyümölcsöknél az új változat első betöltése indít teljes háromnapos leszedési ablakot; a korábbi érés idejét nem találgatjuk.

A bogyósok egészséges lombja megmarad az újratermés alatt is. A sikertelen terméskötődés üres virághelyekkel, elnyílt virágokkal és talajra hullott szirmokkal látszik; a sikeres bogyócsoportok ritkábbak. A túlérés és lehullás természetes folyamat, nem a növény gombás megbetegedésének állítása. A gyümölcsfáknál is elkülönül a virágzás, az üres terméshely és a tényleges termés.

Az erdei fészkes fatörzs nyitott járatainál finom szürkésfehér gombafonalak és helyileg tompább fakéreg látható. A közvetlen környéken ellenfényben porszerű részecskék úsznak, ritkább a rovarmozgás; a szomszédos tisztás eleven marad. Nem sötétedik el vagy színeződik át az egész erdő/farm. A gombafonalak továbbra sem bizonyítják önmagukban, hogy a gomba okozta a beporzók megfogyatkozását.

Amikor Sam először közel sétál valóban sikertelen terméskötődést mutató növényhez, egyszer megjelenik az **Üres terméshelyek** megfigyelés: „A levelek egészségesek, mégis sok virág elnyílt termés nélkül. Az öntözés önmagában nem elég… Talán túl kevés beporzó jár erre.” Ugyanez dátummal megmarad a verandán olvasható naplóban, a korábbi faliméh-megfigyelés mellett. Az észlelés mentődik, újratöltés nem ismétli meg. A pusztán leszedetlenül túlérő gyümölcs nem váltja ki ezt a beporzóhiányról szóló következtetést.


### Erdei áfonya és hullott gyümölcs — 2026. október 27.
- Az erdei áfonya érési ciklusa 3 nap; három ciklusból egy terem. Bokronként 1 áfonya szedhető, az érett bogyók 3 játéknap után egyszerűen eltűnnek, erdei hullott gyümölcs nem keletkezik. A ciklus állandó, a játék újratöltése nem sorsolja újra.
- A farmon túlérett bogyósok és gyümölcsfák lehullott termése Gyűjtéssel felszedhető, egységes „Hullott gyümölcs” alapanyag. A lehulló mennyiség a megmaradt termésnek felel meg; külön ikont és készlethelyet kap, tárolóládába tehető. Nem ehető és nem értékesíthető.
- A komposztálóban külön választható a gaz vagy a hullott gyümölcs: 10 darab hullott gyümölcsből másnapra 4 mulcs készül. A gaz meglévő receptje változatlan.

- A fészkes fatörzs természetes barna színű marad. A szürkés gombás bevonat csak a két felnyílt járat körül látható; onnan lassú cseppek hullanak a földre, helyi elszíneződést hagyva. A levegőben felszálló világos porszemcsék jól láthatók, a környező erdő színei változatlanok.
- A fatörzs közvetlen környezete is élettelenebb: szabálytalan fakó fűfoltok, száraz avar, talajon futó finom gombafonalak és apró világos gombatelepek. A hatás fokozatosan olvad az élő erdőbe, nem fed külön téglalapként a terepre, és nem színezi át a törzs barna kérgét. A közvetlen fészekkörnyéken nem látható lepke vagy szentjánosbogár, távolabb megmarad a rovarélet.


### Falusi közlemény és üres föld — 2026. október 27.
- A falutér délnyugati peremére álló, kétoszlopos, tetőléces hirdetőtábla került, a tér ívéhez illeszkedő enyhe perspektívával. E-vel és kattintással olvasható. A polgármesteri hivatal elfogadott „Közlemény a gyümölcstermésről” szövege innen bármikor újraolvasható; postaládás másolat nem készül.
- Az üres felkapált föld két teljes, vetés nélkül eltelt nap után visszaáll: hétfőn kapálva kedden és szerdán megmarad, csütörtök reggelre eltűnik. Öntözés és eső nem indítja újra ezt az időt; ültetés megszünteti az üresföld-számlálást. Egyszer termő növény leszedése után az üresen maradt helyre újra érvényes a szabály. A vadvirággal elfoglalt földet és a beültetett helyeket nem érinti. Régi mentésben korábban üresen álló földek a frissítéstől számítják ezt az időt.
- A palánták árai egyelőre változatlanok; az esetleges árcsökkentés még egyeztetés alatt áll.


### Gyümölcsárak és falusi közlemény — 2026. október 27.
- A játék kezdetétől az eper eladási ára 25 gold/db, a mézbogyóé 24 gold/db, az áfonyáé 21 gold/db. A vételárak változatlanok (20 / 25 / 45 gold). A meglévő mentésekben a még el nem számolt termést is az új árakon értékesítjük; a korábbi bevételeket nem számoljuk újra.
- A hirdetőtábla közleményében a „jelenleg nagyjából minden harmadik virágzási ciklusból várható gyümölcs.” mondat után ez szerepel: „A terméskiesés a gyümölcsök eladási értékét növeli.”
- Egy sikeresen termő eper-, mézbogyó- vagy áfonyanövény szüretenként 1 gyümölcsöt ad; a mennyiség változatlan.


### Névtelen erdei figyelmeztetés — 2026. október 27.
- A falusi hirdetőtáblán külön fehér papírra tűzött, névtelen figyelmeztetés is megnyitható. A gyümölcstermésről szóló hivatalos közlemény megmarad.
- Pontos szöveg: „AZ ERDŐBEN VESZÉLYES LÉNYEK JELENTEK MEG.” Alatta: „Megtámadják az embert. Ha meglátjátok őket, forduljatok vissza. Ne próbáljatok közelebb menni.”
- A szöveg ceruzás, kézírásszerű saját betűkészlettel készül; a papíron két sötét, nyugtalanító ceruzarajz látható. Nincsenek lénynevek, képaláírások vagy aláírás.
- Saját SVG-rajzok, helyben betöltődő, magyar ékezeteket tartalmazó Kerti Ceruza betűkészlet; nincs külső betűszolgáltatás vagy új játékfüggőség. Betűrajz forrása: `tools/draw-pencil-font.py`; eredet és licenc: `public/fonts/README.md`.


### Silent Pollen — mikroszkópos menüarculat (2026. október 28.)
- Elfogadott cím: **Silent Pollen**. A Főmenü és a játék közbeni Menü az elfogadott mikroszkópos koncepciót követi: olívazöld növényi sejtek, meleg aranyszínű optikai szegély, elegáns dőlt cím és botanikai vonaldísz, sötétzöld/arany keretes gombok.
- A háttér felirat nélküli, optimalizált WebP-réteg; a cím és az összes gomb valódi HTML-elem. Négy pollenszem, finom porszemcsék, három apró buborék és lassú fényváltozás animálódik; a középső terület olvasható marad. Csökkentett mozgás kérésénél az animációk állnak, bezárt menünél a háttér nem fut.
- Főmenü: Folytatás, Új játék, Beállítások; külön Mentett farmok nézet megnyitással és az eddigi megerősítéses törléssel. ESC játék közben továbbra is a Főmenüt nyitja, újra megnyomva folytatja az aktuális farmot.
- Menü: Vissza a játékba, Beállítások, Főmenü; a meglévő Készlet, Történet, Irányítás és tesztfarm-funkció megmarad. A Beállítások az előző menübe lép vissza, ESC-pel is.
- Halk, rövid Web Audio fapattanás a menügombokon, külön megjegyzett Menühangok be/ki beállítással. A meglévő zenék és a zene kikapcsolása megmaradnak. A hang nem igényel külső szolgáltatást vagy hangfájlt.
- A mentési formátum és a játékállapot változatlan. A névadási ablak is az új arculatot kapja, a jóváhagyott történetszöveg változatlan. Mobilon is használható.
- Grafika: a felhasználó által elfogadott, ebben a munkamenetben generált mikroszkópos koncepció felirat nélküli változata (`src/assets/microscope-menu.webp`); a mozgó szemcsék és a vonaldísz saját SVG-rajzok. Új futásidejű függőség nincs.


### Menü finomhangolása és készítői felirat — 2026. október 28.
- A játék közbeni **Menü kisebb, középre helyezett ablak**, mögötte az elsötétített, megállított farm látható. Az innen megnyitott Beállítások is ilyen ablak marad. A Főmenü, annak Beállításai, farmválasztása és névadása teljes képernyős.
- A cím és az alatta lévő növényi dísz a jóváhagyott mikroszkópos látványtervhez közelített, átlátszó, külön képréteget kapott (`src/assets/silent-pollen-logo.webp`), hogy ne a helyi rendszerbetűtípustól függjön. A régi CSS-betűs cím helyett ez látszik.
- Nagyobb, világos, finom szőrös/tüskés peremű pollenszerű alakzatok kerültek a lencsébe. A sodródás jól észrevehetőbb, de lassú marad; a méret és az áttetszőség finoman lüktet. A háttér sejtrétege lassan elmozdul és tágul/szűkül. A csökkentett mozgás és a háttérben álló menü továbbra is tiszteletben marad.
- A Főmenü és a Menü esetén a **képernyő legalján „2026 Harsányi Zsófia”** látható. A verziószám helye elő van készítve (`#menu-version`), de még nincs megjelenített verziószám; a verziózást később vezetjük be.
- Böngészős ellenőrzés: a Menü és a belőle megnyitott Beállítások nem teljes képernyősek; asztali és mobil nézet, ESC-visszalépés, ugrás/fókusz, meglévő mentés megnyitása, menüváltások és mozgáscsökkentés. Képkockák között külön ellenőrzött helyzet-, méret- és áttetszőség-változás. Animált előnézet: `docs/concepts/silent-pollen-menu-motion.gif`.


### Menü lábléce és tájékoztató ablakok — 2026. október 28.
- A „2026 Harsányi Zsófia” felirat a kisebb Menüben és annak Beállításaiban az **ablak aljára** kerül; a teljes képernyős Főmenüben továbbra is a képernyő alján marad. A verziószám továbbra sincs még kitöltve.
- Az Irányítás elavult, hosszú magyarázata helyett rövid vázlat szerepel: mozgás/futás/ugrás, a jelenlegi öt eszköz, kattintás/F/E, Készlet és ESC. Régi Kéz/Fejsze/Csákány gyorsbillentyűk, árak, küldetési útmutatók és elavult újratermési szövegek nem szerepelnek benne. Címe „Irányítás”, ismétlődő felső címke nincs.
- A Történet és az Irányítás kisebb ablakai a Menü sötétzöld felületét, aranyszegélyét, árnyékát, Trebuchet MS / Segoe UI betűcsaládját és Vissza gombját használják. A Történet elfogadott szövege változatlan, az ablak címe „Történet”; felső ismétlődő címke itt sincs.


### Egységes játékablakok és komposztáló — 2026. október 28.
- A hosszabb szövegek a Történetben és az Irányításban ismét **system-ui / sans-serif** betűcsaládot használnak. A menüpontok, fülek, műveleti gombok és ablakcímek maradnak Trebuchet MS / Segoe UI jellegűek; a Silent Pollen képi cím változatlan.
- A Menü sötétzöld felülete, meleg aranyszegélye, árnyéka, gombjai, inaktív állapotai és görgetősávja egységesen megjelenik a Postaládánál, Eladóládánál, Magkatalógusnál, farmi gépeknél (komposztáló, nádkosárkészítő, öntöző és lerakott kosár), tárolóládánál, a TAB-os Készlet összes fülén, a Naplónál, a hirdetőtáblánál és mindhárom bolt vásárlási ablakainál. Tartalom és működés megmarad. A névtelen figyelmeztetés külön fehér papíros, ceruzás arculata megmarad.
- A komposztáló indítás előtt két külön sort mutat: **Gaz** és **Hullott gyümölcs**, mindkettő saját ikonnal, birtokolt/szükséges mennyiséggel és ugyanabban a sorban egy **Elindítom** gombbal. Csak a kiválasztott sor alapanyagát használja fel; a másik készlete változatlan. 10 alapanyag → másnapra 4 mulcs, változatlanul. Feldolgozás és kész eredmény esetén az állapot/átvétel látszik, a felvétel korábbi feltételei megmaradnak. A nádkosárkészítő a soros, ikonos megjelenést szintén használja.
- Böngészőben külön ellenőrizve minden felsorolt ablak, minden Készlet-fül, a teli tárolóláda letiltott felvétele, mindkét komposztálási alapanyag egymástól független fogyása, a kosárkészítés és a fehér figyelmeztetés elkülönülése; a komposztáló mobilnézetben is.


### Közös ablak-alapstílus és Bontóvas-felvétel — 2026. október 28.
- Kötelező, részletes arculati szabályzat: `docs/ablakok-es-gombok.md`; az `AGENTS.md` erre hivatkozik. Az összes párbeszédablak és műveleti gomb közös alapstílusa a **`src/dialogue-theme.css`**, amely a korábbi stílusok után töltődik be. Így a boltok és beszélgetések Vissza gombja, a névtelen figyelmeztetés két gombja és a jövőbeli ablakok kerete is ugyanazt az alapot kapja. A fehér papír, kézírás, beszédbuborékok és egyéb egyedi tartalmak megmaradnak.
- A madárodú, a lehelyezett nádkosár, az öntöző, a komposztáló, a nádkosárkészítő, a tárolóláda és a későbbi mozgatható gépek felvétele egységes: **Bontóvas (4) + koppintás/kattintás**, illetve F az előttünk lévő tárgyon. A tárgy visszakerül a Készletbe, onnan Elhelyezem művelettel újra lerakható. E-vel továbbra is megnyitható/megvizsgálható; E nem veszi fel. Külön Felveszem és Üres láda felvétele gomb nincs. Az elkészült termék Átveszem gombja megmarad.
- Közös célpont- és felvételi kód: `src/placed-items.ts`; a jövőbeli mozgatható tárgyaknak is ezt kell használniuk. A teli tárolóláda, a dolgozó gép és az át nem vett kész termék blokkolja a felvételt. Teli hátizsák vagy sikertelen mentés esetén a tárgy a helyén marad. A felvétel nem kétszerezheti az eszközt.
- Az Irányítás ismerteti a Bontóvas bontási és áthelyezési szerepét.
- Ellenőrzés: 333 egységteszt; böngészőben felvétel és újra lehelyezés a gépekkel, kosárral, madárodúval és ládával; védett készletek és gépállapotok; házon belüli ládafelvétel; mindhárom bolt vásárlási és beszélgetési ablaka; mindkét névtelen figyelmeztetés-gomb az eredeti ceruzás szöveg megtartásával.


### Első számozott játékkiadás — 2026. október 28.
- Elfogadott első játékverzió: **0.1.0**. A Főmenüben és a Menüben is a készítő neve mellett látszik: `v0.1.0`. A felirat elhelyezése változatlan (Főmenü: képernyő alja; Menü: ablak alja).
- Egyetlen forrás a `package.json` már meglévő 0.1.0 mezője; a felület közvetlenül ebből kapja a számot. Változáslista: `CHANGELOG.md`; kiadási szabályzat: `docs/verziozas.md`; az első állapot Git-címkéje `v0.1.0`.
- Kisebb javítás 0.1.1, nagyobb tartalmi bővítés 0.2.0 jellegű lépés. Nem kell minden apró commit után új kiadás, és a korábbi fejlesztéseket nem számozzuk meg visszamenőleg. Az 1.0.0 külön közös döntés lesz.
- A farmmentés technikai verziója továbbra is 18, a korábbi mentések tartalmát a játékverzió bevezetése nem módosítja.

### Memóriában futó fejlesztői tesztmód — 2026. október 28.
- Menü → Fejlesztői eszközpanel → Fészekminta megszerzése. Bármely farmból indítható, nem névhez kötött.
- Belépés előtt a normál farm aktuális állapotát mentjük, majd külön másolatával tesztelünk. A mentési réteg tesztmódban nem ír IndexedDB-be; az automatikus mentés sem, a farmkönyvtár sem módosítható.
- A teszthelyzet előkészíti a megjavított Műhelyt, a fészek mellé helyezi Samet mintavétel előtt, hogy a hazatéréskor induló mikroszkópos jelenet ismét kipróbálható legyen. A korábbi fészekmegfigyelések csak a tesztmásolatból törlődnek.
- Állandó TESZTMÓD jelzés nyitja a panelt. Újraindítás mindig a belépéskori farm másolatából indul. Kilépés az eredeti, mentett állapothoz tér vissza; oldalfrissítés/bezárás eldobja a tesztet. A panel egyszerű bezárása nem léptet ki a tesztből.
- Ez nem külön Dev weboldal vagy kiadási ág, hanem ugyanazon játék elkülönített tesztüzemmódja. A mentésformátum változatlanul 18.

### Fejlesztői eszközök elrejtése — 2026. október 28.
- A Menü fejlesztői menüpontja csak a `?dev=1` URL-paraméterrel jelenik meg; ez kényelmi elrejtés, nem hozzáférés-védelem. Paraméter nélkül a panel megnyitása is tiltott.
- Ablakcím és menüpont: Fejlesztői eszközök. Alcím: Tesztmódok. Jelenetgomb: A mikroszkóp megtalálása – jelenet. Szöveg: „A teszt külön memóriában fut. A normál farmod megmarad.”
- A paraméter újratöltés és tesztből kilépés után is a hivatkozás része marad.

- A mikroszkópos jelenet tesztgombja alatti rövid leírás: „Indulás a fészekminta megszerzése előtt.”

### Verziószámozás pontosítása — 2026. október 28.
- A játék száma ismét 0.1.0; a fejlesztői funkciók megmaradnak. A jövőbeli emelés előtt kérdezni kell, és kizárólag kifejezett egyeztetés után nőhet a verziószám. Commit és közzététel változatlan számmal is készülhet.
- A fejlesztői jelenetgomb és leírása közös bal oldali igazítást kap.

### Hibabejelentés — 2026. október 28.
- GitHub Issues használatos. Menüben az Irányítás mellett, Főmenü alján visszafogott hivatkozásként jelenik meg a Hibabejelentés. Új böngészőlapon nyílik; nem küld automatikusan hibajegyet.
- A Description elején előre szerepel a „Mi történt?” és „Hogyan lehet előidézni?” címsor, üres helyekkel a játékos válaszának. A technikai blokk játékverziót, rövid Git-buildazonosítót, böngészőt és operációs rendszert tartalmaz. A címet, leírást és képet a játékos adja meg a GitHubon. Farmadat, mentés, játékidő nem kerül a hivatkozásba.
- Buildazonosító automatikusan a fordításkor használt Git-commitból (CI-ben GITHUB_SHA), a játékverzió változatlanul 0.1.0. Verzióemelés nincs.

- A Főmenü lencséjének háttérképe nem nagyítható animációval; a részecskék mozgása megmarad. A Hibabejelentés lábléchivatkozás nem változtathatja meg a háttér vagy a menü elrendezési méretét.

- A halakat a tópart közeléből a teljes vízfelületre dobhatjuk; célzásuk nem igazodik a kert rácsához. A tavi növények lehelyezési távolsága változatlan. Egy megvett vadkacsafészek után a vásárlási gomb inaktív, további fészekért nem vonható le arany. A Főmenü finom háttérmozgása visszatér, kizárólag eltolással, változó nagyítás nélkül.

- Pontosítás a Főmenü hullámzásához: a felhasználó az eredeti mozgás teljes visszaállítását kérte, az 1.008–1.025 közötti enyhe skálázással együtt. Ez felülírja a korábbi, állandó nagyítást előíró döntést.

### Noah küldeménye – erdei kísérlet, fejlesztői teszt — 2026. október 28.
- Kizárólag a `?dev=1` Fejlesztői eszközök memóriában futó tesztmódja; a normál játék története és mentése változatlan. A játékverzió marad 0.1.0, mentésformátum 18.
- Végleges sorrend: Noah levele és koncentrátuma → beszélgetés Simonnal és bolti botfejlesztés → a meglévő patakhídon át déli erdei út → harc és gyűjtés → hazatérve az első kivonat elkészítése és megfigyelése. Nincs erdei út előtti első keverék.
- Noah levelének aggasztó bekezdése a felhasználó eredeti szövege, változtatás nélkül: „A város környéki méhészetek közül többnél gombás fertőzést találtak a fiasításban. Nagy rajtunk a nyomás, hogy a hatóanyagot minél előbb biztosra fejlesszük, mert már egész méhcsaládok pusztultak ki, és a továbbterjedés felszámolásában néhányan a megmaradt családok elpusztítását gondolják helyesnek, ez azonban még nagyobb kárt okozna a természet egyensúlyában.”
- A koncentrátumot a laborban megfigyelt tárolási szétválás miatt csak friss, lehűlt hordozókeverékhez adjuk. Ez a történet kísérleti készítménye, nem valós recept. Noah négy adagot és a gyantás hordozó előkészítéséhez szükséges segédanyagot küld.
- A végleges új hozzávaló vörösfenyőgyanta. Nem fiktív növény/gomba és nem pecsétviaszgomba. Simon mondja el a déli erdei lelőhelyet; célként megjelenhet: „Kérdezd meg Simont a kötőanyagról.” Ez kifejezett felhasználói kérés, kivétel az általános, megoldást el nem áruló célokra vonatkozó szabály alól.
- Megerősített túrabot: **25 fa + 14 ócskavas + 310 gold**, Simonnál, a bolt kínálatában. Nincs lenszövetköltség; a markolat anyagát a munkadíj tartalmazza. A bot fémhüvelyt és kötözött markolatot kap, szélesebb, erősebb ütést ad.
- Próbarecept: 2 vadkakukkfű + 2 lándzsás útifű + 1 vörösfenyőgyanta + 1 adag koncentrátum. A csalán megmarad más felhasználásra. A teszt biztosítja a gyógynövényeket és a fejlesztés szükséges készletét, de a teljes folyamatban a gyantát harc után kell megszerezni.
- A déli erdő a patakhídtól folytatódik, az ismert indagubanccal és spórapamaccsal, valamint az új, erősebb gyökércsomóval. A gyökércsomóval lezárt átjáró mellett nem lehet elsétálni. Figyelmeztető mozdulat után támad, majd a visszahúzódáskor sebezhető. Vereségnél Sam hazakerül, tárgy- és aranyveszteség nélkül.
- A gépben az összetevők külön behelyezhetők; kivonás, szűrés, hűtés, majd a koncentrátum hozzáadása következik. Ablakbezárás nem veszi el a folyamat állapotát, egy készítés nem vonhat le kétszer alapanyagot. A mikroszkóp alatt kontroll és kezelt minta hasonlítható össze, kézi élességállítással. A siker nem bizonyítja a természetbeli vagy méhek melletti biztonságosságot.
- Kezdőpontok: teljes folyamat Noah levele előtt; Simon; patakhíd; kivonatkészítés előtt. Újraindítás mindig a tesztbe belépéskor megőrzött farmmásolatból indul. Kilépés vagy frissítés eldobja az egész kísérletet.

- A déli erdő a küldetés előtt lezárt átjáró és sűrű növényzeti takarás mögött marad, veszélyt jelző táblával. A normál játékban még nincs hozzáférés; a fejlesztői tesztben Simon útmutatása nyitja meg. A lezárás oldalról sem kerülhető meg, de egy korábbi mentésben már mögötte álló játékost nem zárunk bent.
