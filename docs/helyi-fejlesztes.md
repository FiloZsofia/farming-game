# Átmeneti helyi fejlesztés, privát repóval

A játékot nem kell más tárhelyre költöztetni. A saját gépen futó Vite szerver szolgálja ki; a repó láthatósága később visszaállítható. Nincs jelszó vagy időzített korlátozás a játék kódjában.

## 1. Mentés és helyi példány, még a privátra váltás előtt

1. A jelenlegi online játékban töltsd le a fontos farmok JSON-mentését: az esti Napló ablakának **Mentés letöltése** gombjával. Tartsd meg az eredeti fájlokat.
2. Telepítsd a Node.js **24 LTS** változatát: <https://nodejs.org/>. A telepítés után nyiss új terminálablakot.
3. A projekt helyi másolatához a GitHub Desktop ajánlott: <https://desktop.github.com/>. Jelentkezz be, majd **File → Clone repository → FiloZsofia/farming-game**, és válassz egy könnyen megtalálható mappát. A repó priváttá válása után is a tulajdonosi fiókoddal éred el.
4. ZIP-másolattal is indítható: a GitHub repón **Code → Download ZIP**, majd teljes kicsomagolás. Ez egyszerűbb első próbához, de az itt végzett fejlesztések átvételéhez újra le kell tölteni a változtatásokat. A GitHub Desktopos klónozás ezt megkönnyíti.
5. A projekt mappájában indítsd el duplakattintással a **jatek-inditasa.bat** fájlt. Első alkalommal letölti a függőségeket; a Cypress böngészős tesztprogramot ehhez nem tölti le. A telepítéshez internet szükséges.
6. Nyisd meg: **http://127.0.0.1:5173/**. Az indítóablakot hagyd nyitva.

Parancssorból ugyanez:

```sh
npm ci
npm run dev:local
```

A szerver kizárólag a saját gép 127.0.0.1 címén figyel, nem a teljes helyi hálózaton. A fix port foglaltságakor leáll, nem választ csendben másik portot és új, üres böngészős tárhelyet. Ilyenkor a korábban nyitott helyi szervert állítsd le. A helyi cím protokollját, nevét és portját tartsd állandóan; a `localhost` és a `127.0.0.1` mentései külön tárhelyhez tartoznak.

**Fontos a meglévő farmhoz:** a GitHub Pages és a helyi játék böngészős mentése különálló. A letöltött JSON-fájl biztonsági másolat, de jelenleg nincs a normál játékban fájlból importáló gomb. Ezért a meglévő farm helyi átvitelét külön kell előkészíteni; ne töröld a régi böngészős mentést. Új helyi tesztfarm rögtön indítható. A nyilvános címen tárolt böngészős farm önmagában a repó láthatóságától nem törlődik.

## 2. A repó átmenetileg privát

Csak a sikeres helyi indítás és a mentések letöltése után:

1. Nyisd meg: <https://github.com/FiloZsofia/farming-game/settings>.
2. **General → Danger Zone → Change repository visibility → Change to private**.
3. Kövesd a GitHub által kért megerősítést.

A GitHub Free csomagban a Pages privát repóhoz nem jár; a nyilvános játék ezért leállhat, a beállítás később újra bekapcsolandó lehet. Más csomagban a privát repó nem feltétlenül teszi priváttá a Pages-oldalt. Ha a nyilvános játékot is kifejezetten le akarod állítani, **Settings → Pages → Unpublish site**. A már letöltött kódot vagy egy korábbi másolatot a láthatóságváltás nem vonja vissza.

Ha az automatikus közzétételt is szüneteltetni szeretnéd: **Actions → Deploy game → … → Disable workflow**. Ez külön, visszafordítható beállítás; a munkafolyamat fájlját nem kell törölni.

## 3. Hogyan kerül a beszélgetésben készült változás a gépedre?

Az itteni felhős munkapéldány és a Windows-géped mappája nem ugyanaz. Miután a változtatásokat feltöltöttük a repóba, GitHub Desktopban **Fetch origin**, majd ha megjelenik, **Pull origin**. A helyi Vite rendszerint automatikusan frissíti a böngészőt. Függőségváltozás után leállítás, `npm ci`, majd újraindítás szükséges.

Ha inkább közvetlenül a saját gépeden, helyi szerkesztővel/Codexszel fejlesztesz, a fájlmentés után rögtön frissül a helyi játék. A GitHub Desktopban a saját, még nem feltöltött módosításokat is látod. Az itteni fejlesztéshez a GitHub-kapcsolatnak a privát repóhoz is hozzá kell férnie; sikertelen elérésnél a meglévő kapcsolat repóengedélyét ellenőrizd, ne tedd emiatt automatikusan nyilvánossá a kódot.

## 4. Visszaállítás a mostani működésre

1. Ha a helyi farmot később az online játékban is folytatnád, előbb töltsd le a JSON-mentését. A két cím között nincs automatikus szinkronizálás vagy visszaimportálás.
2. GitHubon **Settings → General → Danger Zone → Change repository visibility → Change to public**.
3. Ha kikapcsoltad: **Actions → Deploy game → Enable workflow**.
4. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. **Actions → Deploy game → Run workflow → main**, majd várd meg a sikeres buildet és deployt.
6. Az online cím változatlan: <https://filozsofia.github.io/farming-game/>.

A korábbi nyilvános farmokhoz ugyanazt a böngészőprofilt és címet használd. A helyi szervert Ctrl+C-vel állíthatod le. A helyi indítófájl és a `dev:local` parancs megmaradhat; nem zavarja a nyilvános játékot.
