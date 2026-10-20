# Mentési terv

**A kertészkedési prototípus még nem ment.** Újratöltéskor a karakter visszatér a házhoz, a megművelt föld és ültetés törlődik, a kezdő magmennyiségek visszaállnak. A verandán látható napló még nem használható.

## Elfogadott viselkedés

- Tartós, automatikus mentés, a nap lezárásától függetlenül is.
- Az esti napló lezárja a napot, és a következő reggelhez tartozó mentést is elkészíti.
- Bezárás után nem telik a játékidő és nem fejlődnek a növények.

## Tervezett, még kidolgozandó megoldás

IndexedDB, szükség esetén Dexie.js-szel; verziózott formátum és export/import. A mentendő állapot legalább a karakterhelyzetet, játékidőt, staminát, goldot, készleteket, parcellákat, növényeket, rendeléseket és eladóláda-tartalmat érinti majd.

Implementálás előtt meghatározandó: automatikus mentés kiváltói, hibajelzés, sémaellenőrzés, verzióváltás, atomi napváltás, sérült mentés helyreállítása és több böngészőlap kezelése. Import előtt megőrzendő az előző érvényes állapot. Mentési hibát nem szabad sikeres mentésként jelezni. A helyi adatokat a böngészőadatok törlése eltávolíthatja; felhőszinkron még nincs kiválasztva.
