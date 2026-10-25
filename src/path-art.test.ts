import {it,expect} from 'vitest';
import type Phaser from 'phaser';
import {drawPathNetwork} from './path-art';
it('paints all junction borders before any road filling, so no late border can cut across a branch',()=>{const colors:number[]=[];const g=new Proxy({},{get:(_,method:string)=>(...args:unknown[])=>{if(method==='lineStyle')colors.push(args[1] as number);return g;}}) as Phaser.GameObjects.Graphics;drawPathNetwork(g,[{width:32,points:[[170,600],[305,784],[393,909]]},{width:17,points:[[278,760],[150,813]]},{width:20,points:[[107,930],[-120,938]]}]);expect(colors).toEqual([0x738354,0x738354,0x738354,0xa5936c,0xa5936c,0xa5936c,0xc1ae85,0xc1ae85,0xc1ae85]);});
