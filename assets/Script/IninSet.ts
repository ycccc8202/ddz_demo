import { loading } from "./game";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    loading_prefab:cc.Prefab = null;
    start () {
        loading.view_prefab = cc.instantiate(this.loading_prefab);
    }
    // update (dt) {}
}
