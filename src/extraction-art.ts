import type {Extraction} from './extraction';
export function drawExtractionMachine(c:CanvasRenderingContext2D,s:Extraction,now:number){
 const box=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const oval=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);c.fill();};
 const pipe=(points:number[][],flow:boolean)=>{c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#3e382b';c.lineWidth=16;c.stroke();c.strokeStyle='#b28a51';c.lineWidth=12;c.stroke();c.strokeStyle='#e1b976';c.lineWidth=2;c.stroke();if(flow){c.strokeStyle='#a6bd77';c.lineWidth=5;c.setLineDash([6,12]);c.lineDashOffset=-now/60;c.stroke();c.setLineDash([]);}for(const[x,y]of points){box(x-8,y-7,16,4,'#665638');box(x-7,y+4,14,3,'#d0ab6b');}};
 // Timber cradle, iron braces and a riveted copper vessel mirror the repaired workshop machine.
 box(370,370,225,18,'#58462d');box(385,382,15,42,'#4b432f');box(567,382,15,42,'#4b432f');
 c.strokeStyle='#3f493a';c.lineWidth=7;c.beginPath();c.moveTo(382,416);c.lineTo(574,375);c.moveTo(579,416);c.lineTo(387,375);c.stroke();
 oval(480,356,184,38,'#67553b');box(388,220,184,130,'#a78651');oval(480,219,184,51,'#d0ad6c');oval(480,344,184,38,'#a78651');
 box(398,238,13,99,'#c0a065');box(548,238,12,99,'#826d47');
 for(const y of [245,329]){box(388,y,184,6,'#6f6448');for(let i=0;i<10;i++)oval(399+i*18,y+3,3,3,'#d1bd85');}
 oval(480,219,155,34,'#443e2f');if(s.loaded.length||s.phase!=='prepare'&&s.phase!=='load'){oval(480,221,143,24,'#788b4d');for(let i=0;i<8;i++){const t=(now/1000+i*.17)%1;oval(437+i*12,219+Math.sin(i+now/500)*4,2+t*5,2+t*2,'#b7c884');}}
 // A sight glass makes the liquid and temperature visible inside the vessel.
 box(455,258,55,65,'#514b36');box(460,263,45,55,'#95a588');box(461,276,43,41,s.loaded.some(id=>id==='thyme'||id==='plantain')?'#78984f':'#8da899');for(let i=0;i<3;i++)oval(470+i*12,310-(now/40+i*17)%30,3,4,'#c6d6a0');box(460,263,5,55,'#c0cfad');
 if(s.phase==='extract')for(let i=0;i<6;i++){const t=(now/1700+i*.17)%1;c.strokeStyle=`rgba(227,227,194,${(1-t)*.65})`;c.lineWidth=2;c.beginPath();c.ellipse(465+Math.sin(i+now/600)*22,196-t*47,5+t*8,8+t*13,0,0,Math.PI*2);c.stroke();}
 // Furnace and stirrer are physically attached to the vessel.
 box(435,372,95,33,'#313b31');for(let i=0;i<6;i++){const h=s.heat*(10+Math.sin(now/120+i)*5);box(445+i*13,400-h,6,h,i%2?'#db9c48':'#be6a36');}
 c.strokeStyle='#a6a079';c.lineWidth=6;c.beginPath();c.moveTo(480,205);c.lineTo(480,180);c.lineTo(403,180);c.lineTo(403,365);c.stroke();
 c.save();c.translate(403,365);c.rotate(now/400*(s.phase==='extract'?1:.05));c.strokeStyle='#b6a779';c.lineWidth=5;c.beginPath();c.arc(0,0,20,0,Math.PI*2);c.moveTo(-20,0);c.lineTo(20,0);c.moveTo(0,-20);c.lineTo(0,20);c.stroke();box(16,-4,16,8,'#775936');c.restore();
 pipe([[572,280],[610,280],[610,190],[680,190],[680,217]],['filter','cool','dose','bottle','done'].includes(s.phase));
 // Filter body, mesh and hand pump.
 box(648,228,65,102,'#757a5c');oval(680,228,65,24,'#b5b28a');oval(680,330,65,22,'#656d52');box(656,242,47,72,'#bfc1a0');
 for(let i=0;i<9;i++)box(658,246+i*7,43,2,'#697958');for(let i=0;i<6;i++)box(659+i*8,243,1,70,'#89936c');
 c.strokeStyle='#c3ae7d';c.lineWidth=5;c.beginPath();c.moveTo(680,215);c.lineTo(680,175+(s.phase==='filter'?Math.sin(now/180)*7:0));c.lineTo(704,175);c.stroke();
 pipe([[713,300],[746,300],[746,204],[795,204]],['cool','dose','bottle','done'].includes(s.phase));
 // Glass cooling jacket and the copper spiral inside it.
 box(776,208,83,125,'#526c60');box(780,211,75,118,'#88a69a');box(785,215,4,109,'#c4d4bb');
 for(let i=0;i<6;i++){c.strokeStyle=i%2?'#b68f57':'#d2b079';c.lineWidth=6;c.beginPath();c.ellipse(817,219+i*18,29,8,0,0,Math.PI);c.stroke();}
 if(s.coolant>0)for(let i=0;i<9;i++)oval(790+i%3*22,219+(now/26+i*19)%102,2,4,'#c4e0ce');
 pipe([[820,335],[820,365],[842,365],[842,393]],['dose','bottle','done'].includes(s.phase));
 // Receiving flask and dispensing tap.
 box(827,389,30,24,'#aab9a4');oval(842,438,62,70,'#99b09a');oval(842,442,49,44,s.phase==='bottle'||s.phase==='done'?'#b5a560':'#91a469');box(824,417,6,30,'#d4dfbb');
 pipe([[871,443],[925,443],[925,462]],s.phase==='bottle');box(907,435,36,7,'#665239');
 box(903,482,44,65,'#748b77');box(907,487,36,56,'#b9c7a7');box(909,540-s.fill*48,32,s.fill*48,'#b9a763');box(906,479,38,7,'#d8d6ae');box(910,490,4,47,'#dce2c4');
 if(s.phase==='bottle'&&s.fill>0&&s.fill<1)box(923,463,4,20,'#c8b972');
}
