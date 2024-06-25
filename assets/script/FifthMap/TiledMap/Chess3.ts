import { _decorator, Component, Node, AudioSource, find ,Button} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chess3')
export class Chess3 extends Component {
    start() {

    }
    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);
    }
}


