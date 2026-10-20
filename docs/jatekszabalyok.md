# Játékszabályok és megvalósítási állapot

## Időszabályok – megvalósítva

6 perc nappalt legfeljebb 4 perc éjszaka követ, aktív játékidőben mérve. Az éjszaka 2. percében figyelmeztetés, a 3. percben újabb figyelmeztetés érkezik. Ha nem történik önkéntes napzárás, az éjszaka 3:30 és 4:00 közötti véletlenszerű időpontjában a főhős összeesik, majd otthon, másnap reggel ébred. Goldot és tárgyat nem veszít. Ez független a staminától: annak elfogyása nem okoz ájulást. A verandán lévő naplóval korábban is lezárható a nap. Menük, párbeszédek és bezárt játék alatt nem telik az idő.

Első próbához elfogadott növekedési idők: retek 3, burgonya 5, borsó először 6 megöntözött nap; a borsó utána 3 megöntözött naponta újra terem.

Az elfogadott játékmenet teljes leírása a [játéktervben](jatekterv.md) található. Növekedési időt, árat, hozamot, napidőt és staminaköltséget csak közös egyeztetés után véglegesítünk.

## Mozgáspróba – megvalósítva

- Indulás a ház verandájánál; WASD, nyilak és érintőgombok.
- Egyenletes mozgási sebesség átlós irányban is.
- Ház, melléképület, tó és pályaszél ütközései; néhány kő akadály.
- Egyszerű helyzetfüggő szöveg a verandánál, a tónál és a melléképületnél.
- A játékban már nincs házhoz teleportáló kezelőgomb.

A dekoratív kerítések és fák még nem teljes ütközési rendszer részei. A főhős animációja is helykitöltő.

## Még nincs megvalósítva

Stamina, teljes tárgykészlet és kapacitás, tárolás, építés és évszakváltás. Az évszak egyelőre tavasz; a napszak és a napszám már változik.

## Felületfrissítés

A játék most az egész ablakot használja, a kamera méretváltásra alkalmazkodik és követi a karaktert. A történet, irányítás és helyszínszövegek a játéktér fölött jelennek meg. A bevezető új farmnál jelenik meg; meglévő mentést közvetlenül folytatunk, a történet külön gombbal újraolvasható. A párbeszéd leállítja a mozgást, és bezáráskor törli a beragadt iránybemeneteket. A képernyőgombok és a billentyűzet továbbra is használhatók.

## Elrendezés pontosítása

Az ágyások a verandától jobbra, kompakt csoportban helyezkednek el. Az ösvények körülöttük futnak, a melléképület balra és feljebb került, a tó nagyobb partvonalat és rövid stéget kapott a referenciához közelítve. A rajzolás és az ütközés közös elrendezési adatokból dolgozik. Külön teszt ellenőrzi, hogy az ágyások nem lógnak az utakba, a főösvény járható, a stégre fel lehet lépni, a vízbe nem. A grafika továbbra is egyszerűsített helykitöltő, nem a hangulatterv pontos reprodukciója.

## Kertészkedés – megvalósítva

Kapa, vetés és öntözés eszközsávval, 1–5 gyorsbillentyűkkel, közeli kockára kattintással/koppintással, illetve előre irányított F/Művelet használattal. 4–4 retek-, burgonya- és borsóültetőanyaggal indulunk. A sikeres vetés pontosan egyet fogyaszt; a hibás vagy ismételt művelet nem fogyaszt magot és nem törli a meglévő növényt. Megöntözött föld sötétebb, apró kék jelöléssel; az ültetést és növekedést ideiglenes, több fejlődési állapotú növényrajz mutatja.

A 16 világpixel méretű kocka és 44 világpixel elérési távolság kezelési próbaérték, nem végleges játékmeneti egyensúly. A meglévő ágyások és két tiszta rétfolt használhatók, más helyszínek védettek. Az ágyásszegélyek védelme és a világkoordinátás kijelölés a kameramozgás mellett is érvényes. Nincs még kannaűrtartalom, újratöltési szükséglet vagy stamina; az öntözési állapot napváltáskor törlődik, a növény megmarad.

Az állapot automatikusan mentődik a böngészőben; részletek a [mentési leírásban](mentes.md). Böngészős ellenőrzés: képernyőgombos kapálás/vetés/öntözés, készletváltozás, ismételt vetés tiltása, távoli cél visszautasítása, tényleges vászonkattintás, számbillentyűs eszközválasztás és mobilos elrendezés. A Cypress-tesztek bővültek, de futtató bináris hiányában továbbra sem futottak le ebben a környezetben.

