# Élő ágyás — kertészeti próba

Állapot: 2026-11-06. Kizárólag fejlesztői teszt, nem váltja le a rendes játék kapálás–ültetés–öntözés rendszerét. A játék verziója 0.2.0 marad.

## Megnyitás

1. Nyisd meg a játékot `?dev=1` paraméterrel, és folytasd a farmodat.
2. Menü → Fejlesztői eszközök → **Kertészeti próba · Élő ágyás** → Teszt indítása.
3. Sam a próbaágyás mellett áll. Sétálhatsz körülötte; E-vel vagy a növényre kattintva megfigyelheted.
4. A felső TESZTMÓD gomb megnyitja az eszközpanelt. Az újraindítással másik társítást is kipróbálhatsz; a Kilépés a tesztmódból visszatölti a rendes farmot.

## Kipróbálható működés

- **Ágyás kialakítása:** egy egész területet készítesz elő, külön földkockák helyett.
- **Növények összeválogatása:** Konyhakerti társítás, Virágos zöldséges vagy Illatos szegély. Együtt nőnek a zöldségek, a kakukkfű és a vadvirágok.
- **Nedvességgondozás:** az öntözés az egész ágyást éri; a víz több napig megmarad. A mulcs lassítja a száradást, az eső feltölti a talaj nedvességét. Száraz földben a növekedés megáll, a levelek lekonyulnak; a próba nem pusztítja el a növényeket.
- **Megfigyelés:** a talaj színe, a mulcs takarása, a levelek és a virágok látszanak a világban. Egyetlen növény kiválasztható kattintással vagy a kezelőpanel választójával. Nincs kötelező modális ablak.
- **Szedés vagy továbbnevelés:** a szedhető növényt betakaríthatod vagy hagyhatod virágozni. A virágokhoz apró rovarok érkeznek, később magot gyűjthetsz. Ugyanarról a növényről nincs ismételt termés- vagy magfelvétel megfelelő új növekedés nélkül.
- **Tartós növények:** a kakukkfű és a borsó töve szedés után megmarad, újra nő. Az egyszer betakarított retek/saláta helye üres marad.

A felhasználó a gyors, **kézzel léptethető napokat** választotta. A Következő nap és az Esős nap gombbal várakozás nélkül követhetők a változások. A normál napi óraketyegés a próba alatt megáll.

## A próba határai és kezdeti értékei

Egy ágyás és három előre összeállított társítás szerepel, nem szabad ágyásépítő vagy végleges növénytársítási rendszer. A társítások összetétele és látványa eltér; terméshozam-bónusz vagy gazdasági egyensúly még nincs hozzájuk kialakítva. Az alap látvány és Sam a rendes játékból származik; az alternatív farmgrafika nem lép működésbe.

A próbaértékek nem változtatnak a rendes növényeken: a nedvesség három fokozatot tárol, takaratlanul naponta, mulccsal kétnaponta fogy egy fokozat. A növekedés nedves napokon halad. A próbanövekedés retek/kakukkfű/vadvirág esetén három, salátánál kettő, borsónál hat nap; virágozni hagyás után két nedves nap vezet a maghoz. Ezek kipróbáláshoz választott, később egyeztetendő tesztértékek, nem végleges játékmeneti döntések.

A szedett növények és magok a **Próbakosár** összesítőjében jelennek meg. Ez nem új Készlet-kategória és nem kerül át a normál farmra. A próba nem fogyasztja a rendes vetőmagot vagy mulcsot, nincs ára. A saját növényállapot az újraindításkor vagy kilépéskor elvész; a normál farm és biztonsági másolata megmarad.

## Mentési védelem

Az indítás előbb rögzíti az aktuális rendes haladást, majd `SaveStore.beginTest()` módba vált. A próba tiszta, külön pillanatképet használ, a növények állapota csak a tesztvezérlő memóriájában él. Nincs új mentésmező vagy sémaváltás. Másik tesztre váltás eltávolítja az ágyást, a rovarokat és a panelt, és visszaállítja a szokásos kamerát/eszközsávot.

## Ellenőrzés

