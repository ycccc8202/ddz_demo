import { game, scripts } from "./game";
import { socket_io } from "./net";
import Poker from "./Poker";
import { DDZ_POKER_TYPE, paiTool, getAIList, config } from "./PaiUtil";
import OwnHandCon from "./OwnHandCon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class menu_play extends cc.Component {


    @property(cc.Node)
    btn_buchu: cc.Node = null;
    @property(OwnHandCon)
    own_hand: OwnHandCon = null;
    @property(cc.Node)
    btn_tishi: cc.Node = null;
    @property(cc.Node)
    btn_chupai: cc.Node = null;
    // onLoad () {}
    onBuchu() {

        // if (game.isFirst) {
        //     return;
        // }
        socket_io.emit('buchu', JSON.stringify({
            playerIndex: game.roomIndex,
            roomNum: game.roomNum
        }));
        this.node.active = false;
    }
    onTishi() {
        if(game.ailist.length){
            let pais = game.ailist[game.tishi_index++];
            this.own_hand.moveUpPokers(pais);
            game.tishi_index = game.tishi_index % game.ailist.length;
        }
    }
    onChuPai() {

        let playPokers = scripts.own_hand.getAllPlayPokers();

        if (!playPokers || !playPokers.length) return;
        //目前只能单牌
        let thisType = 0;
        let pais: number[] = [];
        for (let i = 0; i < playPokers.length; i++) {
            pais.push(playPokers[i].card.card);
        }
        let partern = paiTool.getCardPattern(pais);

        if (partern.type == DDZ_POKER_TYPE.DDZ_PASS) {
            cc.log("牌型不合法", pais, "\n", paiTool.paisToGrades(pais));
            return;
        }
        //存在上一手牌进行比较
        if (game.lastPokers.length) {

            let lastPartern = paiTool.getCardPattern(game.lastPokers);

            let result = paiTool.compare(lastPartern, partern);

            if (result === partern) {

            } else {
                cc.log("要不起！");
                return;
            }
        }
        socket_io.emit('chupai', JSON.stringify(
            {
                pokers: partern.pais,
                cardsType: thisType,
                roomNum: game.roomNum,
                playerIndex: game.roomIndex
            }
        ));
    }
    setBuchu(first: boolean) {
        this.btn_buchu.active = !first;
    }
    setTishiActive(boo:boolean){
        this.btn_tishi.active = boo;
    }
    setMenu(buchu,tishi,chupai){
        this.btn_buchu.active = buchu;
        this.btn_tishi.active = tishi;
        this.btn_chupai.active = chupai;
    }
}
