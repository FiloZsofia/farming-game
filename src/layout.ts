export const farmBounds={left:-400,top:-360,right:1200,bottom:600} as const;
// Shared world-space layout: drawing, collision and proximity prompts use the same anchors.
export const farmLayout = {
  southGate:{x:146,y:560,w:50,h:40},
  porchBounds:{x:152.6,y:173.75,w:175.5,h:43.75},
  porchSteps:{x:195.8,y:217.5,w:90.5,h:16.25},
  houseOffset:{x:0,y:-48},
  catalog:{x:346,y:190,w:18,h:12},
  journal:{x:272,y:186,w:18,h:13},
  mailbox:{x:112,y:474,w:24,h:16},
  shipping: {x:112,y:204,w:32,h:24},
  pond: { x: 638, y: 464, rx: 153, ry: 113 },
  houseDoor:{x:239,y:187},
  houseBounds:{x:94,y:33,w:291,h:142},
  shedScale:1.5,
  shedBounds:{x:548,y:48,w:177,h:133},
  shedOffset: { x: -25, y: -20 },
  beds: [
    { x: 337, y: 270, w: 80, h: 54 },
    { x: 431, y: 246, w: 80, h: 54 },
    { x: 431, y: 310, w: 80, h: 54 },
  ],
  paths: [
    { width: 32, points: [[170,600],[168,500],[207,404],[249,328],[250,234]] },
    { width: 23, points: [[249,328],[299,282],[343,241],[495,220],[630,220]] },
    { width: 18, points: [[299,282],[320,340],[407,371],[480,394]] },
  ],
  dock: { x: 469, y: 382, w: 64, h: 30 },
} as const;

// Choose the closest porch object so the journal never takes over the doorway prompt.
export function porchInteraction(x:number,y:number):'house'|'journal'|''{
 const door=Math.hypot(x-farmLayout.houseDoor.x,y-farmLayout.houseDoor.y),journal=Math.hypot(x-farmLayout.journal.x-9,y-farmLayout.journal.y-7);
 return journal<=40&&journal<door?'journal':door<=40?'house':'';
}
