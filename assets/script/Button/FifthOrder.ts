import { _decorator, Component, Node ,find,Vec3,AudioSource,Button} from 'cc';
const { ccclass, property } = _decorator;
import {chessManager} from "../chessManager";
import globalVariables from "../GlobalVariables";

@ccclass('FifthOrder')
export class FifthOrder extends Component {
    start() {
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        } else {
            console.error("No AudioSource or clip found on the node!");
        }
        //设置五阶参数
        chessManager.instance.handlerClickRequest.setColumnNumber(5);
        chessManager.instance.handlerClickRequest.setBoards(undefined);

        find('Canvas/ForthMap').active = false;

        find('Canvas/FifthMap').active = true;

        //如果是联机的话 需要把对方的棋盘也更改掉
        if(globalVariables.gameType != "SINGLE"){
            chessManager.instance.changeColumnNumber();
        }

    }
    public static disabledButton(){
        const buttonNode = find('Canvas/Button/FifthOrder').getComponent(Button);
        if(buttonNode.interactable){
            buttonNode.interactable = false;
        }
    }

    public static activeButton(){
        const buttonNode = find('Canvas/Button/FifthOrder').getComponent(Button);
        if(!buttonNode.interactable){
            buttonNode.interactable = true;
        }
    }

}


