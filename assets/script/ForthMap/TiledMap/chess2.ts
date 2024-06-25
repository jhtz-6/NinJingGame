import { _decorator, Component, Node, AudioSource, Button, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chess2')
export class chess2 extends Component {

    start() {
    }
    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);
    }
}


