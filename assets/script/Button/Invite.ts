import { _decorator, Component, Node ,find,AudioSource,Button} from 'cc';
const { ccclass, property } = _decorator;
import 'minigame-api-typings';
import GlobalVariables from "db://assets/script/GlobalVariables";
import {chessManager} from "db://assets/script/chessManager";
import XmlHttpManager from "db://assets/script/XmlHttpManager";
import globalVariables from "db://assets/script/GlobalVariables";


@ccclass('Invite')
export class Invite extends Component {
    start() {

    }


    onNodeTouchStart(event: Event, customEventData: string) {
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        } else {
            console.error("No AudioSource or clip found on the node!");
        }
        //获取邀请码
        const xmlHttpManager = new XmlHttpManager();
         // 调用 queryInvitationCode 方法
        xmlHttpManager.queryInvitationCode((result: string | null) => {
            if (result !== null) {
                globalVariables.needRestart = false;
                // 处理成功响应
                console.log("invitationCode如下");
                if(!result.success){
                    wx.showModal({
                        title: '错误',
                        content: "邀请失败:"+result.errorMsg+",请重新邀请",
                        showCancel:false
                    })
                    return;
                }
                console.log(result.data);
                wx.shareAppMessage( {
                    // 转发标题, 没有则默认使用小游戏的昵称
                    title: "朋友棋 不客气",
                    // 图片链接，
                    //imageUrl: "",
                    query: 'shareMsg='+'invitationCode='+result.data
                });
            } else {
                // 处理错误响应
            }
        });

    }

    public static disabledButton(){
        const buttonNode = find('Canvas/Button/Invite').getComponent(Button);
        if(buttonNode.interactable){
            buttonNode.interactable = false;
        }
    }

    public static activeButton(){
        const buttonNode = find('Canvas/Button/Invite').getComponent(Button);
        if(!buttonNode.interactable){
            buttonNode.interactable = true;
        }
    }


}


