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
- Az eladási összesítő külön, középen jelenik meg, terményikonokkal, darabszámokkal és soronkénti bevétellel. A tegnapi bevétel rövid animációval hozzáadódik a középen mutatott meglévő aranyhoz; a fejléc egyenlege is követi a számlálást. Az ablak ezután magától bezáródik. Üres ládánál is helyes, 0 goldos összesítő látható.
- A játék ideje a reggeli értesítések alatt áll. Csökkentett mozgás beállításnál a számláló animáció nélkül frissül. Hosszú terménylista külön görgethető, hogy az egyenleg telefonon is látható maradjon.
- Az egyenleg jóváírása a napváltás mentési tranzakciójában történik; az animáció kizárólag megjelenítés. A kirablási értesítés és a vizuális elszámolás külön mentett, nyugtázható állapot. Újratöltéskor a még meg nem nézett értesítés folytatható, a bevétel nem íródik jóvá ismét.
- A mentés v14-re lép. A v13-as farmállapot, bokrok és reggeli értesítés megmaradnak, újrabetöltés nem ismétli meg a régi eladási jóváírást. A megváltozott bolthely vagy pad által érintett mentett karakterhely a legközelebbi szabad helyre igazodik, készlet- és aranyvesztés nélkül.
