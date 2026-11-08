import {crops,salePrices} from './economy';
import {cropNames,type Crop} from './gardening';
import {extras,extraNames,extraPrices,type Extra} from './estate';
import {bedKinds,type BedKind} from './living-bed';
import type {Snapshot} from './storage';
export const cultivatedPrices={thyme:12,oregano:14,sage:16,chamomile:15,lemonBalm:18,calendula:8,borage:8} as const;
export type CultivatedProduct=keyof typeof cultivatedPrices;
export type FarmProduct=Crop|Extra|`garden:${CultivatedProduct}`;
export const farmProducts:FarmProduct[]=[...crops,...extras,...(Object.keys(cultivatedPrices) as CultivatedProduct[]).map(k=>`garden:${k}` as const)];
export const validFarmProduct=(v:unknown):v is FarmProduct=>typeof v==='string'&&(farmProducts as string[]).includes(v);
export function farmProductName(p:FarmProduct){if(p.startsWith('garden:'))return bedKinds[p.slice(7) as CultivatedProduct].name;return p in cropNames?cropNames[p as Crop]:extraNames[p as Extra];}
export function farmProductPrice(p:FarmProduct){if(p.startsWith('garden:'))return cultivatedPrices[p.slice(7) as CultivatedProduct];return p in salePrices?salePrices[p as Crop]:extraPrices[p as Extra];}
export const farmProductIcon=(p:FarmProduct)=>(p.startsWith('garden:')?p.slice(7):p) as BedKind|Extra|Crop;
export function farmProductAccount(s:Snapshot,p:FarmProduct){return p.startsWith('garden:')?{counts:s.travel.homestead!.garden.extraProduce as Record<string,number>,key:p.slice(7)}:p in cropNames?{counts:s.produce as Record<string,number>,key:p}:{counts:s.travel.estate.produce as Record<string,number>,key:p};}
