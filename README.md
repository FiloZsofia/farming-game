# Silent Pollen

Nyugodt, böngészős farmjáték botanikai kutatással és lassan kibontakozó rejtéllyel. A játék még fejlesztés alatt áll.

Az aktuális játékverzió a Főmenüben és a Menüben látható. [Változások](CHANGELOG.md) · [Verziózási szabályok](docs/verziozas.md)

## Futtatás

Node.js 22.12+ vagy 24, npm szükséges.

```sh
npm ci
npm run dev
```

Nyisd meg a Vite által kiírt címet. A kezdőmenüben a Folytatás az utoljára játszott farmot nyitja meg; az Új játék a farm nevének megadásával új, külön mentést hoz létre 100 golddal és induló magokkal. A korábbi farmok a Mentett farmjaid listában megmaradnak. Játék közben a Menü → Főmenü → Mentett farmok pontban válthatsz közöttük. Mozgás: WASD, nyilak vagy érintőgombok. Ugrás: Space; futás: Shift; művelet: F vagy kattintás; készlet: Tab; tárgyhasználat: közelről E vagy kattintás.

```sh
npm test
npm run build
npm run preview
```

Korlátozott környezetben, ha a Cypress binárisa nem tölthető le: `CYPRESS_INSTALL_BINARY=0 CYPRESS_CACHE_FOLDER=/tmp/farming-cypress npm ci --cache /tmp/farming-npm-cache`. Ez a böngészős tesztfuttatót kihagyja, az alkalmazást és az egységteszteket nem. Később azonos cache-be telepíthető: `CYPRESS_CACHE_FOLDER=/tmp/farming-cypress npx cypress install`.

Ez még nem a végleges grafika. A stamina még nincs bekötve; a növekedés és betakarítás már működik. A játékidő, esti napló, napváltás és böngészőbeli automatikus mentés már működik.

## GitHub Pages

A mellékelt GitHub Actions munkafolyamat a `main` ág feltöltésekor ellenőriz és buildel, majd GitHub Pagesre telepít. A tároló **Settings → Pages → Source** beállítása legyen **GitHub Actions**. Első aktiválás után szükség esetén indítsd el kézzel a „Deploy game” munkafolyamatot. A játék várható címe: https://filozsofia.github.io/farming-game/ (csak sikeres telepítés után).

A GitHub Pages közzétételi workflow `CYPRESS_INSTALL_BINARY=0` beállítással telepíti a függőségeket: az alkalmazás buildjéhez és a Vitest-tesztekhez nincs szükség a Cypress külön böngészős futtatójára. Így a futtató letöltési hibája nem állítja le a közzétételt. A Cypress npm-csomagja és a böngészős tesztek megmaradnak; azok futtatása előtt `npx cypress install` szükséges.

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

Chromium szükséges, vagy válassz más telepített böngészőt a Cypress parancsában. A tesztek a letisztított felületet, a Tab-os készletet, a billentyűs mozgást, a világban kattintható naplót, a rendelést, kézbesítést, átvételt és a mobilos megjelenítést ellenőrzik. A Cypress bináris letöltéséhez a `download.cypress.io` és átirányításainak elérése szükséges.

Az első felhőkörnyezeti ellenőrzéskor a 6 Vitest-teszt és a build sikeres volt. Valódi headless Chromiumban a jelenet indulása, a billentyűzetes mozgás, a házhoz visszatérés és a mobilos vízszintes túlcsordulás hiánya ellenőrizve lett. A Cypress-csomag települt, de a futtató bináris nem volt elérhető; a letöltési végpont HTTP 403 választ adott, ezért a Cypress-tesztek itt még nem futottak le.

[A tényleges prototípus képernyőképe](docs/concepts/farm-prototype.png)

## Teljes ablakos nézet

