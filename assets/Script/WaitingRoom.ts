// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {socket_io} from "./net";
import {game} from "./game"

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaitingRoom extends cc.Component {

    @property(cc.Label)
    lab_roomid: cc.Label = null;
    @property(cc.Label)
    lab_left: cc.Label = null;
    @property(cc.Label)
    lab_right: cc.Label = null;
    @property(cc.Label)
    lab_player: cc.Label = null;

    onLoad() {
        let own_name:string = game.playerName;
        this.lab_roomid.string = '房间号:'+ game.roomNum;
        this.lab_player.string = own_name;

        //加入房间的玩家请求房间房间成员信息
        if (game.roomWaitType == 'join') {
            socket_io.emit("getRoomData",game.roomNum);
        }
        //获取房间成员信息
        socket_io.on("getRoomDataBack" ,(data) =>{
            let list = data.concat();
            list.length = 3;
            // data 是 房间内用户名数组
            for (let index = 0; index < data.length; index++) {
                const player_name = data[index];
                //判断是玩家自己
                if (data[index] == own_name) {
                    game.roomIndex = index;
                    break;
                }
            }
            //右边
            this.lab_right.string = list[(game.roomIndex + 1) % 3] || "等待加入";
            //左边
            this.lab_left.string = list[(game.roomIndex + 2) % 3] || "等待加入";

            
            if (data.length == 3) {
                cc.director.loadScene('game'); 
            }
        });

    }
    

    // update (dt) {}
}
