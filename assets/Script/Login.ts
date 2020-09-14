//import net from "./NetWork";
import {game, loading} from "./game"
import { socket_io } from "./net";
const { ccclass, property } = cc._decorator;
@ccclass
export class Login extends cc.Component {

    @property(cc.Node)
    btn_create: cc.Node = null;
    @property(cc.Node)
    btn_join: cc.Node = null;

    @property(cc.EditBox)
    input_room: cc.EditBox = null;
    @property(cc.EditBox)
    input_user: cc.EditBox = null;

    onLoad() {
        socket_io.connect();
        this.schedule(()=>{cc.log("OKOK")},1,3);
    }
    //io = window["io"];

    start() {
        this.btn_create.on(cc.Node.EventType.TOUCH_END, this.clickHandler, this);
        this.btn_join.on(cc.Node.EventType.TOUCH_END, this.clickHandler, this);

        //预加载waitingroom场景
        cc.director.preloadScene('waitingroom',
        (completedCount: number, totalCount: number, item: any) =>{ // onprogress
            cc.log('progress:' , completedCount , totalCount , item);
        },
        (error:Error) =>{ // onloaded
            cc.log('onloaded :' , error ? error :"complete");
        });
    }
    clickHandler(e: cc.Event.EventTouch) {

        let room = this.input_room.string;
        let user = this.input_user.string;
        if (room == "" || user == "") {
            alert("用户名和房间名不能为空!");
            return;
        }
        switch (e.currentTarget) {
            case this.btn_create:
                socket_io.on('creatRoomReturn', (flag) => {
                    if (flag) {
                        game.playerName = user;
                        game.roomNum = room;
                        // 跳转房间等候场景
                        //cc.director.loadScene('waitingroom');
                        this.node.addChild(loading.view_prefab);
                    }
                    else {
                        alert('房间已存在您可以加入游戏');
                    }
                });
                socket_io.emit('creatRoom', room, user);
                break;
            case this.btn_join:
                socket_io.on('joinRoomBack', (flag) => {
                    if (flag) {
                        game.playerName = user;
                        game.roomNum = room;
                        game.roomWaitType = "join"
                        // 跳转房间等候场景
                        cc.director.loadScene('waitingroom');
                    }else{
                        alert('房间无法加入');
                    }
                });
                socket_io.emit('joinRoom', room, user);

                break;
        }
    }
}

