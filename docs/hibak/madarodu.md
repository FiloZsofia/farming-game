# Madárodú: takart lehelyezés — 2026. november 3.

Bejelentés: az első madárodú a kezdőház mögé került, az épület eltakarta.

## Ok és javítás

A korábbi ellenőrzés főleg a talajon lévő lehelyezési ponttal és néhány körkörös távolsággal számolt. A rajzolás ennél nagyobb: a háztető túlnyúlik a talajütközésen, az odú pedig 45 egységgel a talaj fölé ér.

A javítás külön kezeli a talajon lévő helyfoglalást és a képi átfedést. A ház és a Műhely előtti szabad földön az odú a fal elé rajzolódhat, ezért az átfedés itt megengedett. Az odú saját rajzrétegen van az épületek felett, a gépek, lombkoronák és szereplők alatt. A ház mögött, a tetők takarásában továbbra sem helyezhető el. A veranda, a lépcső és mindkét bejárati sáv a talajon foglalt terület marad. A veranda tárgyai, kerítés, peremlombok, kifejlett lombkoronák, gépek és tárolók elleni ellenőrzés megmarad. Fordított ellenőrzés védi a már lehelyezett odút új fa, gép vagy láda ráhelyezésétől. Az előnézet és a tényleges lehelyezés ugyanazt a 24-es talajrács-középpontot használja.

A korábbi, már takart odú a mentés betöltésekor visszakerül a Készletbe, ugyanazon ajándékként. Nem keletkezik második odú, és a többi készlet, arany, kert és történeti haladás megmarad. A házfal előtt biztonságosan álló odúkat is megtartjuk, újratöltéskor nem kerülnek vissza a Készletbe; a ládában őrzött odút nem másoljuk meg. A mentésformátum marad 18, a játékverzió marad 0.2.0.

## Ellenőrzés

- 400 sikeres automatikus teszt, sikeres build.
- Új tesztek: mindkét épület előtt megengedett képi átfedés; bejárati és verandafoglalás tiltása; fal előtti régi mentés helyének megőrzése; ház- és műhelytető, oldalsó eresz, veranda, teljes lombkorona, magas berendezés és láda; régi takart mentés egyszeri helyreállítása; ládában tárolt ajándék megőrzése; látható elhelyezés mentése.
- Elkülönített Chromium-profilban, normál játékmódban: régi takart odú visszaállítása a Készletbe; háztető mögötti lehelyezés tiltása; szabad helyre lehelyezés; előnézet és végleges hely egyezése; mentés–újratöltés; Bontóvasas visszavétel. JavaScript-hiba nem jelentkezett. A fal előtti új elhelyezést és a tényleges rajzréteg épület feletti sorrendjét a háznál és a Műhelynél is ellenőriztük; az újratöltés és Bontóvasas visszavétel megmaradt. CDP-próba történt, Cypress-futtatás nem.

[Melléképület előtti elhelyezés](../concepts/birdhouse-in-front-of-workshop.png) · [Házfal előtti elhelyezés](../concepts/birdhouse-in-front-of-house-wall.png) · [Kizárt, takart háztetős hely](../concepts/birdhouse-roof-placement-rejected.png) · [Látható lehelyezés](../concepts/birdhouse-visible-open-placement.png) · [Visszavett odú a Készletben](../concepts/birdhouse-recovered-inventory.png)

## GitHub-jegy lezárása

A játékban sikeresen ellenőrzött és feltöltött javítás után érdemes rövid megjegyzésben rögzíteni a változást és az ellenőrzést, majd **Close as completed** állapottal lezárni a jegyet. Ha a bejelentő újra elő tudja idézni, a jegy újranyitható.

A GitHub API hozzáférési hibája miatt a jegyet ez a munkamenet nem tudta megnyitni; megjegyzést nem küldött és a jegyet nem zárta le.


## Kiegészítés: egyszeri segítség az áthelyezéshez

Az első sikeres lehelyezés után „Tárgyak áthelyezése” címmel az elfogadott Bontóvasas útmutató jelenik meg. A megjelenés farmonként mentődik; sikertelen lehelyezés/mentés után még várakozik, felvétel és újralerakás után nem ismétlődik. A régi mentések az új opcionális jelző nélkül is érvényesek. 402 automatikus teszt és a build sikeres. Böngészőben ellenőrizve az elfogadott szöveg, a sikertelen mentés, a két képernyőméret és a felvétel–újratöltés–újralerakás menete.

[Segítségablak](../concepts/birdhouse-first-placement-help.png) · [Mobilos nézet](../concepts/birdhouse-first-placement-help-mobile.png)
