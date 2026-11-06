import {livingBedSpawn} from './living-bed-layout';
import type {Snapshot} from './storage';
import {createCrafting} from './crafting';
import {prepareArtStudy} from './art-study-setup';
export function prepareLivingBedTest(source:Snapshot){const next=prepareArtStudy(source);next.farmName=source.farmName;next.player={...livingBedSpawn};next.travel.research.gifted=false;next.travel.research.seeds=0;// Explicit disposable test budget, never transferred to the real farm.
 next.economy.gold=3000;next.clearing.weed=40;next.clearing.stone=100;next.clearing.wood=100;next.travel.research.materials.scrap=40;next.travel.research.materials.copper=4;
 next.travel.crafting=createCrafting();next.travel.crafting.items.gear=4;next.travel.crafting.items.composter=1;
 return next;}