A farm kitölti az ablakot; keskeny képernyőn a kamera követi a karaktert. Az oldalsáv megszűnt. A laboros bevezető a játéktér fölötti párbeszédablakban jelenik meg. Bezárás: Folytatás vagy Escape. Később a Menü → Történet pontban újra megnyitható. A közeli helyszínek buborékára kattintva/koppintva vagy az E billentyűvel megjelenik a hozzájuk tartozó szöveg; a lezárt épületnél csak kérdőjel látható. Párbeszéd alatt a karakter nem mozog.

- [Teljes ablakos prototípus](docs/concepts/farm-fullscreen-prototype.png)
- [Mobilos bevezető](docs/concepts/farm-mobile-dialogue.png)

Az „Erdőszéli birtok” munkacím; a végleges cím még egyeztetés alatt áll.

## Kertészkedési próba

Eszközválasztás: alsó sáv vagy 1–6 (kapa, öntözés, retek, burgonya, borsó, szedés). Kattintás/koppintás egy közeli kockára végrehajtja a kiválasztott műveletet. F a haladási irányban előtted lévő kockára hat. A világos keret elérhető, művelhető talajt, a vörös keret nem használható célt jelez.

Előbb ásd fel a földet, majd ültesd el az ültetőanyagot és öntözd meg. Induláskor mindháromból 4 darab van. A három meglévő ágyásban és két tiszta rétfolton (bal oldalt, illetve a kert alatti réten) lehet dolgozni; út, víz, ház és ágyásszegély védett. A prototípusban nincs vízfogyás, stamina. Újratöltéskor az utolsó mentés folytatódik.

- [Kertészkedés képernyőképe](docs/concepts/farm-gardening-prototype.png)
- [Mobilos kertészkedés](docs/concepts/farm-gardening-mobile.png)

## Ugrás, idő és napló

Ugrás: **Space**. Futás: **Shift** nyomva tartásával. Mozgás közben rövid lendület, álló helyben függőleges ugrás; a házon és vízen nem lehet átugrani. A kertészkedés billentyűje **F**.

6 perc aktív nappal után éjszaka lesz. Az éjszaka 2. és 3. percében figyelmeztetés érkezik; 3:30–4:00 között az elfáradt főhős összeesik, majd másnap reggel a háznál ébred, készletveszteség nélkül. A verandán a naplóra kattintás vagy közelről **E → Pihenés reggelig** korábban is lezárja a napot. Párbeszéd, háttérbe tett lap és bezárt játék alatt az idő megáll. Az öntözött növények reggel fejlődnek; az öntözést minden új napon ismételni kell.

A kert, magmennyiség, helyzet és idő IndexedDB-be mentődik. A jobb felső sarok mutatja az írás állapotát. A naplóból JSON-másolat tölthető le; importálás még nincs. A mentés helyi, nem szinkronizál más böngészővel vagy eszközzel. Részletek: [mentés és helyreállítás](docs/mentes.md).

- [Ugrás képernyőképe](docs/concepts/farm-jump-prototype.png)
- [Éjszakai figyelmeztetés](docs/concepts/farm-night-prototype.png)
- [Mobilos idő- és ugrásvezérlés](docs/concepts/farm-clock-mobile.png)

## Növények és termények

Retek: 3, burgonya: 5, borsó: 6 megöntözött nap az első termésig. A borsó 3 öntözött naponta újra terem. Öntözés nélkül nincs fejlődés, de nincs pusztulás sem. Érett növény: **6 / Szedés → kattintás vagy F**. A leszedett termények **Tab-bal** vagy a **Menü → Készlet** pontban nézhetők meg, az eladóládába téve másnap reggel goldot érnek.

A fejlődési állapot és terménykészlet is mentődik. A korábbi mentések automatikusan frissülnek, megtartva a farmot. Az első három nappali perc **Délelőtt**, a következő három **Délután**.

- [Növekedés és érett növények](docs/concepts/farm-growth-prototype.png)
- [Mobilos felület](docs/concepts/farm-growth-mobile.png)
- [Magasabb ugrás](docs/concepts/farm-dynamic-jump.png)

