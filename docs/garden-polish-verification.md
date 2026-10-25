# Érettségjelzés és ültetőládák – 2026-10-25

A korábbi, ültetési sorrendben végzett talaj/növény/pipa rajzolásban egy később rajzolt elem eltakarhatta a már elkészült jelzést. Most minden talaj előbb, minden növény utána, minden érettségjelzés utoljára készül el. Az ültetések y/x sorrendben rajzolódnak, a mentett Map beszúrási sorrendjétől függetlenül.

- Két új regressziós teszt: minden növénytípus és újratermés érettségjelzése az összes talaj-, növény- és vízcsepprajz után jelenik meg; fordított mentési sorrendből azonos rajzolási műveletsor keletkezik.
- `npm test`: 259 teszt sikeres. `npm run build`: sikeres, a meglévő csomagméret-figyelmeztetéssel.
- Közvetlen Chromium/CDP: mindhárom ládába beültetett 18 érett növény, mind a kilenc típusból; fordított mentett sorrend; 18 szüretelhető növény és 18 kirajzolt jelzés; újratöltéskor megmaradó helyek és jelzések. A nagyított képen a ládakeretek és a termésformák is ellenőrizve. Böngészőhiba nem volt.
- A böngészős teszt elkülönített profilt és saját IndexedDB-tesztmentést használt. A felhasználó mentése nem változott. A Cypress-bináris hiánya miatt ez közvetlen Chromium-ellenőrzés, nem Cypress vagy Playwright.

Képek: [teljes kert](concepts/garden-all-ripe-markers.png), [ládák és növények részlete](concepts/garden-planter-crop-detail.png).

A 16-os rács, a növekedési idő, a hozam, az ár és a jártasságszerzés változatlan; a nagyobb ültetőhely külön tervezést igényel.
