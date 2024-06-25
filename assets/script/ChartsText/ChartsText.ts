import { _decorator, Component, Node ,Layers,RichText,Layout ,Label,UITransform,AudioSource } from 'cc';
import GlobalVariables from "db://assets/script/GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass('ChartsText')
export class ChartsText extends Component {
    start() {
    }
    onLoad(){
        this.node.active = false;

    }



}


