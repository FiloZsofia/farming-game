import {expect,it} from 'vitest';
import {snapshot,validSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {prepareNoahTest,upgradeNoahStick,mixNoahExtract,noahLetter,type NoahTestConfig} from './noah-test-story';
// Fixture values exercise the configurable model; they are not accepted game balance.
const config:NoahTestConfig={thyme:2,plantain:2,concentrate:1,shipment:4,ingredient:1,ingredientName:'Vörösfenyőgyanta',wood:25,scrap:14,gold:310};
const fresh=()=>{const s=snapshot({x:250,y:194},createClock(1),createGarden());s.farmName='Próba farm';return s;};
it('prepares every checkpoint on an independent snapshot without changing a normal farm',()=>{
 const source=fresh(),original=structuredClone(source);
 for(const checkpoint of ['letter','simon','forest','mix'] as const){const test=prepareNoahTest(source,config,checkpoint);expect(validSnapshot(test.snapshot)).toBe(true);expect(test.snapshot.travel.forest).toMatchObject({sent:true,examined:true,sample:true});expect(test.snapshot.travel.research.microscopeDelivered).toBe(true);}
 expect(source).toEqual(original);
});
it('charges the stick upgrade once and leaves missing materials untouched',()=>{
 const t=prepareNoahTest(fresh(),config,'letter');t.state.letter=true;const before=structuredClone(t.snapshot);const result=upgradeNoahStick(t.snapshot,t.state,config)!;expect(result.state.upgraded).toBe(true);expect(result.snapshot.clearing.wood).toBe(before.clearing.wood-config.wood);expect(upgradeNoahStick(result.snapshot,result.state,config)).toBeNull();expect(t.snapshot).toEqual(before);
 t.snapshot.economy.gold=0;expect(upgradeNoahStick(t.snapshot,t.state,config)).toBeNull();
});
it('requires the letter and all forest ingredients before consuming a mixture',()=>{
 const unopened=prepareNoahTest(fresh(),config,'letter');expect(mixNoahExtract(unopened.snapshot,unopened.state,config)).toBeNull();
 const ready=prepareNoahTest(fresh(),config,'mix'),original=structuredClone(ready.snapshot);
 expect(mixNoahExtract(ready.snapshot,{...ready.state,ingredient:0},config)).toBeNull();
 const result=mixNoahExtract(ready.snapshot,ready.state,config)!;expect(result.state.concentrate).toBe(config.shipment-config.concentrate);expect(result.state.ingredient).toBe(0);expect(result.snapshot.travel.estate.produce.thyme).toBe(0);expect(ready.snapshot).toEqual(original);
});

it('blocks entry into the unreleased south without trapping legacy saves already there',async()=>{
 const {closedSouthEntry}=await import('./noah-test-story');
 expect(closedSouthEntry(-444,1300,{x:-444,y:1294})).toBe(true);
 expect(closedSouthEntry(-1,1320,{x:1,y:1320})).toBe(true);
 expect(closedSouthEntry(-444,1290,{x:-444,y:1320})).toBe(false);
 expect(closedSouthEntry(100,1320,{x:100,y:1310})).toBe(false);
});

it('retains the author-approved warning without rewriting the disputed phrase',()=>{expect(noahLetter).toContain('A város környéki méhészetek közül többnél gombás fertőzést találtak a fiasításban. Nagy rajtunk a nyomás, hogy a hatóanyagot minél előbb biztosra fejlesszük, mert már egész méhcsaládok pusztultak ki, és a továbbterjedés felszámolásában néhányan a megmaradt családok elpusztítását gondolják helyesnek, ez azonban még nagyobb kárt okozna a természet egyensúlyában.');});
