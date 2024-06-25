import { _decorator, Component, Node, AudioSource, find ,Button} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chess10')
export class Chess10 extends Component {
    start() {
        // 禁用按钮点击事件
        const button = this.node.getComponent(Button);
        button.interactable = false;
    }


    onNodeTouchStart(event: Event, customEventData: string) {
        find('Canvas/chessManager').getComponent('chessManager').onNodeTouchStart(this.node);

    }
}

