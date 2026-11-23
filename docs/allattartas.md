# Tyúktartás

A Gazdaudvar a Kertitó Szaküzlet és a Műhelybolt közötti területen áll, saját bekötőösvénnyel. Rubyval a pultnál beszélgethetünk; a vásárlás a többi bolttal közös menüből indul.

## Otthon kialakítása

A megvásárolt tárgyak a Készletbe kerülnek. Előbb a tyúkólat helyezzük le, majd a kifutó sarkait kattintásokkal jelöljük ki körülötte. Az első pontra kattintva bezárjuk a kerítést, kiválasztjuk a kapu oldalát, végül elkészítjük. A kifutó később bővíthető, lakott részét és berendezéseit nem vághatjuk le.

Egy ólhoz legfeljebb négy tyúk tartozhat. A tyúkok egyelőre a kifutóban maradnak. Etető, itató, porfürdő, ülőrúd és árnyékoló is szükséges: csak a ténylegesen lehelyezett, megközelíthető berendezés számít, a Készletben lévő nem. A bolt felsorolja a még hiányzó berendezéseket. A porfürdő és az ülőrúd R-rel vagy a lehelyezőablak gombjával elforgatható. Egy alsó eszköz kiválasztása megszakítja a lehelyezést.

A kaputól el kell férni az ólig és az összes berendezésig. Út, víz, épület, ágyás, fa vagy másik kifutó helyére nem építhetünk. A kifutó nem fedheti le a farmot: 3–16 sarok, legfeljebb 320 × 280 játékegységnyi befoglaló téglalap és 70 000 egységnyi terület engedett. Az üres tárgyak a közös Bontóvas-művelettel visszavehetők; lakott vagy megrendeléssel lefoglalt otthont nem bontunk meg.

## Árak

| Termék | Gold |
| --- | ---: |
| Tyúkól | 320 |
| Kifutó kapuval | 180 |
| Etető | 45 |
| Itató | 40 |
| Porfürdő | 35 |
| Ülőrúd | 35 |
| Árnyékoló | 90 |
| Tyúk, bármelyik változat | 95 |
| Eleség, 10 adag | 20 |

A vörös, krémfehér és kendermagos változat azonos gondozást igényel. Érkezés után egyedi nevet adhatunk a tyúkoknak.

## Mara kiszállítása

A megrendelt tyúk azonnal lefoglal egy férőhelyet, az árát egyszer fizetjük ki. Mara a másnapi szokásos fuvarral érkezik, és egyenként, ölben viszi a tyúkokat a kapun át az ólhoz. Az átadás sikeres mentés után válik véglegessé; újratöltés nem ad másodszor állatot. Ha közben elzárjuk a kapuhoz vezető utat, a rendelés megmarad, Mara jelzi a problémát és egy későbbi fuvarral újrapróbálja.

## Gondozás és termelés

- Tyúkonként napi egy adag eleség fogy. Az etető tizenkét adagot tárolhat.
- A közös itatót naponta újra feltöltjük; mind a négy állatot ellátja.
- Háromnaponta takarítjuk az ólat. A harmadik napra látható szennyeződés jelenik meg; takarítás után eltűnik.
- Két megfelelően gondozott nap után tyúkonként egy tojás keletkezik a fészekben. Az érkezés előtti napok nem számítanak.
- Elmaradó gondozáskor szünetel a tojásrakás, az állat nem pusztul el.
- A begyűjtött tojás a Készletbe kerül, az átadóban Marának 12 gold/db áron eladható.

A tyúkok sétálnak, csipegetnek, használják a porfürdőt és az árnyékos pihenőt, este az ülőrúdra húzódnak. A bátor, félénk és kíváncsi viselkedés egyedi mozgásukban is megjelenik. A gondozás az ólnál nyitható ablakban végezhető, a megfelelő berendezés közeléből.

## Fejlesztési követelmények

A világ és a térkép ugyanazokat a kifutóhatárokat használja. A kerítés, a berendezés, a karakter és a tyúk a talajon elfoglalt helye szerint takarjon. A vásárlás, rendelés, kiszállítás, gondozás, gyűjtés és tárolás a meglévő mentési és készletkorlátokat tartsa meg. Böngészős ellenőrzés csak elkülönített, `SaveStore.beginTest()` által védett farmon történhet.

## Bolt és gondozófelület

A megnövelt üzlet a Műhelybolttól távolabb, kissé északkeletre áll; a Kertitó Szaküzlet homlokzata szabad marad. Az udvar, kapu, szalmabálák és ablakfények együtt követik az épület helyét. A korábbi, bolt elé kihelyezett bemutató ól, etető, itató és eleséges zsákok a felhasználó kérésére megszűntek. A Gazdaudvar udvarjellegét szalmabálák és egy kis, kapun át bejárható, elkerített bemutatóudvar adja. Ezek közös helyadatból rajzolt és ütköző elemek; nem kerülhetnek ösvényre vagy a bejárat elé. A kirakat és az ablakfények ugyanazokat az ablakkoordinátákat követik. Belül bemutató ól, berendezett polcok, varrott eleséges zsákok és tojáskosár ad karaktert az üzletnek.

Az ól kezelése az Ágyáskezelő stílusát megosztó, jobb oldali Állatgondozó panelen történik. A megnyitás mindig lecseréli a korábbi tartalmat; sem szöveg, sem gomb nem halmozódhat. A panel Tovább gombbal vagy Escape-pel zárható, eltávolodáskor és más ablak megnyitásakor eltűnik.

A boltos gyakorlatias, türelmes és finom humorú állatbarát: észreveszi az állatok eltérő szokásait, a félénkek bizalmát nem sürgeti. A bemutatkozást és a váltakozó napi mondatokat ez a személyiség vezeti. A boltos elfogadott neve Ruby. A bolt jelenleg elfogadott neve Gazdaudvar.

A Gazdaudvarhoz vezető ösvényből közvetlen leágazás vezet a Kertitó Szaküzlethez és a Műhelybolthoz is. A teljes hálózat közös külső és belső rajzrétegekkel készül, és ugyanebből az adatból kerül a térképre.

Az udvar a bolt jobb oldali és elülső falához kapcsolódó L alakot követi; a fal mellé nem rajzolunk még egy kerítést. A szalmabálák teljes körvonala a bekerített részen belül marad.

Kerítésrajzoláskor a terv jól látható, fehér kerítésként jelenik meg. A lezárt, érvénytelen terv piros; az Elkészítem gomb mellett a közös elhelyezési ellenőrzés konkrét oka olvasható (például túl közeli sarkok, kívül maradó ól, akadály vagy megközelíthetetlen kapu). A rajzolás és a tényleges elkészítés ugyanazt az ellenőrzést használja.
