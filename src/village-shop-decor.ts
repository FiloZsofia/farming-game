// Position the complete object, including its cached drawing and visible bounds.
export const villageShopDecor={
 fishBarrel:{x:865,y:1095},
 workshopBasket:{x:727,y:1338},
 pots:[{x:660,y:1117},{x:754,y:1117}],
};
const barrel=villageShopDecor.fishBarrel,basket=villageShopDecor.workshopBasket;
export const villageShopDecorBounds=[
 {left:barrel.x-22,right:barrel.x+24,top:barrel.y-33,bottom:barrel.y+9},
 {left:basket.x-15,right:basket.x+15,top:basket.y-33,bottom:basket.y+3},
 ...villageShopDecor.pots.map(p=>({left:p.x-13,right:p.x+13,top:p.y-25,bottom:p.y+8})),
];
