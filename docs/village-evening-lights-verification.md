# Falu tábla és esti világítás – 2026-10-25

A keskeny tábla deszkáját és a feliratot közös forgatási pont körül döntjük; az oszlop a helyén marad. A korábbi vászonra rajzolt fényt az éjszakai DOM-árnyékolás elsötétítette. A lámpák új, képernyőre vetített meleg fényréteget kapnak a kék árnyékolás fölött. Az ablakokon megmaradnak az osztások. A külön réteg a játéktér szélére vágja a fényudvarokat, így telefonon sem okoznak túllógást.

- `npm test`: 259 teszt sikeres.
- `npm run build`: sikeres, a meglévő csomagméret-figyelmeztetéssel.
- Közvetlen Chromium/CDP: megdöntött nyíl; éjszakai falunézetben két aktív utcai lámpa, világító boltablakok; 390×844 képernyőn elhelyezés és vízszintes túlcsordulás hiánya; nappali betöltésnél minden fény rejtett vagy nulla fényerejű. Böngészőhiba nélkül.
- A Cypress-bináris hiányában ez közvetlen Chromium-ellenőrzés. Playwright nem került be. A vizsgálat külön böngészőprofilban, tesztmentésekkel történt.

Képek: [megdöntött tábla](concepts/village-tilted-direction-sign.png), [esti falu](concepts/village-evening-visible-lights.png), [telefonos esti nézet](concepts/village-evening-lights-mobile.png).
