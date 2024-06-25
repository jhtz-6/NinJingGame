import { _decorator, Component, Node,find } from 'cc';
import {background} from "db://assets/script/background";
const { ccclass, property } = _decorator;

@ccclass('PauseMusic')
export class PauseMusic extends Component {
    start() {
        this.node.active = false;
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        background.startBgMusic();
        //隐藏play 展示pause
        find('Canvas/background/Play').active = true;
        this.node.active = false;
    }
}


