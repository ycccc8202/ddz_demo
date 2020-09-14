// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Poker from "./Poker";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DipaiCon extends cc.Component {
    @property(Poker)
    dipai_1:Poker = null;
    @property(Poker)
    dipai_2:Poker = null;
    @property(Poker)
    dipai_3:Poker = null;

    updatePais(cards:number[]){
        this.dipai_1.init(cards[0]);
        this.dipai_2.init(cards[1]);
        this.dipai_3.init(cards[2]);
    }
    reset(){
        this.dipai_1.init(0);
        this.dipai_2.init(0);
        this.dipai_3.init(0);
    }

}
