# Mentés és helyreállítás

A játék natív IndexedDB-be ment, `erdoszeli-birtok` adatbázisban. A mentési formátum verziója 5 (az IndexedDB adatbázisszerkezeti verziója továbbra is 1). A korábbi 1-es, 2-es, 3-as és 4-es formátumú mentést automatikusan frissítjük. Nincs felhőszinkron: másik böngésző vagy eszköz külön farmot használ.

## Mentett állapot

- Farmnév (névadás előtt null); a 4 → 5 migráció minden korábbi adatot megőriz.
- Karakter talajon mért helyzete.
- Napszám, az adott napon eltelt aktív másodpercek és az előre kisorsolt éjszakai összeesési időpont.
- A három ültetőanyag mennyisége.
- Felásott földkockák, növényfajták, megöntözött fejlődési napok, borsó újratermési állapot és öntözés.
- A betakarított retek, burgonya és borsó mennyisége.
- Gold, az eladóládába tett termények és az utolsó reggeli tételes elszámolás.
- A kifizetett, még úton lévő magok és az átvehető postaládás csomag mennyisége.

Ugrásanimációt és megnyitott párbeszédet nem mentünk. A még nem létező staminát, általános készletet és rendeléseket később kell a sémához adni migrációval.

## Mikor mentünk?

- Sikeres kapálás, vetés, öntözés, betakarítás, eladóládába helyezés és visszavétel után.
- Öt aktív másodpercenként, hogy a mozgás és a játékidő is megmaradjon.
- Ablakváltáskor, a lap háttérbe kerülésekor és bezárásakor is megkíséreljük a mentést.
- A naplóval lezárt nap és az éjszakai összeesés után a következő reggel teljes állapotát egy tranzakcióban írjuk. A növényfejlődés, az egyszeri bevétel, a láda kiürítése és az elszámolás ugyanennek a tranzakciónak a része. Csak sikeres mentés után lépünk az új napba; hiba esetén a gold és a láda sem változik.

A „Mentve ebben a böngészőben” jelzés csak a legutolsó kért mentés sikeres tranzakciója után jelenik meg. Hiba esetén a felület hibát mutat, és az automatikus mentés később újrapróbálja. Hirtelen folyamatleállításkor az utolsó sikeres mentés utáni változások elveszhetnek; az aszinkron bezáráskori írás nem garantált.

## Adatvédelem hibák ellen

- Mentés előtt és betöltéskor ellenőrizzük a sémát, a számokat, a helyzetet, az ültetőanyagot és a parcellákat.
- Az írások sorban futnak, így régebbi mentés nem előzheti meg az újabbat.
- Az előző érvényes állapot külön biztonsági példányként, az újjal közös tranzakcióban tárolódik.
- Sérült elsődleges mentés esetén az előző érvényes példányból folytatjuk, és jelezzük a helyreállítást.
- Ismeretlen verziót vagy helyreállíthatatlan mentést nem írunk felül üres farmmal. Ilyenkor a játék nem indul el a mentésre.
- Web Locks biztosítja, hogy ugyanazt a farmot egyszerre egy böngészőlap módosíthassa. A második lap figyelmeztet; az első bezárása után frissíthető.

A napló párbeszédében a **Mentés letöltése** gomb JSON-másolatot készít. Fájlból importálás még nincs megvalósítva. Az 1 → 3 migráció megőrzi a helyzetet, időt, magokat, növényeket és vizet; a korábban nem létező növekedési számláló nulláról indul, a terménykészlet üres. Az eredeti érvényes régi mentés biztonsági példány marad az új formátum első sikeres írásáig. Az ismeretlen verziókat továbbra sem írjuk felül. A böngészőadatok törlése a helyi mentést és a helyi biztonsági példányt is eltávolítja.

Bezáráskor, háttérben, másik ablakra váltáskor és párbeszéd alatt nem halad a játékidő; betöltéskor nincs offline előreszámítás.


## 3-as mentési formátum

A korábbi 1-es, 2-es, 3-as és 4-es mentésből közvetlenül 3-as készül; a betakarított termények, növekedés és borsó-újratermés a 2-esből megmarad. A korábban nem létező pénztárca 0 golddal, az eladóláda üresen indul. A láda új ütközési területe miatt csak akkor igazítjuk a korábbi karakterhelyzetet, ha éppen a láda helyén állt: ilyenkor közvetlenül elé kerül. Más helyzetet és a farmot nem változtatjuk meg.

Az eladási bevételt nem betöltéskor számoljuk újra: a mentett goldot állítjuk vissza, így újratöltéssel nem fizetjük ki még egyszer ugyanazt a szállítmányt. Az ismeretlen vagy sérült 3-as gazdasági adatok nem alakulnak át üres pénztárcává. A biztonsági mentés és az írások sorrendje az eddigi módon működik.


## 4-es mentési formátum: katalógus és postaláda

Az 1–3-as mentések közvetlenül 4-esre frissülnek. A 3-asból megmarad a gold, láda, elszámolás, termények és növekedés; az új rendelési és postaládás mezők üresek. A frissített állapot nem osztozik módosítható objektumokon az eredeti biztonsági példánnyal.

A rendelés fizetését és a függő rendelést közös tranzakció menti, és csak siker után változik az élő játékállapot. Reggel a függő rendelés a postaládába kerül a napváltás tranzakciójában, az összeesés utáni reggelen is. Az átvétel egyetlen tranzakcióban növeli a készletet és üríti a postaládát. Sikertelen írás nem von le pénzt, és nem tünteti el a csomagot; a művelet újrapróbálható.

A magmennyiség a kezdő 4 darab fölé nőhet. Az aktuális játékban egy fajtából a készlet + úton lévő + postaládás mennyiség legfeljebb 999999 lehet; ez technikai tárolási korlát, nem a később tervezett hátizsák-kapacitás. A Tab-os készlet ugyanazokat a mentett számokat mutatja, nincs külön másolat vagy külön számláló.
