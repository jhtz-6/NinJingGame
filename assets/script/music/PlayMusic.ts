import { _decorator, Component, Node ,find} from 'cc';
const { ccclass, property } = _decorator;
import {background} from "../background";
import GlobalVariables from "db://assets/script/GlobalVariables";

@ccclass('PlayMusic')
export class PlayMusic extends Component {
    start() {
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        background.pauseBgMusic();
        //隐藏play 展示pause
        find('Canvas/background/Pause').active = true;
        this.node.active = false;
    }
}


