# Mentésbetöltés ellenőrzése

- A Főmenü fájlválasztója JSON-mentést fogad; a közös sémavizsgálat és meglévő migráció fut rajta.
- 113. nap, 3604 gold és a jártassági adatok változatlanul visszaolvashatók.
- Új, önálló azonosítójú farm és biztonsági példány készül. Azonos nevű korábbi farmokat is megőriz; IndexedDB-visszaolvasás és visszaváltás tesztelve.
- Hibás JSON, sérült érték, ismeretlen verzió és túl nagy fájl elutasítva. A túl nagy fájlt még olvasás előtt visszautasítja. A mentési tesztmód továbbra is tiltja a farm létrehozását.
- Elkülönített Chromium-profilon a tényleges fájlválasztóval is kipróbálva: sikeres betöltés, automatikus megnyitás, ismételt azonos nevű import külön rekordként; a korábbi farmok megmaradtak. Hibás fájl a menüben érthető üzenetet mutat.
- 550 sikeres automatikus teszt és sikeres production build.

Képek: `concepts/production-save-import-menu.png`, `concepts/production-save-import-preserved-farms.png`.
