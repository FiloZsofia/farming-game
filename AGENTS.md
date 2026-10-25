# Fejlesztési szabályok

- A közös döntések forrása a `docs/jatekterv.md`; a nyitott ötleteket ne kezeld elfogadott követelményként.
- TypeScript és Phaser az alap. Új függőséget csak konkrét igényhez adj.
- A farm biztonságos, a tempó nyugodt. Játékmeneti számokat a felhasználóval egyeztess.
- Ne hivatkozz végleges grafikaként a helykitöltőkre. Külső assetekhez ellenőrizd és dokumentáld a licencet.
- Kötelező ellenőrzés: `npm test` és `npm run build`. Böngészős teszthez Cypress használatos, nem Playwright.
- A mentést érintő módosításoknál adatvesztés és verzióváltás ellen is ellenőrizz.
- Vizuális változásról készíts ellenőrizhető képet. A felhasználónak a GitHubon tárolt képek működtek.

- A Készlet tárgykártyáin csak a tárgy vagy növény neve jelenjen meg. Ne adj hozzá árat, leírást, „Eszköz”, „Küldetéstárgy” vagy „1 db” toldalékot. A szükséges mennyiséget külön számozott jelvény jelezheti; a receptek a Tervrajzok fülre tartoznak.

- A történeti célok és Sam gondolatai ne árulják el a megoldás helyét vagy lépéseit. Ne adj hozzá „menj ide”, „beszélj vele”, „itt keresd” útmutatást vagy korábbi felfedezésre alapozott célzott tippet külön felhasználói kérés nélkül. A már elfogadott cél- és gondolatszövegeket őrizd meg; az új mechanikai feltétel nem engedély ezek átírására.
