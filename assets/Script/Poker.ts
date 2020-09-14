// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import  { HUASE, config } from "./PaiUtil";
import { game } from "./game";
import CardData from "./CardData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Poker extends cc.Component {
    grade: number;
    huase: HUASE;
    num: number;
    card:CardData;
    canTouch: boolean = false;
    index:number;//序号
    defaultSpriteFrame:cc.SpriteFrame;
    isMoveUp:boolean;
    onLoad() {
        if (this.canTouch) {
            this.node.on(cc.Node.EventType.TOUCH_START, () => null);
        }
        this.defaultSpriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
    }
    //初始化数据 add之后进行牌的初始化
    init(card: CardData = null) {
        this.card = card;
        let sp = this.node.getComponent(cc.Sprite);
        let frame ;
        if (card == null) {
            frame = this.defaultSpriteFrame;
        } else {
            frame = game.pokerSpriteFrameMap[card.spriteFrame];
        }
        if (sp) sp.spriteFrame = frame;
    }
    //选中
    select(){
        this.node.color = cc.Color.BLACK.fromHEX("#808080");
    }
    //取消选中
    unselect(){
        this.node.color = cc.Color.BLACK.fromHEX("#FFFFFF");
    }

    move() {
        this.isMoveUp ? this.moveBack() : this.moveUp();
    }
    moveUp() {
        this.isMoveUp = true;
        this.node.y = config.move_dis;
    }
    moveBack() {
        this.isMoveUp = false; 
        this.node.y = 0;
    }
    reset(){
        this.moveBack();
    }

    // update (dt) {}
}