## Eladóláda és bevétel

A veranda bal oldalán lévő ládához sétálva **E / kattintás** nyitja az eladási felületet. Retek: **15**, burgonya: **30**, borsó: **12 gold/db**. Egyesével vagy mindet beteheted, napzárásig visszaveheted. A várható bevétel rögtön látható; a pénz reggel érkezik meg, naplós pihenés vagy éjszakai összeesés után is.

A gold, függőben lévő áru és az utolsó elszámolás mentődik. A reggeli párbeszéd mutatja a tételes összesítést. A korábbi mentések automatikusan frissülnek, a már betakarított termények megmaradnak. A háznál lévő magkatalógusban már el lehet költeni a goldot.

- [Eladóláda felülete](docs/concepts/farm-shipping-prototype.png)
- [Reggeli elszámolás](docs/concepts/farm-sales-receipt.png)
- [Mobilos eladóláda](docs/concepts/farm-shipping-mobile.png)

## Aktuális felület, készlet és magkatalógus

A korábbi képek történeti prototípusokat mutatnak. Az aktuális nézetben nincs Napló, Eladóláda, Bevétel, Házhoz, Művelet, Ugrás vagy Futás képernyőgomb. A kertben a tárgyakat használjuk; csak a Menü és az eszközsáv marad, érintőképernyőn iránygombokkal. A napszak 19 px, a gold 22 px; mobilon 17 és 20 px.

**Készlet: Tab**, bezárás: **Escape**. Külön kártyákon látszanak a leszedett termények és az ültetőanyagok, darabszámmal. Érintőképernyőn a Menü → Készlet nyitja meg. Betakarítás után a visszajelzés is mutatja a Tab gyorsbillentyűt.

A ház jobb oldali ablaka melletti katalóguskönyvre kattintva vagy közelről E-vel rendelhetünk: retekmag **5**, burgonya-vetőgumó **10**, borsómag **15 gold/db**. A rendelés és fizetés együtt mentődik. A csomag másnap reggel a kapu bal oldalán lévő postaládába érkezik; a sárga zászló jelzi az átvehető küldeményt. Odasétálva E/kattintás, majd **Átveszem a csomagot**. A rendelés, a kézbesítés és az átvétel mentődik; nincs újrafizetés vagy dupla csomag újratöltéskor.

- [Letisztult játékfelület, nagyobb napszak és gold](docs/concepts/farm-clean-hud.png)
- [Tab-bal nyitható készlet](docs/concepts/farm-inventory.png)
- [Magkatalógus](docs/concepts/farm-catalogue.png)
- [Aktuális mobilnézet](docs/concepts/farm-clean-mobile.png)
- [Mobilos katalógus](docs/concepts/farm-catalogue-mobile.png)

### Fejlesztői tesztmódok

A játék hivatkozását `?dev=1` paraméterrel megnyitva a Menüben megjelenik a **Fejlesztői eszközök** menüpont. A **Tesztmódok → A mikroszkóp megtalálása – jelenet** külön, memóriában futó farmmásolatot indít. Kilépéskor az eredeti farm folytatódik; frissítéskor a teszt elvész. Paraméter nélkül a panel rejtett. Ez nem jelszavas hozzáférés-védelem.

A **Noah küldeménye – erdei kísérlet** tesztben a levél, Simon botfejlesztése, a déli erdei harc és gyantagyűjtés, a kivonatkészítő és a mikroszkópos eredmény is kipróbálható. A kezdőpontválasztóval az egyes szakaszok külön indíthatók. A teljes folyamat a postaládánál kezdődik; a teszt biztosítja a szükséges gyógynövényeket és a fejlesztéshez elég alapanyagot/aranyat. Minden újraindítás az eredeti farm külön másolatából indul. A déli erdő a normál játékban még lezárt és takart.
