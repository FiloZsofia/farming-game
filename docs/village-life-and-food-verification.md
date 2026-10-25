# Falu, faanyagok, életerő és portrék – 2026-10-25

- `npm test`: 28 fájl, 257 teszt sikeres. Új tranzakciótesztek ellenőrzik a három bogyófélénél az egyetlen darab elfogyását, az egy szívnyi gyógyulást, a maximális életerő és az üres készlet védelmét, a forrás érintetlenségét és az új állapot mentésből való visszaolvasását. A törzsre került régi mentett pozíció helyreállításának tesztje továbbra is sikeres.
- `npm run build`: sikeres, a meglévő csomagméret-figyelmeztetéssel.
- Közvetlen Chromium/CDP: nappali tér, esti lámpák és ablakok, eltávolított épület helye, sűrűbb erdőbejárat, keskeny lefelé mutató Falu nyíl és új fa-/kőcsoportok képi ellenőrzése.
- Közvetlen Chromium/CDP életerőteszt: három szívvel és három áfonyával induló mentés; készletbeli Eszem gomb; kattintásra a készlet bezárul; valódi D billentyű lenyomása közben az evés alatt nincs elmozdulás; egy áfonya fogy és négy szív mentődik; újratöltéskor négy szív marad; újabb evés ötig gyógyít; tele életerőnél inaktív az evés; két szívről alvás után öt szívre áll vissza; Noah pontos leírása ellenőrizve. Böngészőhiba nélkül.
- Külön Chromium-ellenőrzés: Leo és Annie új arcképe az Ismerősök között, valamint a velük kezdeményezett bolti beszélgetésben; a képek betöltődnek, a portré és a helyszíni figura egyezik.
- Cypress-spec kiegészítve az ételfogyasztás, mentett gyógyulás és megmaradt készlet esetével. A bináris hiányában Cypress-futást nem állítunk; a közvetlen Chromium-ellenőrzés nem Playwright.
- A tesztadatok külön böngészőprofilban voltak, a játékos mentéseit nem írtuk át.

Képek: [falu nappal](concepts/village-lively-square-day.png), [falu este](concepts/village-warm-evening.png), [virágos kertrész](concepts/village-flower-garden-no-unused-house.png), [erdőbejárat](concepts/woodland-dense-entrance.png), [Falu nyíl](concepts/village-narrow-downward-sign.png), [fa és kő](concepts/farm-reclaimed-timber-and-stones.png), [evés a készletből](concepts/inventory-berry-food.png), [gyógyulás](concepts/forest-eating-heart.png), [Leo](concepts/leo-reworked-face-dialogue.png), [Annie](concepts/annie-long-blond-hair-dialogue.png), [ismerősök](concepts/villagers-reworked-portraits.png).
