# Korai fatörzsfelfedezés és déli kerítés

2026-10-25.

- 245 sikeres Vitest-teszt; TypeScript/Vite build sikeres.
- Új történeti feltétel: a mintavételhez a javított berendezés és az aktuális erdei harc teljesítése is szükséges. Az ismételt mintavételt a modell is elutasítja.
- Közvetlen Chromium: javítás előtt, mind a négy ellenfél legyőzése után is csak a jóváhagyott megfigyelés olvasható; nincs mintavételi gomb, nem keletkezik minta, és újratöltés után is így marad. Javítás után a megszokott mintavétel működik és mentődik. A cél szövege változatlan.
- A gépjavítás utáni gondolat és cél forrásszövege nem változott; a korai fatörzsfelfedezés nem vezet külön megoldási tipphez. Az erre vonatkozó szabály bekerült az AGENTS.md-be.
- Közvetlen Chromium: a sötétbarna déli kerítés középső és két szélső szakasza ellenőrizve. A faluba vezető kapu mindkét irányban átjárható; a határ más részein gyalog és ugrással sem lehet áthaladni. A régi belső kerítésdarabok eltűntek.
- A böngészős ellenőrzések futási hiba nélkül fejeződtek be. A Cypress-esetek a javított történeti feltételt követik; a környezet hiányzó Cypress-futtatója miatt az ellenőrzés közvetlen Chromiumban történt.

Képek:

- [Fatörzs a gépjavítás előtt](concepts/early-nest-before-repair.png)
- [Mintavétel a javítás után](concepts/early-nest-after-repair.png)
- [Déli kerítés és kapunyílás](concepts/south-boundary-fence-gate.png)
- [Nyugati szakasz](concepts/south-boundary-fence-west.png)
- [Keleti szakasz](concepts/south-boundary-fence-east.png)
