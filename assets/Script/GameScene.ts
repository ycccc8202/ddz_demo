import { socket_io } from "./net";
import { game } from "./game";
import Poker from "./Poker";
import menu_dizhu from "./menu_dizhu";
import OwnHandCon from "./OwnHandCon";
import DipaiCon from "./DipaiCon";
import menu_play from "./menu_play";
import PokerShower from "./PokerShower";
import { config, paiTool, getAIList } from "./PaiUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Label)
    lab_left_ready: cc.Label = null;
    @property(cc.Label)
    lab_right_ready: cc.Label = null;
    @property(cc.Button)
    btn_ready: cc.Button = null;
    @property(cc.Label)
    lab_own_ready: cc.Label = null;

    @property(cc.Node)
    ready_layer: cc.Node = null;



    @property(cc.Prefab)
    prefab_poker: cc.Prefab = null;


    @property(cc.Node)
    turn_left_tip: cc.Node = null;
    @property(cc.Node)
    turn_right_tip: cc.Node = null;
    @property(cc.Node)
    turn_own_tip: cc.Node = null;

    @property(cc.Label)
    lab_left_show: cc.Label = null;
    @property(cc.Label)
    lab_right_show: cc.Label = null;
    @property(cc.Label)
    lab_own_show: cc.Label = null;

    @property(cc.Node)
    left_dizhu: cc.Node = null;
    @property(cc.Node)
    right_dizhu: cc.Node = null;
    @property(cc.Node)
    own_dizhu: cc.Node = null;

    @property(cc.Label)
    lab_left_count: cc.Label = null;
    @property(cc.Label)
    lab_right_count: cc.Label = null;


    @property(cc.Node)
    menu_dizhu: cc.Node = null;
    menu_dizhu_action: menu_dizhu = null;

    @property(cc.Node)
    menu_play: cc.Node = null;
    menu_play_action: menu_play = null;

    @property(cc.Node)
    ownHandCon: cc.Node = null;
    ownHandCon_action: OwnHandCon = null;

    @property(cc.Node)
    con_dipai: cc.Node = null;
    con_dipai_action: DipaiCon = null;


    @property(PokerShower)
    left_pockershower: PokerShower = null;
    @property(PokerShower)
    right_pockershower: PokerShower = null;
    @property(PokerShower)
    own_pockershower: PokerShower = null;



    leftIndex: number;
    rightIndex: number;
    dizhu_first: boolean = true;

    __assets = null;

    onLoad() {
        if (socket_io.socket) this.ready_layer.active = true;
        paiTool.initMap();
        this.menu_dizhu_action = this.menu_dizhu.getComponent(menu_dizhu);
        this.menu_play_action = this.menu_play.getComponent(menu_play);
        this.ownHandCon_action = this.ownHandCon.getComponent(OwnHandCon);
        this.con_dipai_action = this.con_dipai.getComponent<DipaiCon>(DipaiCon);
        //game.autoPush = location.search
        //cc.log(location);
        if (location.search.length) {
            //cc.log(location.search.split[1].split("=")[1]);
            let search_main = location.search.split("?")[1];
            let map = {};
            search_main.split("&").forEach(item => {
                let args = item.split("=");
                map[args[0]] = args[1]
            })

        }
    }
    start() {
        this.reset();
        this.initIndex();
        this.loadRes();
        this.onReceive();
        this.initView();
    }
    loadRes() {
        cc.resources.load('poker', cc.SpriteAtlas, (err, assets: cc.SpriteAtlas) => {
            //assets.addRef();
            //assets.decRef();
            //this.__assets = assets;
            let plist: cc.SpriteFrame[] = assets.getSpriteFrames();
            for (let i = 0; i < plist.length; i++) {
                let p: cc.SpriteFrame = plist[i];
                game.pokerSpriteFrameMap[p.name] = p;
            }
            cc.log("扑克资源加载完成", game.pokerSpriteFrameMap);

            //测试
            if (!socket_io.socket) {
                cc.log("刷新测试牌");
                let list = [];
                for (var i = 1; i <= 54; i++) {
                    list.push(i);
                }
                list.sort(() => 0.5 - Math.random());
                list.length = 17;
                paiTool.sortDescending(list);
                this.ownHandCon_action.updateHandPai(list);
                cc.log("原始数据:", list);
                cc.log("素材数据:", config.getSpriteFrames(list));

                let target = [54, 53, 15, 1, 12, 13, 11, 10, 9, 44, 5, 17, 4, 3];

                cc.log(getAIList(target, [37, 10, 48, 21, 33, 19]));

                //PaiUtil.getCountList_1_4(list);
                //PaiUtil.getCardPattern([1, 1, 1, 1, 1]);
                //特殊牌型
                // 3,3,3,4,4,4,5,5,5,6,6,6, |7,7,7,1
                // 3,3,3,4,4,4,5,5,5,6,6,6,7,7, 7, |8,8,8,2,2
                //let pais = [1,2];
                //let pattern = PaiUtil.getCardPattern(pais);
                //cc.log("牌: - >", pais , "\n牌型: => ",CardPattern[PaiUtil.getCardPattern(pais)]);
                this.left_pockershower.updatePokers(list);
                this.right_pockershower.updatePokers(list);
                this.own_pockershower.updatePokers(list);


            }


            //assets.decRef();

        });
    }
    initIndex() {

        this.rightIndex = (game.roomIndex + 1) % 3;
        this.leftIndex = (game.roomIndex + 2) % 3;

    }
    onReceive() {

        socket_io.on("readyGame" + game.roomNum, data => {
            if (data.roomIndex == this.leftIndex) {
                this.lab_left_ready.string = data.ready ? "准备" : "未准备";
            }
            if (data.roomIndex == this.rightIndex) {
                this.lab_right_ready.string = data.ready ? "准备" : "未准备";
            }
            if (data.roomIndex == game.roomIndex) {
                this.lab_own_ready.string = data.ready ? "准备" : "未准备";
            }
        });
        socket_io.on('startGame' + game.roomNum, data => {

            this.ready_layer.active = false;
            this.menu_dizhu.active = false;
            this.menu_play.active = false;

            //data 是菜单轮选位置
            if (data == game.roomIndex) {
                this.menu_dizhu.active = true;
            }
            //刷新轮到标志
            this.updateTurnTip(data);
            //获取手牌
            socket_io.emit('getCards', game.roomNum, game.roomIndex);

        });

        socket_io.on('getCardsBack' + game.roomNum, cards => {
            paiTool.sortDescending(cards);
            game.ownPokers = cards;
            this.ownHandCon_action.updateHandPai(cards);
        });

        //有人抢地主
        socket_io.on('qiangdizhuResult', msg => {

            let data = JSON.parse(msg);
            let qiangdizhu = data.qiangdizhuResult;
            let str = data.str;

            this.updateShowLabel(data.index, str);
        });
        //目前抢地主用户
        socket_io.on('qiangdizhuNotice', msg => {
            let data = JSON.parse(msg);
            //当前操作对象
            this.updateTurnTip(data.nextIndex);

            if (data.nextIndex == game.roomIndex) {
                this.menu_dizhu.active = true;
                this.lab_own_show.string = "";
                this.menu_dizhu_action.updateLabText(data.isFirst);
            } else {
                this.menu_dizhu.active = false;
            }
        });

        //开始出牌
        socket_io.on('startPlayerPoker', playerIndex => {
            console.log("地主为:" + playerIndex);
            //存储地主人员
            game.dizhuIndex = playerIndex;
            this.menu_dizhu.active = false;
            this.menu_play.active = false;
            this.lab_left_show.string = "";
            this.lab_right_show.string = "";
            this.lab_own_show.string = "";
            //当前操作对象
            this.updateTurnTip(playerIndex);
            this.updateDizhuFlag(playerIndex);
            this.clearAllLabShow();
            //展示底牌
            socket_io.emit('getCards', game.roomNum, 3);

            //自己是地主
            if (playerIndex == game.roomIndex) {
                //显示打牌菜单
                this.menu_play.active = true;
                this.menu_play_action.setMenu(false, false, true);
                socket_io.emit('getCards', game.roomNum, game.roomIndex);
            }
            this.updateCount();
        });
        socket_io.on('getDipaiCardsBack' + game.roomNum, cards => {
            this.con_dipai_action.updatePais(cards);
        });
        //出牌
        socket_io.on('chupai', mes => {
            let data = JSON.parse(mes);
            let playerIndex = data.playerIndex;
            let pokers = data.pokers;

            //存储上一手牌
            game.lastPokers = playerIndex == game.roomIndex ? [] : data.pokers;

            this.updateCount();
            if (playerIndex == this.leftIndex) {
                this.lab_left_show.string = "";
                this.left_pockershower.updatePokers(pokers);
            } else if (playerIndex == this.rightIndex) {
                this.lab_right_show.string = "";
                this.right_pockershower.updatePokers(pokers);
            } else {
                this.menu_play.active = false;
                this.own_pockershower.updatePokers(pokers);
                //手牌
                socket_io.emit('getCards', game.roomNum, game.roomIndex);
                //出的牌
                //self.startShowPokers(pokers, PlayerType.shoupai);
                //重置poker
                // var showPoker = self.playerHandCards.getComponent('ShowPoker');
                // showPoker.pokerAllDown();
            }

        });
        socket_io.on('buchu', mes => {
            //let data = JSON.parse(mes);
            this.updateShowLabel(+mes, "不出");
        })
        //打牌菜单回调
        socket_io.on('playerAction', msg => {
            let data = JSON.parse(msg);
            game.isFirst = data.isFirst;
            game.lastPokerType = data.lastPokerType;

            //当前操作对象
            this.updateTurnTip(data.nextIndex);
            //轮到某人出牌清理文本显示
            this.updateShowLabel(data.nextIndex, "");

            if (data.nextIndex == game.roomIndex) {

                game.checkPush();

                //要不起，自动pass
                if (game.autoPass && !data.isFirst && game.ailist.length == 0) {
                    this.lab_own_show.string = "自动...";
                    setTimeout(()=>this.menu_play_action.onBuchu(),2000);
                }
                else {
                    this.menu_play.active = true;
                    this.menu_play_action.setMenu(!data.isFirst, !data.isFirst, true);
                }
            }
        });
        socket_io.on("refreshCardsCountBack" + game.roomNum, data => {
            this.lab_right_count.string = '' + data[this.rightIndex];
            this.lab_left_count.string = '' + data[this.leftIndex];
        });
        //收到结束
        socket_io.on("gameOver", data => {
            data == this.leftIndex && (this.lab_left_show.string = "win");
            data == this.rightIndex && (this.lab_right_show.string = "win");
            data == game.roomIndex && (this.lab_own_show.string = "win");
            setTimeout(() => this.gameover(), 2000);

        });
    }

    //刷新剩余牌数
    updateCount() {
        socket_io.emit('refreshCardsCount', game.roomNum);
    }
    updateShowLabel(index: number, value: string = "") {
        //if(index == -1 || clearAll) this.clearAllLabShow();
        cc.log("更新行动文本", index, value);
        this.leftIndex == index && (this.lab_left_show.string = value);
        this.rightIndex == index && (this.lab_right_show.string = value);
        game.roomIndex == index && (this.lab_own_show.string = value);
    }

    updateDizhuFlag(index: number) {

        cc.log("更新地主图标",this.leftIndex,this.rightIndex,game.roomIndex,index);

        if(this.leftIndex == index) this.left_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("boy");
        if(this.rightIndex == index) this.right_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("boy");
        if(game.roomIndex == index) this.own_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("boy");
        
    }


    updateTurnTip(index: number) {

        this.turn_left_tip.active = this.leftIndex == index;
        this.turn_right_tip.active = this.rightIndex == index;
        this.turn_own_tip.active = game.roomIndex == index;

        //轮到哪个位置出牌，清空位置池牌
        this.leftIndex == index && this.left_pockershower.updatePokers([]);
        this.rightIndex == index && this.right_pockershower.updatePokers([]);
        game.roomIndex == index && this.own_pockershower.updatePokers([]);

    }

    initView() {
        this.menu_dizhu_action.updateLabText(this.dizhu_first);
        this.lab_left_count.string = "0";
        this.lab_right_count.string = "0";
        this.clearAllLabShow();
        this.initAllDizhuFlags();
    }

    initAllDizhuFlags() {
        this.left_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("girl");
        this.right_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("girl");
        this.own_dizhu.getComponent(cc.Sprite).spriteFrame = game.getCacheSpriteFrame("girl");
        cc.log("初始所有地主图标");
    }

    clearAllLabShow() {
        cc.log("清理行动文本");
        this.lab_own_show.string = "";
        this.lab_left_show.string = "";
        this.lab_right_show.string = "";
    }
    clearAllReady() {
        this.lab_left_ready.string = "未准备";
        this.lab_right_ready.string = "未准备";
        this.lab_own_ready.string = "未准备";
    }
    clearAllShowPoker() {

        this.left_pockershower.clear();
        this.right_pockershower.clear();
        this.own_pockershower.clear();

    }

    clearAllCount() {
        this.lab_left_count.string = "";
        this.lab_right_count.string = "";
    }

    reset() {
        this.dizhu_first = true;
    }
    onReadyClick() {
        socket_io.emit('readyGame', game.roomNum, game.roomIndex);
    }
    gameover() {
        this.ready_layer.active = true;
        game.lastPokers = [];
        game.tishi_index = 0;
        this.clearAllLabShow();
        this.clearAllReady();
        this.clearAllShowPoker();
        this.clearAllCount();
        this.initAllDizhuFlags();
    }
    // update (dt) {}
}
