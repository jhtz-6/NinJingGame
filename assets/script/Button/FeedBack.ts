import { _decorator, Component, Node ,AudioSource} from 'cc';
import {chessManager} from "db://assets/script/chessManager";
import globalVariables from "db://assets/script/GlobalVariables";
import GlobalVariables from "db://assets/script/GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass('FeedBack')
export class FeedBack extends Component {
    start() {

    }



    onNodeTouchStart(event: Event, customEventData: string) {
        const audioSource = this.node.getComponent(AudioSource);
        if (audioSource && audioSource.clip) {
            audioSource.playOneShot(audioSource.clip, 1);
        } else {
            console.error("No AudioSource or clip found on the node!");
        }
        wx.showModal({
            title: '反馈',
            confirmText:'提交',
            editable:true,
            placeholderText:'请输入您的建议,我们会悉心聆听',
            success :(res)=> {
                const audioSource = this.node.getComponent(AudioSource);
                if (audioSource && audioSource.clip) {
                    audioSource.playOneShot(audioSource.clip, 1);
                } else {
                    console.error("No AudioSource or clip found on the node!");
                }
                if (res.confirm) {

                    if(res.content == ""){
                        wx.showToast({
                            title: '内容不能为空',
                            icon: 'error',
                            duration: 2000
                        })
                        return;
                    }
                    if(res.content.length>2000){
                        wx.showToast({
                            title: '失败,内容过多',
                            icon: 'error',
                            duration: 2000
                        })
                        return;
                    }
                    console.log('用户点击确定');
                    console.log(res.content);
                    //通过后端发送邮件
                    var feedbackXhr = new XMLHttpRequest();
                    // 定义请求完成的回调函数
                    feedbackXhr.onload = () =>{
                        if (feedbackXhr.status === 200) {
                            // 请求成功，处理响应数据
                            console.log(feedbackXhr.responseText);
                            wx.showToast({
                                title: '反馈成功',
                                icon: 'success',
                                duration: 2000
                            })
                        }
                    };
                    feedbackXhr.onerror = function () {
                        //获取排行榜数据失败
                        wx.showToast({
                            title: '反馈提交失败,请稍后再试',
                            icon: '通知',
                            duration: 2000
                        })
                    };
                    // 设置请求方法和 URL
                    feedbackXhr.open('GET', GlobalVariables.httpPrefix+'://' + GlobalVariables.serverIp + ':'
                        +GlobalVariables.httpPort+'/ningJinGame/zouDing/feedBack?userId='+GlobalVariables.userId+
                        "&userName="+GlobalVariables.userName+"&content="+res.content+"&subject=走顶玩家反馈", true);
                    feedbackXhr.send();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }


}


