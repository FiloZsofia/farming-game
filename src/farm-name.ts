export function normalizeFarmName(value:string):string|null{
 const name=value.trim().replace(/\s+/gu,' ');
 return name&&[...name].length<=40&&!/[\u0000-\u001f\u007f]/u.test(name)?name:null;
}

export function farmSaveFilename(name:string|null,day:number):string{
 const stem=(name??'farmmentes').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('hu').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'farmmentes';
 return `${stem}-${day}.json`;
}
