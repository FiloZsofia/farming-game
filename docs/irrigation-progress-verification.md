# Öntözőpermet és 30 pontos jelző

- Az eredeti HUD és az ágyásmodell közös pontszámítást használ. Az első két szinthez 50–50 pont kell, utána szintenként 30. Tesztben 129 → 130 pont esetén 2. szint / 29/30 → 3. szint / 0/30.
- Böngészőben szándékosan átadott régi 50/50 értékkel is a valódi mentett 29/30, majd 0/30 és +1 látszik. A felirat több képkocka után sem áll vissza a régi értékre.
- Az új vízsugarak a fúvókából indulnak, ívelt pályán az ágyásba érnek. Réteges víz, haladó cseppek és becsapódások; indulási és befejezési szakasz külön kezelve. A szükséges napokon működő automata vízellátási szabályai változatlanok.
- Normál játékon, elkülönített böngészős munkamenetben ellenőrizve, SaveStore.beginTest() mentési védelemmel.
- 552 sikeres teszt és sikeres production build.

Képek: `concepts/production-irrigation-water-arcs.png`, `concepts/production-gardening-thirty-point-hud.png`.

## Az első két 50 pontos szint megőrzése

A korábbi, mindenütt 30 pontot feltételező ellenőrzés helyett a tényleges küszöbök: 50, 100, 130, 160, 190. A böngészős jelzőn 49/50, majd 0/50; 49/50, majd 0/30; 29/30, majd 0/30 jelenik meg a szinthatárokon. Az átmeneti 30 pontos mentések minden már elért szintje megmarad, az eredeti 50 pontos mentés rejtett többlete nem ad új jutalmat. A migráció második betöltéskor nem módosítja újra a pontokat.

Képek: `concepts/production-gardening-original-fifty-point-hud.png`, `concepts/production-gardening-new-thirty-point-hud.png`.
