# Erdőszéli birtok

Nyugodt, böngészős farmjáték. Jelenleg kertészkedési prototípus: saját ideiglenes grafikával, bejárható farmmal, kapálással, vetéssel és öntözéssel.

## Futtatás

Node.js 22.12+ vagy 24, npm szükséges.

```sh
npm ci
npm run dev
```

Nyisd meg a Vite által kiírt címet. Mozgás: WASD, nyilak vagy érintőgombok. A „Vissza a házhoz” gomb visszaállítja a kezdőpozíciót.

```sh
npm test
npm run build
npm run preview
```

Korlátozott környezetben, ha a Cypress binárisa nem tölthető le: `CYPRESS_INSTALL_BINARY=0 CYPRESS_CACHE_FOLDER=/tmp/farming-cypress npm ci --cache /tmp/farming-npm-cache`. Ez a böngészős tesztfuttatót kihagyja, az alkalmazást és az egységteszteket nem. Később azonos cache-be telepíthető: `CYPRESS_CACHE_FOLDER=/tmp/farming-cypress npx cypress install`.

Ez még nem a végleges grafika. A stamina és eladás még nincs bekötve; a növekedés és betakarítás már működik. A játékidő, esti napló, napváltás és böngészőbeli automatikus mentés már működik.

## GitHub Pages

A mellékelt GitHub Actions munkafolyamat a `main` ág feltöltésekor ellenőriz és buildel, majd GitHub Pagesre telepít. A tároló **Settings → Pages → Source** beállítása legyen **GitHub Actions**. Első aktiválás után szükség esetén indítsd el kézzel a „Deploy game” munkafolyamatot. A játék várható címe: https://filozsofia.github.io/farming-game/ (csak sikeres telepítés után).

## Tervezés

- [Közös játékterv](docs/jatekterv.md)
- [Verandás hangulatterv](docs/concepts/farm-spring-veranda-concept.png)

A prototípus grafikája programból rajzolt helykitöltő, nem a koncepciókép feldarabolt változata. Harmadik féltől származó grafikai assetet nem tartalmaz.

## Böngészős tesztek

Futó fejlesztői szerver mellett:

```sh
npx cypress install
npm run test:e2e
```

Chromium szükséges, vagy válassz más telepített böngészőt a Cypress parancsában. A tesztek a jelenet indulását, a képernyőgombos mozgást, a házhoz visszatérést és a mobilos felületet ellenőrzik. A Cypress bináris letöltéséhez a `download.cypress.io` és átirányításainak elérése szükséges.

Az első felhőkörnyezeti ellenőrzéskor a 6 Vitest-teszt és a build sikeres volt. Valódi headless Chromiumban a jelenet indulása, a billentyűzetes mozgás, a házhoz visszatérés és a mobilos vízszintes túlcsordulás hiánya ellenőrizve lett. A Cypress-csomag települt, de a futtató bináris nem volt elérhető; a letöltési végpont HTTP 403 választ adott, ezért a Cypress-tesztek itt még nem futottak le.

[A tényleges prototípus képernyőképe](docs/concepts/farm-prototype.png)

## Teljes ablakos nézet

A farm kitölti az ablakot; keskeny képernyőn a kamera követi a karaktert. Az oldalsáv megszűnt. A laboros bevezető a játéktér fölötti párbeszédablakban jelenik meg. Bezárás: Folytatás vagy Escape. Később a Történet gombbal újra megnyitható. A közeli helyszínek buborékára kattintva/koppintva vagy az E billentyűvel megjelenik a hozzájuk tartozó szöveg; a lezárt épületnél csak kérdőjel látható. Párbeszéd alatt a karakter nem mozog.

- [Teljes ablakos prototípus](docs/concepts/farm-fullscreen-prototype.png)
- [Mobilos bevezető](docs/concepts/farm-mobile-dialogue.png)

Az „Erdőszéli birtok” munkacím; a végleges cím még egyeztetés alatt áll.

## Kertészkedési próba

Eszközválasztás: alsó sáv vagy 1–6 (kapa, öntözés, retek, burgonya, borsó, szedés). Kattintás/koppintás egy közeli kockára végrehajtja a kiválasztott műveletet. F vagy a Művelet gomb a haladási irányban előtted lévő kockára hat. A világos keret elérhető, művelhető talajt, a vörös keret nem használható célt jelez.

Előbb ásd fel a földet, majd ültesd el az ültetőanyagot és öntözd meg. Induláskor mindháromból 4 darab van. A három meglévő ágyásban és két tiszta rétfolton (bal oldalt, illetve a kert alatti réten) lehet dolgozni; út, víz, ház és ágyásszegély védett. A prototípusban nincs vízfogyás, stamina. Újratöltéskor az utolsó mentés folytatódik.

- [Kertészkedés képernyőképe](docs/concepts/farm-gardening-prototype.png)
- [Mobilos kertészkedés](docs/concepts/farm-gardening-mobile.png)

## Ugrás, idő és napló

Ugrás: **Space** vagy **Ugrás** gomb. Futás: **Shift** nyomva tartásával vagy a **Futás** képernyőgomb bekapcsolásával. Mozgás közben rövid lendület, álló helyben függőleges ugrás; a házon és vízen nem lehet átugrani. A kertészkedés billentyűje **F**.

6 perc aktív nappal után éjszaka lesz. Az éjszaka 2. és 3. percében figyelmeztetés érkezik; 3:30–4:00 között az elfáradt főhős összeesik, majd másnap reggel a háznál ébred, készletveszteség nélkül. A verandán **E / Napló → Pihenés reggelig** korábban is lezárja a napot. Párbeszéd, háttérbe tett lap és bezárt játék alatt az idő megáll. Az öntözött növények reggel fejlődnek; az öntözést minden új napon ismételni kell.

A kert, magmennyiség, helyzet és idő IndexedDB-be mentődik. A jobb felső sarok mutatja az írás állapotát. A naplóból JSON-másolat tölthető le; importálás még nincs. A mentés helyi, nem szinkronizál más böngészővel vagy eszközzel. Részletek: [mentés és helyreállítás](docs/mentes.md).

- [Ugrás képernyőképe](docs/concepts/farm-jump-prototype.png)
- [Éjszakai figyelmeztetés](docs/concepts/farm-night-prototype.png)
- [Mobilos idő- és ugrásvezérlés](docs/concepts/farm-clock-mobile.png)

## Növények és termények

Retek: 3, burgonya: 5, borsó: 6 megöntözött nap az első termésig. A borsó 3 öntözött naponta újra terem. Öntözés nélkül nincs fejlődés, de nincs pusztulás sem. Érett növény: **6 / Szedés → kattintás vagy F / Művelet**. A leszedett termények a **Termények** gombbal nézhetők meg; eladás még nincs.

A fejlődési állapot és terménykészlet is mentődik. A korábbi mentések automatikusan frissülnek, megtartva a farmot. Az első három nappali perc **Délelőtt**, a következő három **Délután**.

- [Növekedés és érett növények](docs/concepts/farm-growth-prototype.png)
- [Mobilos felület](docs/concepts/farm-growth-mobile.png)
- [Magasabb ugrás](docs/concepts/farm-dynamic-jump.png)