## Ugrás – megvalósítva

Space vagy a külön Ugrás gomb. Mozgás közben rövid gyorsulást ad; álló helyzetben helyben ugrik a főhős. A talajon maradó árnyék és az emelkedő test külön rajzolódik. Az ugrás nem kerüli meg a ház, tó, kövek vagy pályaszél ütközéseit. Ugrás közben nincs kertészkedés. A kertészeti művelet az F billentyűre került, a kattintás és a Művelet gomb megmaradt.

Kipróbálásra szánt új mozgásértékek: 0,64 másodperc ugrás, 32 világpixel magasság és 1,95-szeres sebesség, majd 0,18 másodperc várakozás. A futás Shift nyomva tartásával 1,65-szeres sebességet ad; a külön Futás képernyőgomb már nincs a felületen. Az ugrás és futás gyorsítása nem szorzódik össze. Nincs automatikus ugrásismétlés lenyomva tartott Space-szel. A normál gyaloglás sebessége és a karakter mérete nem változott.

## Napzárás és mentés – megvalósítva

A verandán E, a buborék vagy a naplóra kattintás nyitja meg az esti naplót; a Pihenés reggelig gomb zárja a napot. Távolról a napló nem nyitható meg. Az éjszakai összeesés rövid eldőlés és elsötétedés után ugyanarra az új reggelre vezet. A meglévő magokat és növényeket mindkét eset megőrzi; az öntözési állapot új napra alaphelyzetbe kerül. Goldveszteség nincs, a ládába tett termények ellenértékét az összeesés utáni reggelen is megkapjuk; általános készlet még nincs implementálva.

Az összeesési időpont az adott nap elején kerül kisorsolásra és mentésre; újratöltéskor nem sorsolódik újra. A napváltás mentési hibája nem indít új napot. A növények öntözött napváltáskor fejlődnek, a kézi és kényszerű napzárásnál egyaránt.

Az előző változatban ellenőrizve: 33 egységteszt; közvetlen Chromium-próbában képernyőgombos és Shiftes ugrás, leszállás, párbeszéd alatti időmegállás, naplós napváltás és visszatöltés, tényleges kertészeti műveletek mentése, mindkét éjszakai figyelmeztetés, összeesés és mentett reggeli ébredés, magok és növények megőrzése, mobilos gombelrendezés, második lap írásának blokkolása. A hosszú éjszakai szakaszokhoz ellenőrzött, határidő előtti tesztmentést töltöttünk be; nem tízperces valós idejű várakozás volt. A Cypress-tesztek frissültek, de a futtató binárisa továbbra sem elérhető ebben a környezetben.

## Növekedés és betakarítás – megvalósítva

A retek 3, a burgonya 5, a borsó 6 megöntözött nap után érik be. Öntözés nélkül a fejlődés megáll, a növény életben marad. A növekedés a következő reggel állapotával együtt, atomi mentésben történik. Az érett növény később is leszedhető, nem rohad el.

A 6-os billentyű vagy a Szedés eszköz után kattintás/F/Művelet szedi le az elérhető, érett növényt. A prototípus egy darab terményt ad. Retek és burgonya után a felásott föld újravethető. A borsó a helyén marad, és három újabb öntözött nap után ismét terem, új mag fogyasztása nélkül. Éretlen növényről és távolról nem lehet terményt szerezni, ugyanazt a termést nem lehet kétszer leszedni. A termények számát a Tab-os készlet mutatja; az eladóládából másnap reggel lesz bevétel.

A növényre célzáskor megjelenik a fajta, fejlődési napok és öntözési állapot; éréskor arany jelölés és Betakarítható felirat látható. A növekedési számláló, a borsó újratermése és a terménykészlet mentődik; az előző mentési formátum automatikusan frissül.

A nappal első 180 másodpercében Délelőtt, utána Délután a felirat; 360 másodpercnél Éjszaka következik. A nappali számláló a teljes hatperces nappalból eltelt időt mutatja, délután nem indul újra.

A jelenlegi változat ellenőrzése: 46 egységteszt és TypeScript/kiadási build. Közvetlen Chromium-próbában Space-es magasabb ugrás, Shift-es futás, régi mentés migrációja, három tényleges öntözéses napváltás, beérő retek, 6 + F betakarítás, terménykészlet visszatöltése, délutáni felirat, mobilos futáskapcsoló és hatgombos eszközsáv. A szemléltető érett növényes képekhez külön tesztmentést is használtunk. A Cypress-csomag tesztjei bővültek, de a futtató bináris letöltési korlátja miatt itt nem futottak le.

