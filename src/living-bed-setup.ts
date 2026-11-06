import {livingBedSpawn} from './living-bed-layout';
import type {Snapshot} from './storage';
import {prepareArtStudy} from './art-study-setup';
export function prepareLivingBedTest(source:Snapshot){const next=prepareArtStudy(source);next.farmName=source.farmName;next.player={...livingBedSpawn};next.travel.research.gifted=false;next.travel.research.seeds=0;return next;}
