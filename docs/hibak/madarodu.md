# Madárodú: takart lehelyezés — 2026. november 3.

Bejelentés: az első madárodú a kezdőház mögé került, az épület eltakarta.

## Ok és javítás

A korábbi ellenőrzés főleg a talajon lévő lehelyezési ponttal és néhány körkörös távolsággal számolt. A rajzolás ennél nagyobb: a háztető túlnyúlik a talajütközésen, az odú pedig 45 egységgel a talaj fölé ér.

A javítás a teljes odúsziluettet veti össze a ház és a Műhely tetővel együtt számolt területével, a veranda tárgyaival, a kerítéssel és peremlombokkal, a gyümölcsfák kifejlett lombkoronájával, a gépekkel és a tárolókkal. Fordított ellenőrzés védi a már lehelyezett odút új fa, gép vagy láda ráhelyezésétől. Az előnézet és a tényleges lehelyezés ugyanazt a 24-es talajrács-középpontot használja.

A korábbi, már takart odú a mentés betöltésekor visszakerül a Készletbe, ugyanazon ajándékként. Nem keletkezik második odú, és a többi készlet, arany, kert és történeti haladás megmarad. A biztonságosan álló odúk helyét nem változtatjuk meg; a ládában őrzött odút nem másoljuk meg. A mentésformátum marad 18, a játékverzió marad 0.2.0.

## Ellenőrzés

- 398 sikeres automatikus teszt, sikeres build.
- Új tesztek: ház- és műhelytető, oldalsó eresz, veranda, teljes lombkorona, magas berendezés és láda; régi takart mentés egyszeri helyreállítása; ládában tárolt ajándék megőrzése; látható elhelyezés mentése.
- Elkülönített Chromium-profilban, normál játékmódban: régi takart odú visszaállítása a Készletbe; háztető mögötti lehelyezés tiltása; szabad helyre lehelyezés; előnézet és végleges hely egyezése; mentés–újratöltés; Bontóvasas visszavétel. JavaScript-hiba nem jelentkezett. CDP-próba történt, Cypress-futtatás nem.

[Kizárt, takart háztetős hely](../concepts/birdhouse-roof-placement-rejected.png) · [Látható lehelyezés](../concepts/birdhouse-visible-open-placement.png) · [Visszavett odú a Készletben](../concepts/birdhouse-recovered-inventory.png)

## GitHub-jegy lezárása

A játékban sikeresen ellenőrzött és feltöltött javítás után érdemes rövid megjegyzésben rögzíteni a változást és az ellenőrzést, majd **Close as completed** állapottal lezárni a jegyet. Ha a bejelentő újra elő tudja idézni, a jegy újranyitható.

A GitHub API hozzáférési hibája miatt a jegyet ez a munkamenet nem tudta megnyitni; megjegyzést nem küldött és a jegyet nem zárta le.
