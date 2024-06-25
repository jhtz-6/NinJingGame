import { _decorator, Component, Node,  AudioClip, AudioSource, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgChess4')
export class BgChess4 extends Component {
    start() {
        this.node.active = false;
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);


    }
}


