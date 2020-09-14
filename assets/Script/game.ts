import { getAIList } from "./PaiUtil";

export var game = {
    playerName: '无名玩家',  //玩家名称
    roomWaitType: 'create',
    roomNum: "0",   //房间号
    allPokers: [],  //所有牌
    //selectPokers: [],    //选择的牌
    ownPokers:[],
    isFirst: true,       //是否为第一手牌
    lastPokerType: 14,
    lastPokers: [],
    dizhuIndex: -1, //地主是谁
    roomIndex: -1,  //当前玩家座位号 (0,1,2);
    //存储spriteFrame
    pokerSpriteFrameMap:{},
    tishi_index : 0,
    ailist:[],//提示出牌列表
    autoPass:1,//自动要不起

    //判断是否能出牌,同时更新提示列表
    checkPush(){
        if(this.lastPokers.length) this.ailist = getAIList(game.ownPokers, game.lastPokers);
        game.tishi_index = 0;
        return this.ailist.length > 0;
    }
    ,
    getCacheSpriteFrame(name:string):cc.SpriteFrame{
        let asset = null;
        cc.assetManager.assets.forEach((value,key) =>{
            if(value.name == name) {
                asset = value;
                return;
            }
        })
        return asset;
    }
};
export var scripts = {
    own_hand:null,
}
export var loading = {
    view_prefab:null, // 进度面板
}


