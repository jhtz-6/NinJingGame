import { _decorator, Component, Node,UITransform ,find} from 'cc';
import GlobalVariables from '../GlobalVariables';
const { ccclass, property } = _decorator;

@ccclass('BgSprite')
export class BgSprite extends Component {


    onLoad(){
        if(GlobalVariables.screenWidth == 0){
            return;
        }
        this.node.getComponent(UITransform).setContentSize(GlobalVariables.screenWidth,GlobalVariables.screenHeight);
        let popupMaskNode = find('Canvas/PopupMask');
        popupMaskNode.getComponent(UITransform).setContentSize(GlobalVariables.screenWidth,GlobalVariables.screenHeight);

    }



}


