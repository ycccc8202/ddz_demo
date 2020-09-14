// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    start() {

        console.time()
        let arr = [];
        for(let i = 0 ; i < 1000;i++){
            arr.push(1000-i);
        }
        //cc.log(this.combination([],[1,2,3,4,5],3,[],0,0));
        //this.quickSort(arr, 0, arr.length-1);
        arr.sort((a,b)=>a -b)
        cc.log(arr);
        console.timeEnd();


        // 3,5,2,1,7
        // 1,5,2,O,7
        // 1,O,2,5,7

    }
    //快排
    quickSort(s, l, r) {
        
        if (l < r) {
            let i = l, j = r;
            let base = s[i];
            //cc.log("排列----->1");
            while (i < j) {

                while (i < j && s[j] >= base) j--;
                if (i < j) s[i++] = s[j];
                //cc.log(s);
                while (i < j && s[i] < base) i++;
                if (i < j) s[j--] = s[i];
                //cc.log(s);
            }
            s[i] = base;
            //cc.log("排列----->2");
            //cc.log(i,s.toString());
            //cc.log(l,i-1 ,"-", i+1,r);
            this.quickSort(s, l, i - 1);
            this.quickSort(s, i + 1, r);
        }
        //return arr;
    }

    //组合
    combination(results, arr, count, temp, level, start) {

        // for (let i = 0; i < arr.length; i++) {
        //     for (let j = i+1; j < arr.length; j++) {
        //         for (let k = j+1; k < arr.length; k++) {
        //             cc.log(i,j,k);
        //         }
        //     }
        // }
        level++;

        for (let i = start; i < arr.length; i++) {
            temp[level - 1] = i;
            if (level != count) {
                this.combination(results, arr, count, temp, level, i + 1);
            } else {
                let result = [];
                for (let k = 0; k < count; k++) {
                    result.push(temp[k])
                }
                results.push(result);
            }
        }

        return results;
    }
    // update (dt) {}
}
