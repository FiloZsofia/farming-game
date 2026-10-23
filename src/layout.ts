export const farmBounds={left:-400,top:-360,right:1200,bottom:600} as const;
// Shared world-space layout: drawing, collision and proximity prompts use the same anchors.
export const farmLayout = {
  catalog:{x:346,y:238,w:18,h:12},
  journal:{x:266,y:239,w:18,h:13},
  mailbox:{x:112,y:474,w:24,h:16},
  shipping: {x:112,y:252,w:32,h:24},
  pond: { x: 638, y: 464, rx: 153, ry: 113 },
  houseDoor:{x:239,y:235},
  houseBounds:{x:94,y:81,w:291,h:142},
  shedScale:1.5,
  shedBounds:{x:548,y:48,w:177,h:133},
  shedOffset: { x: -25, y: -20 },
  beds: [
    { x: 349, y: 278, w: 57, h: 37 },
    { x: 421, y: 253, w: 57, h: 37 },
    { x: 423, y: 307, w: 57, h: 37 },
  ],
  paths: [
    { width: 32, points: [[170,600],[168,500],[207,404],[249,328],[250,258]] },
    { width: 23, points: [[249,328],[299,282],[343,241],[495,220],[630,220]] },
    { width: 18, points: [[299,282],[320,340],[407,371],[480,394]] },
  ],
  dock: { x: 469, y: 382, w: 64, h: 30 },
} as const;