## Eladóláda és gold – megvalósítva

Induló eladási árak: retek 15, burgonya 30, borsó 12 gold/darab. Az új pénztárca 0 golddal indul. A borsó továbbra is újravetés nélkül újraterem.

A veranda bal oldalán lévő ládához közel kell sétálni. E vagy kattintás/koppintás nyitja meg. A három termény egyesével vagy teljes mennyiségben betehető és napzárásig visszavehető. Magok és szerszámok ebből a felületből nem adhatók el. A ládába helyezés nem fizet azonnal, de a várható bevétel látszik. A reggel megkapott gold a jobb felső sarokban jelenik meg.

Naplós napzáráskor és összeeséskor ugyanaz az elszámolás történik: az áru elfogy a ládából, a pénz egyszer jóváíródik, és az ébredési párbeszédben tételes összesítés jelenik meg. Külön Bevétel gomb nincs; az összesítés reggel jelenik meg. Üres ládáért nincs bevétel. Újratöltés nem fizet kétszer. A láda felülete alatt a játékidő megáll.

Ellenőrzés: 56 egységteszt és build; Chromiumban régi mentés frissítése, behelyezés és visszavétel, függőben lévő láda újratöltése, pontos reggeli összeg és tételes elszámolás, újratöltési/üres napi dupla fizetés tiltása, szándékosan megszakított napváltási tranzakció, változatlan állapot és sikeres egyszeri újrapróbálás, kényszerű reggeli elszámolás és mobilos felület. A szállítmányhoz tesztterményeket tartalmazó mentést használtunk. A Cypress-tesztek bővültek, futtatásuk a hiányzó bináris miatt továbbra is elmaradt.

## Katalógus, posta és letisztult kezelés – megvalósítva

A ház jobb oldali ablakánál kis katalóguskönyv található. Közelről E/kattintás nyitja. Elfogadott árak: retekmag 5, burgonya-vetőgumó 10, borsómag 15 gold/db. A mennyiségekből kosár készül, az összeg és a rendelkezésre álló gold látható. Üres, tört, negatív vagy túl drága rendelés nem adható le.

Sikeres fizetés után a magok úton vannak, nem kerülnek rögtön a készletbe. Másnap a kapu bal oldalán lévő postaládában várnak, sárga zászlóval jelezve. E/kattintás után az Átveszem a csomagot tölti át őket a készletbe. A ki nem vett csomag megmarad, több napi küldemény összeadódik. Sikertelen rendelési vagy átvételi mentés nem módosítja a pénzt/csomagot; az újrapróbálás egyszer hajtja végre a műveletet.

A Napló, Eladóláda, Bevétel, Házhoz, Művelet, Ugrás és Futás képernyőgomb megszűnt. A napló, katalógus, láda és postaláda közvetlen világinterakció. A Menü alatt csak történet, irányítás és készlet található. Mozgás WASD/nyilak, futás Shift, ugrás Space, művelet F vagy kattintás. Érintőképernyőn az iránygombok megmaradtak; a tárgyakat és földet koppintással kezeljük.

Tab nyitja a készletet, amely külön mutatja a három betakarított terményt és a három ültetőanyagot, darabszámmal. Escape bezárja; nyitva a játékidő áll. Tab a már megnyitott párbeszédben normál fókusznavigáció marad. Betakarítás után a visszajelzés a Tab-ra is emlékeztet. A napszak/gold hangsúlyosabb, asztalon 19/22 px, mobilon 17/20 px.

Ellenőrzés: 67 egységteszt és build. Közvetlen Chromium-próbában a fizikailag kattintható katalógus, napló és postaláda, rendelés és pénzlevonás, szándékosan megszakított rendelési/átvételi írás és újrapróbálás, naplóval elindított kézbesítés, csomag átvétele és újratöltése, összeeséses reggeli kézbesítés, mobilos felület és nagyobb HUD, valamint tényleges retekbetakarítás utáni Tab-os darabszám, az időmegállás és Escape-pel visszatérés is ellenőrizve. A kezdő goldhoz és az érett retekhez tesztmentés szolgált. A Cypress-tesztek az új tárgyinterakciókra átírva, de a bináris hálózati korlátja miatt ebben a környezetben továbbra sem futottak.
