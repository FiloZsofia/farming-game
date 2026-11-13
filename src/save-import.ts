import {decodeSnapshot,type Snapshot} from './storage';
export const MAX_SAVE_IMPORT_BYTES=10*1024*1024;
export function parseFarmImport(text:string):Snapshot{
 let value:unknown;try{value=JSON.parse(text);}catch{throw new Error('Ez nem olvasható JSON-mentés. Válaszd a játékból letöltött mentésfájlt.');}
 let data:Snapshot|null;try{data=decodeSnapshot(value);}catch{data=null;}
 if(!data)throw new Error('Ez a fájl sérült vagy nem támogatott játékmentés. A meglévő farmjaid megmaradtak.');
 if(!data.farmName)data.farmName='Importált farm';return data;
}
export async function readFarmImport(file:Pick<File,'size'|'text'>){
 if(file.size>MAX_SAVE_IMPORT_BYTES)throw new Error('A kiválasztott fájl túl nagy. A játékból letöltött JSON-mentést válaszd.');
 return parseFarmImport(await file.text());
}
