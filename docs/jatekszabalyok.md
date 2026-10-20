# Játékszabályok és megvalósítási állapot

## Elfogadott időszabályok – még nem megvalósítva

6 perc nappalt legfeljebb 4 perc éjszaka követ, aktív játékidőben mérve. Az éjszaka 2. percében figyelmeztetés, a 3. percben újabb figyelmeztetés érkezik. Ha nem történik önkéntes napzárás, az éjszaka 3:30 és 4:00 közötti véletlenszerű időpontjában a főhős összeesik, majd otthon, másnap reggel ébred. Goldot és tárgyat nem veszít. Ez független a staminától: annak elfogyása nem okoz ájulást. A verandán lévő naplóval korábban is lezárható a nap. Menük, párbeszédek és bezárt játék alatt nem telik az idő.

A növények konkrét növekedési idői még nincsenek elfogadva. A korábban javasolt értékek nem végleges szabályok.

Az elfogadott játékmenet teljes leírása a [játéktervben](jatekterv.md) található. Növekedési időt, árat, hozamot, napidőt és staminaköltséget csak közös egyeztetés után véglegesítünk.

## Mozgáspróba – megvalósítva

- Indulás a ház verandájánál; WASD, nyilak és érintőgombok.
- Egyenletes mozgási sebesség átlós irányban is.
- Ház, melléképület, tó és pályaszél ütközései; néhány kő akadály.
- Egyszerű helyzetfüggő szöveg a verandánál, a tónál és a melléképületnél.
- Visszaállítás a házhoz a kezelőfelület gombjával.

A dekoratív kerítések és fák még nem teljes ütközési rendszer részei. A főhős animációja is helykitöltő.

## Még nincs megvalósítva

Növénynövekedés, betakarítás, stamina, idő múlása, napzárás, eladás, katalógus, teljes készlet, tárolás, építés és mentés. Az évszak és napszak felirata jelenleg rögzített.

## Felületfrissítés

A játék most az egész ablakot használja, a kamera méretváltásra alkalmazkodik és követi a karaktert. A történet, irányítás és helyszínszövegek a játéktér fölött jelennek meg. A bevezető megnyitása nem mentett állapot: jelenleg minden betöltéskor megjelenik. A párbeszéd leállítja a mozgást, és bezáráskor törli a beragadt iránybemeneteket. A képernyőgombok és a billentyűzet továbbra is használhatók.

## Elrendezés pontosítása

Az ágyások a verandától jobbra, kompakt csoportban helyezkednek el. Az ösvények körülöttük futnak, a melléképület balra és feljebb került, a tó nagyobb partvonalat és rövid stéget kapott a referenciához közelítve. A rajzolás és az ütközés közös elrendezési adatokból dolgozik. Külön teszt ellenőrzi, hogy az ágyások nem lógnak az utakba, a főösvény járható, a stégre fel lehet lépni, a vízbe nem. A grafika továbbra is egyszerűsített helykitöltő, nem a hangulatterv pontos reprodukciója.

## Kertészkedés – megvalósítva

Kapa, vetés és öntözés eszközsávval, 1–5 gyorsbillentyűkkel, közeli kockára kattintással/koppintással, illetve előre irányított Szóköz/Művelet használattal. 4–4 retek-, burgonya- és borsóültetőanyaggal indulunk. A sikeres vetés pontosan egyet fogyaszt; a hibás vagy ismételt művelet nem fogyaszt magot és nem törli a meglévő növényt. Megöntözött föld sötétebb, apró kék jelöléssel; az ültetést ideiglenes, nem növekvő növényjel mutatja.

A 16 világpixel méretű kocka és 44 világpixel elérési távolság kezelési próbaérték, nem végleges játékmeneti egyensúly. A meglévő ágyások és két tiszta rétfolt használhatók, más helyszínek védettek. Az ágyásszegélyek védelme és a világkoordinátás kijelölés a kameramozgás mellett is érvényes. Nincs még kannaűrtartalom, újratöltési szükséglet, stamina vagy növekedés; az öntözés állapota napváltás hiányában megmarad a munkameneten belül.

Az állapot csak memóriában él. A mentés nincs implementálva; az újratöltés mindent visszaállít. Böngészős ellenőrzés: képernyőgombos kapálás/vetés/öntözés, készletváltozás, ismételt vetés tiltása, távoli cél visszautasítása, tényleges vászonkattintás, számbillentyűs eszközválasztás és mobilos elrendezés. A Cypress-tesztek bővültek, de futtató bináris hiányában továbbra sem futottak le ebben a környezetben.
