import { _decorator, Component, Node, AudioSource, Button, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chess4')
export class chess4 extends Component {

    start() {
    }
    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);

    }
}


