# Mentés és helyreállítás

A játék natív IndexedDB-be ment, `erdoszeli-birtok` adatbázisban. A mentési formátum verziója 2 (az IndexedDB adatbázisszerkezeti verziója továbbra is 1). A korábbi 1-es formátumú mentést automatikusan frissítjük. Nincs felhőszinkron: másik böngésző vagy eszköz külön farmot használ.

## Mentett állapot

- Karakter talajon mért helyzete.
- Napszám, az adott napon eltelt aktív másodpercek és az előre kisorsolt éjszakai összeesési időpont.
- A három ültetőanyag mennyisége.
- Felásott földkockák, növényfajták, megöntözött fejlődési napok, borsó újratermési állapot és öntözés.
- A betakarított retek, burgonya és borsó mennyisége.

Ugrásanimációt és megnyitott párbeszédet nem mentünk. A még nem létező staminát, goldot, általános készletet, eladóládát és rendeléseket később kell a sémához adni migrációval.

## Mikor mentünk?

- Sikeres kapálás, vetés és öntözés után.
- Öt aktív másodpercenként, hogy a mozgás és a játékidő is megmaradjon.
- Ablakváltáskor, a lap háttérbe kerülésekor és bezárásakor is megkíséreljük a mentést.
- A naplóval lezárt nap és az éjszakai összeesés után a következő reggel teljes állapotát egy tranzakcióban írjuk. Csak sikeres mentés után lépünk az új napba.

A „Mentve ebben a böngészőben” jelzés csak a legutolsó kért mentés sikeres tranzakciója után jelenik meg. Hiba esetén a felület hibát mutat, és az automatikus mentés később újrapróbálja. Hirtelen folyamatleállításkor az utolsó sikeres mentés utáni változások elveszhetnek; az aszinkron bezáráskori írás nem garantált.

## Adatvédelem hibák ellen

- Mentés előtt és betöltéskor ellenőrizzük a sémát, a számokat, a helyzetet, az ültetőanyagot és a parcellákat.
- Az írások sorban futnak, így régebbi mentés nem előzheti meg az újabbat.
- Az előző érvényes állapot külön biztonsági példányként, az újjal közös tranzakcióban tárolódik.
- Sérült elsődleges mentés esetén az előző érvényes példányból folytatjuk, és jelezzük a helyreállítást.
- Ismeretlen verziót vagy helyreállíthatatlan mentést nem írunk felül üres farmmal. Ilyenkor a játék nem indul el a mentésre.
- Web Locks biztosítja, hogy ugyanazt a farmot egyszerre egy böngészőlap módosíthassa. A második lap figyelmeztet; az első bezárása után frissíthető.

A napló párbeszédében a **Mentés letöltése** gomb JSON-másolatot készít. Fájlból importálás még nincs megvalósítva. Az 1 → 2 migráció megőrzi a helyzetet, időt, magokat, növényeket és vizet; a korábban nem létező növekedési számláló nulláról indul, a terménykészlet üres. Az eredeti érvényes 1-es mentés biztonsági példány marad az első sikeres 2-es írásig. Az ismeretlen verziókat továbbra sem írjuk felül. A böngészőadatok törlése a helyi mentést és a helyi biztonsági példányt is eltávolítja.

Bezáráskor, háttérben, másik ablakra váltáskor és párbeszéd alatt nem halad a játékidő; betöltéskor nincs offline előreszámítás.
