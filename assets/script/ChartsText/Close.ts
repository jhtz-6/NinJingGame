import { _decorator, Component, Node ,AudioSource,find} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Close')
export class Close extends Component {
    start() {

    }



    onNodeTouchStart(event: Event, customEventData: string) {
        //关闭排行榜数据
        find('Canvas/ChartsText').active = false;
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        }
    }
}


