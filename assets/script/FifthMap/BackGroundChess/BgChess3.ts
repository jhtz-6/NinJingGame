import { _decorator, Component, Node, AudioSource, TouchEventType, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgChess3')
export class BgChess3 extends Component {
    start() {
        this.node.active = false;
        this.node.on(Node.EventType.TOUCH_START, this.onNodeTouchStart, this); // 添加触摸开始事件监听
    }

    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);


    }
}


