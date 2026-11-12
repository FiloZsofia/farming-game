import {it,expect} from 'vitest';
import type Phaser from 'phaser';
import {drawPathNetwork} from './path-art';
it('paints all junction borders before any road filling, so no late border can cut across a branch',()=>{const colors:number[]=[];const g=new Proxy({},{get:(_,method:string)=>(...args:unknown[])=>{if(method==='lineStyle')colors.push(args[1] as number);return g;}}) as Phaser.GameObjects.Graphics;drawPathNetwork(g,[{width:32,points:[[170,600],[305,784],[393,909]]},{width:17,points:[[278,760],[150,813]]},{width:20,points:[[107,930],[-120,938]]}]);const layers=colors.filter(c=>[0x738354,0xa5936c,0xc1ae85].includes(c)).map(c=>[0x738354,0xa5936c,0xc1ae85].indexOf(c));expect(new Set(layers).size).toBe(3);expect(layers.every((rank,i)=>i===0||rank>=layers[i-1])).toBe(true)});
it('does not add scalloped circular bumps along a gently curving path',()=>{
 const caps:number[][]=[];const g=new Proxy({},{get:(_,method:string)=>(...args:unknown[])=>{if(method==='fillEllipse')caps.push(args as number[]);return g;}}) as Phaser.GameObjects.Graphics;
 drawPathNetwork(g,[{width:32,points:[[170,930],[185,933],[200,937],[215,942],[230,948]]}]);
 expect(caps.length).toBeGreaterThan(0);expect(caps.every(c=>c[0]===230&&c[1]===948)).toBe(true);
});
it('keeps a straight edge continuous where two equal-width paths meet',()=>{
 const caps:number[][]=[];const g=new Proxy({},{get:(_,method:string)=>(...args:unknown[])=>{if(method==='fillEllipse')caps.push(args as number[]);return g;}}) as Phaser.GameObjects.Graphics;
 drawPathNetwork(g,[{width:20,points:[[170,930],[107,930]]},{width:20,points:[[107,930],[-100,930]]}]);
 expect(caps.some(c=>c[0]===107)).toBe(false);expect(caps.every(c=>c[0]===-100)).toBe(true);
});
