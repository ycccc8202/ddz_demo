// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Poker from "./Poker";
import { game, scripts } from "./game";
import { config } from "./PaiUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OwnHandCon extends cc.Component {
    @property(cc.Node)
    handPai:cc.Node = null;
    @property(cc.Prefab)
    prefab_poker:cc.Prefab = null;

    pokers:Poker[];
    select_startIndex:number;
    select_pokers_temp = [];//临时选择的牌

    onLoad(){
        this.handPai.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.handPai.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.handPai.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.handPai.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        scripts.own_hand = this;
    }
    updateHandPai(pais){ 
        this.clear();
        for(let i = 0 ; i < pais.length;i++){
            let pai = pais[i];
            let poker:Poker = cc.instantiate(this.prefab_poker).getComponent<Poker>(Poker);
            poker.canTouch = true;
            poker.node.parent = this.handPai;
            poker.init(config.getCard(pai));
            poker.index = i;
            this.pokers.push(poker);
        }
    }
    private onTouchStart(e:cc.Event.EventTouch){
        let node:cc.Node = e.target as cc.Node;
        if(node.name != "prefab_poker") return;
        let poker:Poker = node.getComponent<Poker>(Poker);
        poker.select();
        this.select_startIndex = poker.index;
        this.select_pokers_temp = [poker];
    }
    private onTouchEnd(){
        this.clearSelectPokers();
        this.pokersSelectMove();
    }

    private onTouchMove(e: cc.Event.EventTouch) {
        let space = this.handPai.convertToNodeSpaceAR(e.touch.getLocation());
            let touchIndex = -1;
            for (let i = this.pokers.length -1; i >= 0; i--) {
                let node = this.pokers[i].node;
                if(node.getBoundingBox().contains(space)){
                    touchIndex = i;
                    break;
                }
            }
            if (touchIndex > -1) {
                if (this.select_startIndex < touchIndex) {
                    this.selectPokers(this.select_startIndex, touchIndex);
                } else {
                    this.selectPokers(touchIndex, this.select_startIndex);
                }
            }
    }
    private selectPokers(start:number,end:number){
        this.select_pokers_temp = [];
        for (let i = 0; i < this.pokers.length; i++) {
            let poker: Poker = this.pokers[i];
            if (i < start || i > end) {
                poker.unselect();
            } else {
                poker.select();
                this.select_pokers_temp.push(poker);
            }
        }
    }
    private pokersSelectMove(){
        for (let i = 0; i < this.select_pokers_temp.length; i++) {
            let poker: Poker = this.select_pokers_temp[i];
            poker.move();
        }
    }
    //清理高亮
    private clearSelectPokers() {
        for (let i = 0; i < this.pokers.length; i++) {
            let poker: Poker = this.pokers[i];
            poker.unselect();
        }
    }
    //获取所有需要打出的牌
    getAllPlayPokers(){
        let pokers = [];
        for (let i = 0; i < this.pokers.length; i++) {
            let poker: Poker = this.pokers[i];
            if(poker.isMoveUp)pokers.push(poker);
        }
        return pokers;
    }
    //移出一些牌
    moveUpPokers(pais:number[]){
        for (let i = 0; i < this.pokers.length; i++) {
            let poker: Poker = this.pokers[i];
            poker.reset();
            if(pais && ~pais.indexOf(poker.card.card)){
                poker.moveUp();
            }
        }


    }

    clear(){
        this.handPai.removeAllChildren();
        this.pokers = [];
    }
    // update (dt) {}
}
