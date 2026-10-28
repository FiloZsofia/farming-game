# Játékverziók

A játék első számozott kiadása **0.1.0**. A korábbi fejlesztéseket nem szükséges utólag verziószámokkal ellátni; a Git-előzményük már megvan.

## Egyetlen verzióforrás

A játékverzió forrása a `package.json` `version` mezője. A felület ezt a `src/version.ts` segítségével olvassa; a számozást ne írd be külön a menük kódjába. Az npm lockfájl gyökérverzióit az npm verzióparancsa tartja összhangban.

- **0.1.1** jellegű lépés: hibajavítás, kisebb grafikai vagy kezelési finomítás.
- **0.2.0** jellegű lépés: nagyobb új tartalom vagy játékrendszer.
- **1.0.0**: az első késznek tekintett teljes kiadás, külön közös döntés alapján.

A három rész külön egész szám: 0.1.9 után 0.1.10, 0.1.11 és így tovább következhet. A 0.2.0 nem a tizedik javítás, hanem nagyobb tartalmi kiadás.

Nem minden apró commit kap új számot. A main ágra feltöltött változtatás új verziószám nélkül is megjelenhet a nyilvános játékban: a közzététel (deploy) nem azonos a számozott kiadással.

**Verziószámot kizárólag előzetes felhasználói egyeztetés és kifejezett jóváhagyás után emelhetsz.** Ha indokoltnak érzed az emelést, előbb ismertesd a változások körét és a javasolt új számot, majd kérdezz rá. Jóváhagyásig a javításokat a jelenlegi számmal készítsd és töltsd fel. Sem a módosítás mérete, sem a közzététel nem jelent automatikus engedélyt verzióemelésre.

2026. október 28-án a felhasználó kérésére a játék verzióját visszaállítottuk **0.1.0**-ra. A közben önállóan létrehozott 0.1.1–0.1.3 címkék történeti hivatkozások maradnak; nem mozgatjuk át őket. Az elkészült funkciók megmaradnak.

## Kiadás menete

1. Kérj előzetes jóváhagyást a javasolt verzióemelésre. Csak a felhasználó válasza után válaszd ki a megbeszélt kiadás léptékét. Az első 0.1.0 után például `npm version patch --no-git-tag-version` állítja át a csomagot és lockfájlt 0.1.1-re; nagyobb tartalmi kiadáshoz `minor` használható. A parancs önmagában nem készít commitot vagy Git-címkét.
2. Írd meg a `CHANGELOG.md` új, dátumozott bejegyzését, a végső változásokkal.
3. Futtasd az előírt teszteket és buildet; ellenőrizd a látható verziót mindkét menüben és egy korábbi farm betöltését.
4. Commitold a kész kiadást. Ehhez a commithoz készüljön megjegyzéssel ellátott Git-címke, például `v0.1.1`; ezt is töltsd fel a kiadással együtt. Már kiadott címkét ne mozgass át másik commitra.

## Nem ugyanaz, mint a mentés verziója

A farmmentés technikai formátumának száma a `storage.ts` feladata. Jelenleg 18; ennek semmi köze a játék 0.1.0 jelöléséhez. Pusztán a játékverzió emelése miatt ne módosítsd és ne migráld a mentéseket. Korábbi bevétel, készlet, kert vagy történeti haladás nem változik meg a számozástól.
