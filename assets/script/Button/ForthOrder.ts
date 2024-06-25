import { _decorator, Component, Node ,find,AudioSource,Button} from 'cc';
const { ccclass, property } = _decorator;
import {chessManager} from "../chessManager";
import globalVariables from "../GlobalVariables";

@ccclass('ForthOrder')
export class ForthOrder extends Component {

    onLoad() {
        //默认四阶
        chessManager.instance.handlerClickRequest.setColumnNumber(4);
    }


    onNodeTouchStart(event: Event, customEventData: string) {
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        } else {
            console.error("No AudioSource or clip found on the node!");
        }
        //设置四阶参数
        chessManager.instance.handlerClickRequest.setColumnNumber(4);
        chessManager.instance.handlerClickRequest.setBoards(undefined);
        let FifthMapNode = find('Canvas/FifthMap');
        FifthMapNode.active = false;

        let ForthMapNode = find('Canvas/ForthMap');
        ForthMapNode.active = true;

        //如果是联机的话 需要把对方的棋盘也更改掉
        if(globalVariables.gameType != "SINGLE"){
            chessManager.instance.changeColumnNumber();
        }

    }

    public static disabledButton(){
        const buttonNode = find('Canvas/Button/ForthOrder').getComponent(Button);
        if(buttonNode.interactable){
            buttonNode.interactable = false;
        }
    }

    public static activeButton(){
        const buttonNode = find('Canvas/Button/ForthOrder').getComponent(Button);
        if(!buttonNode.interactable){
            buttonNode.interactable = true;
        }
    }
}


