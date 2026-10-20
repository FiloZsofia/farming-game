# Fejlesztési szabályok

- A közös döntések forrása a `docs/jatekterv.md`; a nyitott ötleteket ne kezeld elfogadott követelményként.
- TypeScript és Phaser az alap. Új függőséget csak konkrét igényhez adj.
- A farm biztonságos, a tempó nyugodt. Játékmeneti számokat a felhasználóval egyeztess.
- Ne hivatkozz végleges grafikaként a helykitöltőkre. Külső assetekhez ellenőrizd és dokumentáld a licencet.
- Kötelező ellenőrzés: `npm test` és `npm run build`. Böngészős teszthez Cypress használatos, nem Playwright.
- A mentést érintő módosításoknál adatvesztés és verzióváltás ellen is ellenőrizz.
- Vizuális változásról készíts ellenőrizhető képet. A felhasználónak a GitHubon tárolt képek működtek.
