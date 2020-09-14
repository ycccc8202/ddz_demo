// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { game } from "./game";
import { socket_io } from "./net";

const {ccclass, property} = cc._decorator;

@ccclass
export default class menu_dizhu extends cc.Component {

    @property(cc.Label)
    lab_nocatch:cc.Label = null;
    @property(cc.Label)
    lab_catch:cc.Label = null;

    updateLabText(first){
        if (first) {
            this.lab_nocatch.string = "不叫"
            this.lab_catch.string = "叫地主"
        }else{
            this.lab_nocatch.string = "不抢"
            this.lab_catch.string = "抢地主"
        }
    }
    onNoCatchClick(){
        let mes = {playerIndex:game.roomIndex,roomNum: game.roomNum,qiangdizhu:false};
        socket_io.emit('qiangdizhu', JSON.stringify(mes));
        this.node.active = false;
    }
    onCatchClick(){
        let mes = {playerIndex:game.roomIndex,roomNum: game.roomNum,qiangdizhu:true};
        socket_io.emit('qiangdizhu',   JSON.stringify(mes));
        this.node.active = false;
    }
    // update (dt) {}
}
