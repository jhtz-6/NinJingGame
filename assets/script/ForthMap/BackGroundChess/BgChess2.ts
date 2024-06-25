import { _decorator, Component, Node, AudioSource, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgChess2')
export class BgChess2 extends Component {
    start() {
        this.node.active = false;
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);


    }
}


