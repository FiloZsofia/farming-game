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

- Felnőtt nő, vékony, természetes testalkattal és barátságos arccal.
- Világos bőr, de nem túl sápadt tónussal.
- Lófarokba kötött, egyelőre szőkés haj; a pontos hajárnyalat később választandó ki.
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
- Elfogadott visszatérés: minden eltakarított gaz, ág és kő két nap után visszatér eredeti helyére, kivéve ha ott művelt föld van. A régi mentésekben már meglévő föld is védett. Az elhalasztott visszatérés későbbi reggeleken újra ellenőrizhető.
- Mobilon az eszközsáv vízszintesen görgethető; számbillentyűs választáskor a kiválasztott eszközhöz görget.

### Szomszéd, madárodú és élőbb farm – 2026-10-21

- Az első napon egy szomszéd sétál be a kapun, és a ház előtt madárodút ad. Ha a játékos távol van, megvárja, illetve E-vel/kattintással megszólítható. Régebbi farmon a következő nappali lehetőségnél pótolja a látogatást.
- Az ajándék egyetlen példányban kerül a készletbe. Tab → Alapanyagok → Madárodú → Elhelyezem; közeli, szabad helyre kattintva kerül ki. A növényeket és az épületeket nem lehet vele lefedni; a visszatérő gaz/ág/kő nem jelenik meg az odú alatt.
- A szomszéd tanácsa a madarak későbbi kártevővédő szerepét vezeti be; tényleges kártevőrendszert és hozammódosítást még nem adunk hozzá.
- A második reggelen egyszer jelenik meg a főhős kedves gondolatbuboréka; ha az odú még készletben van, elhelyezésre bátorít. A második naptól ritkán madarak repülnek át, nappal időnként színes pillangó is. Ezek nem gyűjthető, nem akadályozó hangulati elemek.
- Részletesebb, barátságos arcú női karakter, szőkés lófarokkal, törtfehér ingben és mohazöld nadrágban. Külön mozgó lábak, karok és lófarok; futáskor gyorsabb léptek. Az éppen választott kertészkedő eszköz a kézben látszik, sikeres munka közben mozog, öntözéskor vízcseppekkel.
- A gaz külön alapanyag a készletben és a mentésben; felhasználása továbbra is nyitott.
- A tó szabálytalan, kisebb öblökkel tagolt partvonalat kap, a víz ütközési határa ugyanazt az alakot követi.
