// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Poker from "./Poker";
import { config } from "./PaiUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PokerShower extends cc.Component {

    @property(cc.Prefab)
    prefab_poker:cc.Prefab = null;

    start () {

    }
    updatePokers(pais){
        this.clear();
        for(let pai of pais){
            let poker_node = cc.instantiate(this.prefab_poker);
            let poker_action = poker_node.getComponent<Poker>(Poker)
            this.node.addChild(poker_node);
            poker_action.init(config.getCard(pai));
        }
    }
    clear(){
        this.node.removeAllChildren();
    }
    // update (dt) {}
}
