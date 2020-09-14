
import { connect } from "socket.io-client"

export var socket_io = {
    uri: "http://192.168.31.224:3000",
    socket: null,
    connect() {
        this.socket = connect(this.uri);

        this.on("connect", (e) => {
            cc.log("socket success!", (<SocketIOClient.Socket>this.socket).io.uri);
            // (<SocketIOClient.Socket>this.socket).io.uri
        })
        this.on("disconnect", () => {
            cc.log("socket disconnect!");
        }, this)

        this.on("connect_error", (e) => {
            cc.log("socket connect_error!");
        }, this)

        // let ws: WebSocket = new WebSocket("ws://192.168.31.224:3000/socket.io/?transport=websocket");
        // ws.onopen = function (event) {
        //     console.log("Send Text WS was opened.");
        // };
        // ws.onmessage = function (event) {
        //     console.log("response text msg: " + event.data);
        // };
        // ws.onerror = function (event) {
        //     console.log("Send Text fired an error");
        // };
        // ws.onclose = function (event) {
        //     console.log("WebSocket instance closed.");
        // };
    },
    on(type: string, callback: Function) {
        if (this.socket)
            this.socket.on(type, arg => {
                cc.log(`收到消息:${type} ==> ${arg ? JSON.stringify(arg) : '无参数'}`);
                callback && callback(arg);
            })
    }
    ,
    emit(type: string, ...arg: any[]) {
        if (this.socket) {
            cc.log(`发送消息:${type} ==> ${arg}`);
            this.socket.emit(type, ...arg);
        }
    }
}
