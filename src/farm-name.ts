export function normalizeFarmName(value:string):string|null{
 const name=value.trim().replace(/\s+/gu,' ');
 return name&&[...name].length<=40&&!/[\u0000-\u001f\u007f]/u.test(name)?name:null;
}
