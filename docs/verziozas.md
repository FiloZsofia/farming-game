# Játékverziók

A játék első számozott kiadása **0.1.0**. A korábbi fejlesztéseket nem szükséges utólag verziószámokkal ellátni; a Git-előzményük már megvan.

## Egyetlen verzióforrás

A játékverzió forrása a `package.json` `version` mezője. A felület ezt a `src/version.ts` segítségével olvassa; a számozást ne írd be külön a menük kódjába. Az npm lockfájl gyökérverzióit az npm verzióparancsa tartja összhangban.

- **0.1.1** jellegű lépés: hibajavítás, kisebb grafikai vagy kezelési finomítás.
- **0.2.0** jellegű lépés: nagyobb új tartalom vagy játékrendszer.
- **1.0.0**: az első késznek tekintett teljes kiadás, külön közös döntés alapján.

A három rész külön egész szám: 0.1.9 után 0.1.10, 0.1.11 és így tovább következhet. A 0.2.0 nem a tizedik javítás, hanem nagyobb tartalmi kiadás.

Nem minden apró commit kap új számot. Egy összetartozó, ellenőrzött, játékosoknak kiadott frissítéshez tartozik verzió és változáslista.

## Kiadás menete

1. Válaszd ki a kiadás léptékét. Az első 0.1.0 után például `npm version patch --no-git-tag-version` állítja át a csomagot és lockfájlt 0.1.1-re; nagyobb tartalmi kiadáshoz `minor` használható. A parancs önmagában nem készít commitot vagy Git-címkét.
2. Írd meg a `CHANGELOG.md` új, dátumozott bejegyzését, a végső változásokkal.
3. Futtasd az előírt teszteket és buildet; ellenőrizd a látható verziót mindkét menüben és egy korábbi farm betöltését.
4. Commitold a kész kiadást. Ehhez a commithoz készüljön megjegyzéssel ellátott Git-címke, például `v0.1.1`; ezt is töltsd fel a kiadással együtt. Már kiadott címkét ne mozgass át másik commitra.

## Nem ugyanaz, mint a mentés verziója

A farmmentés technikai formátumának száma a `storage.ts` feladata. Jelenleg 18; ennek semmi köze a játék 0.1.0 jelöléséhez. Pusztán a játékverzió emelése miatt ne módosítsd és ne migráld a mentéseket. Korábbi bevétel, készlet, kert vagy történeti haladás nem változik meg a számozástól.
