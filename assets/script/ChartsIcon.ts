import { _decorator, Component, Node ,find,Label,AudioSource} from 'cc';
import {background} from "db://assets/script/background";
import GlobalVariables from "db://assets/script/GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass('ChartsIcon')
export class ChartsIcon extends Component {

    private numToName: Map<string, string> = new Map();
    start() {
        this.numToName.set("1","First");
        this.numToName.set("2","Second");
        this.numToName.set("3","Third");
        this.numToName.set("4","Fourth");
        this.numToName.set("5","Fifth");
        this.numToName.set("6","Sixth");
        this.numToName.set("7","Seventh");
        this.numToName.set("8","Eighth");
        this.numToName.set("9","Ninth");
        this.numToName.set("10","Tenth");

    }



    onNodeTouchStart(event: Event, customEventData: string) {
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        }
        //获取排行榜数据
        var rankingListXhr = new XMLHttpRequest();
        // 定义请求完成的回调函数
        rankingListXhr.onload = () =>{
            if (rankingListXhr.status === 200) {
                // 请求成功，处理响应数据
                console.log(rankingListXhr.responseText);
                let chartsTextNode = find('Canvas/ChartsText');
                chartsTextNode.active = true;
                let response = JSON.parse(rankingListXhr.responseText);
                let rankList = response.data;
                for(var i = 0; i<rankList.length;i++){
                    let rankDTO = rankList[i];
                    if (rankDTO.nickName.length < 4) {
                        rankDTO.nickName = rankDTO.nickName.padEnd(9, " ");
                    }else if(rankDTO.nickName.length > 4){
                        rankDTO.nickName = rankDTO.nickName.substr(0,4)+"..";
                    }
                    if(rankDTO.wins == null){
                        rankDTO.wins = 0;
                    }
                    find('Canvas/ChartsText/'+this.numToName.get((i+1)+"")).getComponent(Label).string =" "+
                        (i+1)+"       "+rankDTO.nickName+"       "+rankDTO.totalGames
                        +"             "+rankDTO.wins+"   ";
                }
            }
        };
        rankingListXhr.onerror = function () {
            //获取排行榜数据失败
            wx.showToast({
                title: '获取排行榜数据失败,请重新获取',
                icon: '通知',
                duration: 2000
            })
        };
        // 设置请求方法和 URL
        rankingListXhr.open('GET', GlobalVariables.httpPrefix+'://' + GlobalVariables.serverIp + ':'
            +GlobalVariables.httpPort+'/ningJinGame/zouDing/getRankingList', true);
        rankingListXhr.send();
    }

}


