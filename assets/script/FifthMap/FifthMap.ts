import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FifthMap')
export class FifthMap extends Component {
    start() {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


