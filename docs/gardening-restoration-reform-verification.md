# Nagyobb ágyások, helyreállítás, ösvények és magkatalógus – 2026-10-25

## Ellenőrzések

- `npm test`: 32 fájl, 263 sikeres teszt. A korábbi tesztek a 18-as aktuális mentésformátumot várják, a régi bemeneti verziók változatlanok. Az ültetési koordináták elvárt átalakulását külön ellenőrizzük, nem pusztán a verziószámot.
- `npm run build`: sikeres, a meglévő csomagméret-figyelmeztetéssel.
- Új regressziós tesztek: külön rétegekben rajzolt összefüggő ösvényhálózat; teleültetett v17 mentés növényeinek, vadvirágainak, idejének és tárgyainak megőrzése; egymáshoz közeli régi szabadföldi cellák ütközés nélküli átalakítása; mentés ismételt betöltésének változatlansága; háromfázisú, egyszer jutalmazó, tartós helyreállítás; gyomok megújulása; természetes ág- és kőutánpótlás; minden új gyűjtési hely elérhető talajon van; az új helyreállítási helyek anyagmennyisége fedezi a gépet és egy tárolóládát korábban kitakarított mentésben is.

## Közvetlen böngészős próba

Chromium/CDP, külön profilban, saját IndexedDB-tesztmentéssel:

1. V17-es, fordított sorrendben mentett, 18 érett növénnyel betöltött farm: nagyobb rács és 18 jelzés. Szüret, felúszó ikon, +1 termény, V18-as sikeres mentés és újratöltés. Növények száma, megmaradt állapotok és arany ellenőrizve.
2. Szabadföldön új nagy cella kapálása, vetése és öntözése.
3. Faanyag első munkafázisa, újratöltés, további két fázis: pontosan +6 fa és +2 ócskavas. Három nappal később is kitisztított marad a hely.
4. Kőrakás három kézi fázisa: +6 kő.
5. Erdei ág és patakparti kő kézi felszedése: +1 alapanyag, mentett begyűjtési dátum.
6. Erdei és falusi elágazás, valamint a Falu nyíl képi ellenőrzése.
7. Magkatalógus: Vissza felirat; 2 retek választása, bezárás és újranyitás után megmarad; tényleges rendelés után nullázódik.
8. Külön régi, hat kivirágzott vadvirággal rendelkező mentés betöltése: minden virág megmarad a nagyobb rácson, a megfigyelési interakció elérhető.

Mindkét böngészős ellenőrzés sikeres, JavaScript-hiba nélkül. A felhasználó farmjai nem módosultak. A Cypress-spec a friss rácsot és a háromfázisú helyreállítást követi; a hiányzó Cypress-bináris miatt Cypress-futást nem állítunk. Playwright nem került be.

## Képek

- [Nagyobb ültetőhelyek](concepts/garden-larger-planting-cells.png)
- [Szüreti visszajelzés](concepts/garden-harvest-reward-animation.png)
- [Nagyobb szabadföldi cella](concepts/garden-large-meadow-planting.png)
- [Helyreállítás munkafázisai](concepts/farm-restoration-work-phases.png)
- [Természetes faanyag](concepts/forest-natural-wood-gathering.png)
- [Patakparti kövek](concepts/forest-brook-stones.png)
- [Egységes elágazás](concepts/village-unified-forest-junction.png)
- [Új Falu irányjelző](concepts/village-natural-direction-sign.png)
- [Vissza és megmaradó választás](concepts/catalog-back-retains-selection.png)
- [Megőrzött vadvirágok](concepts/garden-enlarged-wildflowers.png)

A nagyobb rács a régi ültetések helyét módosíthatja, az állapotukat és darabszámukat megőrzi. A megújuló erdei utánpótlást napok és időjárás szabályozzák; a farmi fa/kő helyreállítása végleges. Ezek szándékos játékmeneti változások.
