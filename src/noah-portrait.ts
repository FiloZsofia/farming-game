import Phaser from 'phaser';
// Original portrait: a young, clean-shaven colleague with blond hair and blue eyes.
export function noahPortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Noah arcképe';
 const g=scene.add.graphics();
 g.fillStyle(0x273f35).fillRoundedRect(1,1,78,78,12);
 g.fillStyle(0xc69471).fillRoundedRect(31,58,18,19,5);g.fillStyle(0xe6b996).fillRect(35,61,11,14);
 g.fillStyle(0xd19c79).fillEllipse(20,42,8,14).fillEllipse(59,42,8,14);
 g.fillStyle(0xf0c7a2).fillPoints([{x:23,y:23},{x:35,y:17},{x:49,y:20},{x:58,y:29},{x:57,y:49},{x:52,y:60},{x:42,y:68},{x:32,y:64},{x:25,y:54},{x:21,y:39}],true);
 g.fillStyle(0xffdbb5,.7).fillEllipse(33,37,15,29);g.fillStyle(0xcf9975,.4).fillPoints([{x:54,y:34},{x:57,y:40},{x:53,y:55},{x:43,y:63},{x:49,y:51}],true);
 g.fillStyle(0x9d783e).fillPoints([{x:20,y:40},{x:17,y:28},{x:22,y:15},{x:33,y:9},{x:47,y:10},{x:59,y:18},{x:63,y:29},{x:58,y:43},{x:55,y:29},{x:48,y:23},{x:34,y:26},{x:25,y:28}],true);
 g.fillStyle(0xc6a25d).fillPoints([{x:19,y:28},{x:24,y:16},{x:35,y:10},{x:48,y:12},{x:59,y:20},{x:59,y:27},{x:49,y:22},{x:37,y:25},{x:26,y:29}],true);
 g.fillStyle(0xe6cb87).fillPoints([{x:24,y:21},{x:34,y:13},{x:47,y:14},{x:54,y:18},{x:42,y:18},{x:31,y:24}],true);
 g.lineStyle(1.5,0xf1d99a,.8).lineBetween(28,18,37,14).lineBetween(35,21,47,17);
 g.lineStyle(1.6,0x9b7948).lineBetween(27,34,34,33).lineBetween(45,33,53,35);
 for(const [x,y]of [[31,40],[49,40]]){g.fillStyle(0xffeed4).fillEllipse(x,y,10,5);g.fillStyle(0x587f94).fillEllipse(x+.3,y,4.5,5);g.fillStyle(0x334e58).fillCircle(x+.5,y+.2,1.3);g.fillStyle(0xffffe8).fillCircle(x-.5,y-1,1);g.lineStyle(.8,0x806044).lineBetween(x-4,y-2,x+3,y-2);}
 g.lineStyle(1,0xc38e6c).lineBetween(40,40,38,49).lineBetween(38,49,42,50);
 g.fillStyle(0xd99783,.25).fillEllipse(28,49,7,4).fillEllipse(53,49,6,4);
 g.lineStyle(1.4,0x9c6553).beginPath().moveTo(34,56).lineTo(39,58).lineTo(44,57).lineTo(47,55).strokePath();g.lineStyle(.9,0xf9d7b1).lineBetween(37,60,43,60);
 const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);portrait.draw(g);g.destroy();portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});return image;
}
