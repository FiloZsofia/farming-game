export const farmBounds={left:-400,top:-360,right:1200,bottom:600} as const;
// Shared world-space layout: drawing, collision and proximity prompts use the same anchors.
export const farmLayout = {
  catalog:{x:297,y:214,w:18,h:12},
  journal:{x:259,y:226,w:18,h:13},
  mailbox:{x:112,y:474,w:24,h:16},
  shipping: {x:158,y:244,w:32,h:24},
  pond: { x: 638, y: 464, rx: 153, ry: 113 },
  houseBounds:{x:119,y:99,w:241,h:124},
  shedScale:1.23,
  shedBounds:{x:563,y:72,w:146,h:109},
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
