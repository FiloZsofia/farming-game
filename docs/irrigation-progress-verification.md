# Öntözőpermet és 30 pontos jelző

- Az eredeti HUD és az ágyásmodell közös pontszámítást használ. Tesztben az összes társítás szinthatára 30 pontos; 89 → 90 pont esetén 2. szint / 29/30 → 3. szint / 0/30.
- Böngészőben szándékosan átadott régi 50/50 értékkel is a valódi mentett 29/30, majd 0/30 és +1 látszik. A felirat több képkocka után sem áll vissza a régi értékre.
- Az új vízsugarak a fúvókából indulnak, ívelt pályán az ágyásba érnek. Réteges víz, haladó cseppek és becsapódások; indulási és befejezési szakasz külön kezelve. A szükséges napokon működő automata vízellátási szabályai változatlanok.
- Normál játékon, elkülönített böngészős munkamenetben ellenőrizve, SaveStore.beginTest() mentési védelemmel.
- 552 sikeres teszt és sikeres production build.

Képek: `concepts/production-irrigation-water-arcs.png`, `concepts/production-gardening-thirty-point-hud.png`.