- 420 sikeres teszt / 63 fájl, sikeres build.
- Egységtesztek: egész ágyás előkészítése, társítás egyszeri ültetése, nedvesség és növekedés, mulcs/eső, szedés/virágoztatás kizárása, egyszeri maggyűjtés, évelő újrahajtás, eredeti pillanatkép megőrzése, ösvények és stég szabadon hagyása.
- Cypress-bináris nem állt rendelkezésre, ezért Chromium CDP-vel, izolált profilon ellenőrizve: teljes ültetési és gondozási folyamat, kézi időléptetés, rovarok, maggyűjtés, kiszáradás és eső, újrahajtás, távolságellenőrzés, tényleges billentyűs séta és ágyásütközés, nem modális E, 390 × 844 mobilkamera/panel, váltás a látványtesztre és az alkatrészes tesztre, kilépés.
- A normál mentés és biztonsági másolat exportált tartalma a próba előtt, közben és a kilépés utáni visszatöltéskor azonos.

[Kialakítás előtt](concepts/living-bed-test-before-preparation.png) · [Társítások](concepts/living-bed-test-planting-choices.png) · [Fiatal ágyás](concepts/living-bed-test-young-mixed-bed.png) · [Szedhető növény](concepts/living-bed-test-ready-to-pick.png) · [Virágok és látogatók](concepts/living-bed-test-flowers-and-visitors.png) · [Saját magok](concepts/living-bed-test-own-seeds.png) · [Száraz talaj](concepts/living-bed-test-dry-soil.png) · [Eső](concepts/living-bed-test-rain.png) · [Mobil](concepts/living-bed-test-mobile.png)

## Következő próbaváltozat — 2026-11-06

A három régi kezdőkeret már nincs jelen ebben a tesztben. A kijelölést szabadon mozgathatod a mutatóval; kattintás vagy az „Itt jelölöm ki az ágyást” gomb rögzíti. Érintőképernyőn előbb érintéssel válassz helyet, majd a gombbal erősítsd meg. Az érvénytelen helyet a kijelölés és az inaktív gomb jelzi. Az épületek, utak, víz és Sam helye védett.

Ezután sétálj közel és nyomj E-t vagy kattints az ágyásra. Csak ekkor nyílik meg a gondozás. Vissza, Esc, távolodás vagy az ágyáson kívüli talajra kattintás bezárja; a próba aktuális célja ismét látszik. A föld előkészítése előtt másik hely is választható. A jelölő immár kis fa tábla.

A próbában kezdetben fajonként 9 tesztmag áll rendelkezésre. A társítás beültetése már fogyasztja a szükséges magokat. Betakarítás után a keverék bármely tagja vethető az üres helyre, ha van mag; más faj nem, mag nélkül a választás inaktív. A saját gyűjtésű mag is használható. A rendes magrendelés és komposztáló nincs még bekötve ehhez az új modellhez; a társítások sem végleges kertészeti ajánlások.

423 sikeres teszt / 63 fájl és sikeres build. Chromium CDP-vel külön, frissen létrehozott böngészőprofilban ellenőrizve: szabad elhelyezés a korábbi kezdőágyások helyén is, vízre lerakás elutasítása, panel csak interakcióra, aktuális cél elrejtése/visszatérése, fa jelölő, magfogyasztás, másik megfelelő faj utánvetése, nulla maggal tiltás, eltávolodás és mobilkamera visszaállása, másik tesztre váltás. A normál mentés és biztonsági másolata a próba és kilépés alatt változatlan.

[Szabad helyválasztás](concepts/living-bed-v2-free-placement-start.png) · [Tiltott hely](concepts/living-bed-v2-invalid-placement.png) · [Fa jelölő](concepts/living-bed-v2-wood-marker.png) · [Utánvetés](concepts/living-bed-v2-replant-choice.png) · [Másik növény a helyén](concepts/living-bed-v2-replanted-herb.png) · [Bezárt panel és cél](concepts/living-bed-v2-closed-panel-goal.png) · [Mobil](concepts/living-bed-v2-mobile-inspection.png)

A további ötletek és a még hiányzó integrációk pontos státusza: [Kertészkedési átállási terv](kerteszkedes-atallasi-terv.md).
