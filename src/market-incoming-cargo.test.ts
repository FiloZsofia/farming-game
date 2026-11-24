import {describe,it,expect} from 'vitest';
import {createLivestock} from './livestock';
import {incomingMarketCargo} from './market-incoming-cargo';
describe('incoming truck cargo',()=>{
 it('shows each due feed sack and one hen basket for each destination, without mutating the save',()=>{const s=createLivestock(10);s.feedOrders=[{id:1,count:10,dueDay:10},{id:2,count:10,dueDay:10},{id:3,count:10,dueDay:11},{id:4,count:10,dueDay:9,deliveredDay:9,drop:{x:82,y:504}}];s.orders=[{id:5,penId:1,variety:'cream',dueDay:10},{id:6,penId:1,variety:'chestnut',dueDay:10},{id:7,penId:2,variety:'speckled',dueDay:10}];const before=structuredClone(s);expect(incomingMarketCargo(s,10)).toEqual([{kind:'feed',id:'feed:1',count:10},{kind:'feed',id:'feed:2',count:10},{kind:'hens',id:'hens:1',count:2},{kind:'hens',id:'hens:2',count:1}]);expect(s).toEqual(before);});
 it('removes a sack or a whole carried hen basket from the bed while Mara unloads',()=>{const s=createLivestock(10);s.feedOrders=[{id:1,count:10,dueDay:10}];s.orders=[{id:2,penId:1,variety:'cream',dueDay:10},{id:3,penId:1,variety:'chestnut',dueDay:10}];expect(incomingMarketCargo(s,10,[1])).toEqual([{kind:'hens',id:'hens:1',count:2}]);expect(incomingMarketCargo(s,10,[2,3])).toEqual([{kind:'feed',id:'feed:1',count:10}]);expect(incomingMarketCargo(s,10,[1,2,3])).toEqual([]);});
 it('keeps an ordinary empty trip empty',()=>{expect(incomingMarketCargo(undefined,10)).toEqual([]);expect(incomingMarketCargo(createLivestock(10),10)).toEqual([]);});
});
