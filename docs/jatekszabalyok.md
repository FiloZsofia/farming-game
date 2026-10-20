# Játékszabályok és megvalósítási állapot

## Időszabályok – megvalósítva

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

Növénynövekedés, betakarítás, stamina, eladás, katalógus, teljes készlet, tárolás, építés és évszakváltás. Az évszak egyelőre tavasz; a napszak és a napszám már változik.

## Felületfrissítés

A játék most az egész ablakot használja, a kamera méretváltásra alkalmazkodik és követi a karaktert. A történet, irányítás és helyszínszövegek a játéktér fölött jelennek meg. A bevezető új farmnál jelenik meg; meglévő mentést közvetlenül folytatunk, a történet külön gombbal újraolvasható. A párbeszéd leállítja a mozgást, és bezáráskor törli a beragadt iránybemeneteket. A képernyőgombok és a billentyűzet továbbra is használhatók.

## Elrendezés pontosítása

Az ágyások a verandától jobbra, kompakt csoportban helyezkednek el. Az ösvények körülöttük futnak, a melléképület balra és feljebb került, a tó nagyobb partvonalat és rövid stéget kapott a referenciához közelítve. A rajzolás és az ütközés közös elrendezési adatokból dolgozik. Külön teszt ellenőrzi, hogy az ágyások nem lógnak az utakba, a főösvény járható, a stégre fel lehet lépni, a vízbe nem. A grafika továbbra is egyszerűsített helykitöltő, nem a hangulatterv pontos reprodukciója.

## Kertészkedés – megvalósítva

Kapa, vetés és öntözés eszközsávval, 1–5 gyorsbillentyűkkel, közeli kockára kattintással/koppintással, illetve előre irányított Szóköz/Művelet használattal. 4–4 retek-, burgonya- és borsóültetőanyaggal indulunk. A sikeres vetés pontosan egyet fogyaszt; a hibás vagy ismételt művelet nem fogyaszt magot és nem törli a meglévő növényt. Megöntözött föld sötétebb, apró kék jelöléssel; az ültetést ideiglenes, nem növekvő növényjel mutatja.

A 16 világpixel méretű kocka és 44 világpixel elérési távolság kezelési próbaérték, nem végleges játékmeneti egyensúly. A meglévő ágyások és két tiszta rétfolt használhatók, más helyszínek védettek. Az ágyásszegélyek védelme és a világkoordinátás kijelölés a kameramozgás mellett is érvényes. Nincs még kannaűrtartalom, újratöltési szükséglet, stamina vagy növekedés; az öntözési állapot napváltáskor törlődik, a növény megmarad.

Az állapot automatikusan mentődik a böngészőben; részletek a [mentési leírásban](mentes.md). Böngészős ellenőrzés: képernyőgombos kapálás/vetés/öntözés, készletváltozás, ismételt vetés tiltása, távoli cél visszautasítása, tényleges vászonkattintás, számbillentyűs eszközválasztás és mobilos elrendezés. A Cypress-tesztek bővültek, de futtató bináris hiányában továbbra sem futottak le ebben a környezetben.

## Ugrás – megvalósítva

Shift vagy a külön Ugrás gomb. Mozgás közben rövid gyorsulást ad; álló helyzetben helyben ugrik a főhős. A talajon maradó árnyék és az emelkedő test külön rajzolódik. Az ugrás nem kerüli meg a ház, tó, kövek vagy pályaszél ütközéseit. Ugrás közben nincs kertészkedés. A Szóköz továbbra is a kertészeti műveleté.

Kipróbálásra szánt értékek: 0,42 másodperc ugrás, közben 1,4-szeres mozgási sebesség, leszállás után 0,28 másodperc várakozás az új ugrásig. Nincs automatikus ismétlés lenyomva tartott Shifttel. A normál gyaloglás sebessége és a karakter mérete nem változott.

## Napzárás és mentés – megvalósítva

A verandán E, a buborék vagy a Napló gomb nyitja meg az esti naplót; a Pihenés reggelig gomb zárja a napot. Távolról a Napló gomb a verandához irányít. Az éjszakai összeesés rövid eldőlés és elsötétedés után ugyanarra az új reggelre vezet. A meglévő magokat és növényeket mindkét eset megőrzi; az öntözési állapot új napra alaphelyzetbe kerül. Gold és általános készlet még nincs implementálva, ezért a napváltás ezekből nem vonhat le semmit.

Az összeesési időpont az adott nap elején kerül kisorsolásra és mentésre; újratöltéskor nem sorsolódik újra. A napváltás mentési hibája nem indít új napot. A növények fejlődése még nincs bekötve: több nap után is a vetést jelző helykitöltő grafika látszik.

Ellenőrizve: 33 egységteszt; közvetlen Chromium-próbában képernyőgombos és Shiftes ugrás, leszállás, párbeszéd alatti időmegállás, naplós napváltás és visszatöltés, tényleges kertészeti műveletek mentése, mindkét éjszakai figyelmeztetés, összeesés és mentett reggeli ébredés, magok és növények megőrzése, mobilos gombelrendezés, második lap írásának blokkolása. A hosszú éjszakai szakaszokhoz ellenőrzött, határidő előtti tesztmentést töltöttünk be; nem tízperces valós idejű várakozás volt. A Cypress-tesztek frissültek, de a futtató binárisa továbbra sem elérhető ebben a környezetben.
