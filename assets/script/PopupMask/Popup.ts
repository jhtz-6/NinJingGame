import { _decorator, Component, Node, Label, Button,Graphics  ,UITransform,Color ,EventTouch ,Collider } from 'cc';
import GlobalVariables from "db://assets/script/GlobalVariables";
const { ccclass, property } = _decorator;


@ccclass('Popup')
export class Popup extends Component {
    @property(Node)
    popupNode: Node = null; // 弹窗节点

    @property(Node)
    titleNode: Node = null; // 标题节点

    @property(Node)
    contentNode: Node = null; // 内容节点

    @property(Node)
    btnConfirmNode: Node = null; // 确认按钮节点

    @property(Node)
    btnCancelNode: Node = null; // 取消按钮节点
    @property(Node)
    popupMaskNode: Node = null; // 取消按钮节点


    onLoad(){
        this.popupNode =this.node;
        this.titleNode = this.node.getChildByName('title');
        this.contentNode= this.node.getChildByName('content');
        this.btnConfirmNode= this.node.getChildByName('btnConfirm');
        this.btnCancelNode= this.node.getChildByName('btnCancel');
        this.popupMaskNode =  this.node.getParent();
        // 监听确认按钮的点击事件
        this.popupNode.getChildByName("btnConfirm").on(Node.EventType.TOUCH_END, this.onConfirmButtonClick, this);
        // 监听取消按钮的点击事件
        this.popupNode.getChildByName("btnCancel").on(Node.EventType.TOUCH_END, this.onCancelButtonClick, this);
        this.hidePopup();
    }

    // 设置弹窗的标题和内容
    setPopup(title: string, content: string) {
        // 设置标题文本
        this.titleNode.getComponent(Label).string = title;
        // 设置内容文本
        this.contentNode.getComponent(Label).string = content;
    }

    // 显示弹窗
    onlyConfirm() {
        this.btnCancelNode.active = false;
        this.btnConfirmNode.active = true;
        this.popupNode.active = true;
        this.popupMaskNode.active = true;
    }

    // 显示弹窗但没有按钮
    onlyConfirmWithNoButton() {
        this.btnCancelNode.active = false;
        this.btnConfirmNode.active = false;
        this.popupNode.active = true;
        this.popupMaskNode.active = true;
    }

    // 显示弹窗
    showPopup() {
        this.btnCancelNode.active = true;
        this.btnConfirmNode.active = true;
        this.popupNode.active = true;
        this.popupMaskNode.active = true;
    }

    // 隐藏弹窗
    hidePopup() {
        this.popupNode.active = false;
        this.popupMaskNode.active = false;
    }

    // 确认按钮点击事件处理函数
    onConfirmButtonClick() {
        // 执行确认操作
        console.log('Confirm button clicked');
        // 隐藏弹窗
        this.hidePopup();
    }

    // 取消按钮点击事件处理函数
    onCancelButtonClick() {
        // 执行取消操作
        console.log('Cancel button clicked');
        // 隐藏弹窗
        this.hidePopup();
    }
}


