// Convenience switch, not authentication. Browsers/keyboards may capitalise the name.
export function developerToolsEnabled(search=location.search){
 let enabled=false;
 new URLSearchParams(search).forEach((value,key)=>{if(key.toLowerCase()==='dev'&&value==='1')enabled=true;});
 return enabled;
}
