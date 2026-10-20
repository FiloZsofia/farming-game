// Shared world-space layout: drawing, collision and proximity prompts use the same anchors.
export const farmLayout = {
  shipping: {x:158,y:244,w:32,h:24},
  pond: { x: 638, y: 464, rx: 153, ry: 113 },
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
