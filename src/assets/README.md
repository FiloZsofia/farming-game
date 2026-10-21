# Saját játékassetek

`farmer-b.png`: a felhasználó által kiválasztott B karakterterv alapján képgenerálással létrehozott saját, átlátszó PNG karakterlap. Nem külső assetcsomagból származik; nincs harmadik fél assetlicencének feltüntetési kötelezettsége. Referencia: `docs/concepts/farmer-character-directions-abc.png`, középső oszlop.

A nyolc képkocka elöl-, hátul- és oldalnézetet, illetve lépésfázisokat tartalmaz. A rajzolt képkockák tényleges határait és talppontját a `src/farmer-sprite.ts` kezeli, hogy az eltérő átlátszó margók ne okozzanak ugrálást. A játék a nagy felbontású forrásképet 53 világegység magasra kicsinyíti; ez a koncepció első játékbeli változata, nem végleges animációs készlet. Az eszközök továbbra is külön, az interakció irányába mozgatott rajzok.
