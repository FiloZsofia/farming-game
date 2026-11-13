# Új társítások és műveletenkénti pontozás

A rendes játék elkülönített Chromium-példányában, mentési védelemmel ellenőrizve; nem készült új játékbeli próbamód.

- 3. szint: Paprikás konyhakert; 4. szint: Bogyós menedék; 5. szint: Illatos piroskert. Magkatalógus, ajánlott/szabad arányok és szintenként külön jutalomlista.
- A teljes ágyás előkészítése, vetése és öntözése műveletenként 1 pont; egyedi növénykezelés és új felismerés szintén 1. Az első két szint 50–50, a három új szint 30–30 új pont; az elérhető maximum felett nem gyűlik további pont vagy hitelesítési kulcs.
- Régi 2. szint és 5000 korábbi pont → 2. szint, nulla előrehaladás a következő szinthez. A következő jutalomhoz 30 új művelet szükséges. A még folyamatban lévő régi szint arányos előrehaladása megmarad.
- Új magfajták hiánya régi mentésből nulla készletként kezelhető, a meglévő mennyiségek megmaradnak. Rendelés, átvétel, ültetés és valódi IndexedDB mentés/betöltés automatikus ellenőrzése.
- Új zöldségek és bogyósok ehetősége a közös útvonalon működik (egy darab, egy szív); eladásuk Mara terményátadóján a helyes készletet és elfogadott árakat használja.
- Böngészős szüret a valódi ágyásvezérlővel: 129 → 130 pont, 3. szint, az eredeti bal oldali jártasságjelzőn +1 és 0/30. Mobil Magkatalógus 390 × 844 méretben ellenőrizve.
- Külön növekvő és kifejlett növényformák, valamint málna/szeder/menta/bazsalikom/bársonyvirág ikonok. Bogyós ágyás kilenc növénye a jelenlegi méretben elkülönül.

Képek: `concepts/production-three-new-associations.png`, `concepts/production-berry-refuge-detail.png`, `concepts/production-new-associations-catalog.png`, `concepts/production-new-associations-skills.png`, `concepts/production-new-associations-mobile.png`.

## Elfogadott gondozási mechanikák ellenőrzése

- Öntözés napi / kétnapi alapritmussal; mulcs vagy kavics +1 nap. Új öntözés csak a tényleges szükségletnél lehetséges. Az automata a mulcsos fűszerágyásban az 1. napi öntözés után csak a 4. napon öntöz újra.
- Paradicsom és bogyósok támasz nélkül a termés előtt megállnak; telepítés után tovább fejlődnek. Az öt újraszedhető termő növény két gondozott nap alatt újrateremhet, a tő felnőtt megjelenése megmarad. A hagyma/burgonya felszedés után üres helyet hagy.
- Valódi böngészős kattintás: bogyós támrendszer 20 → 14 fa, paradicsomkaró 14 → 12 fa; kavicstakarás 20 → 18 kő, majd mulcsra váltás 2 → 1 adag mulcs. A tényleges állapot és készlet mentődött a védett próbában.
- Takarások kizárják egymást, de cserélhetők. A támasz és takarás mentése valid és visszaolvasható.
- Összesen 545 sikeres teszt, sikeres production build. A két új kezelési művelet a meglévő ágyáskezelőben van, nem az alsó eszközsávban.

További képek: `concepts/production-gravel-cover-care.png`, `concepts/production-associations-built-support.png`.
