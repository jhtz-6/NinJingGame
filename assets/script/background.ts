import { _decorator, Component, Node, url,UITransform, find,Sprite, assetManager, ImageAsset,SpriteFrame, AudioSource , Label, EditBox, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;
import 'minigame-api-typings';
import GlobalVariables from './GlobalVariables';
import WechatRegisterAndLoginDTO from './WechatRegisterAndLoginDTO';
import {chessManager} from "db://assets/script/chessManager";
import globalVariables from "./GlobalVariables";
import {SocketEntity} from "./SocketEntity";
import {FifthOrder} from "db://assets/script/Button/FifthOrder";
import {ForthOrder} from "db://assets/script/Button/ForthOrder";
import {Invite} from "db://assets/script/Button/Invite";

@ccclass('background')
export class background extends Component {
    private socketEntity: SocketEntity = new SocketEntity(); // 假设我们有一个棋盘，上面放置了多个Chess实例


    @property(Node)
    avatar: Node

    @property(Label)
    name_Label: Label

    //用户信息
    userInfo;
    start(){
        this.node.setSiblingIndex(0); // 设置 Z-Order 为最低

        let windowInfo = wx.getWindowInfo();
        try{
            //获取屏幕像素大小
            let uiTransform = this.node.getComponent(UITransform);
            console.log(windowInfo);
            //这里像素转为逻辑值 *3了 大致是这个数
            let screenHeight = windowInfo.screenHeight * 3;
            let screenWidth = windowInfo.screenWidth * 3;
            GlobalVariables.screenWidth = screenWidth;
            GlobalVariables.screenHeight = screenHeight;
            uiTransform.setContentSize(screenWidth,screenHeight);
            //设置弹窗的遮罩层大小
            let buttonNode = find('Canvas/Button');
            buttonNode.getComponent(UITransform).setContentSize(screenWidth,screenHeight);
            let userNode = find('Canvas/User');
            userNode.getComponent(UITransform).setContentSize(screenWidth,screenHeight);
        }catch (e) {
            console.log("获取屏幕数据失败:",e)
        }
        try{
            wx.showModal({
                title: '通知',
                content: '首次登陆需要点击下面的授权,游戏资源加载中.....',
                showCancel:false
            })

        }catch (e) {
            console.log("background popupNode error:",e)
        }

        function getShareMsg() {
            try{
                console.log("开始获取shareMsg")
                let object = wx.getEnterOptionsSync();
                let shareMsg = object.query['shareMsg'];
                console.log("获取shareMsg成功")
                console.log(shareMsg);
                if(shareMsg == undefined){
                    //通过getEnterOptionsSync没有获取到启动参数
                    let object = wx.getLaunchOptionsSync();
                    shareMsg = object.query['shareMsg'];
                    console.log("getLaunchOptionsSync 获取shareMsg");
                    console.log(shareMsg);
                }
                //
                if(shareMsg != undefined){
                    //说明是邀请
                    var clickInvitationXhr = new XMLHttpRequest();
                    // 定义请求完成的回调函数
                    clickInvitationXhr.onload = function () {
                        if (clickInvitationXhr.status === 200) {
                            // 请求成功，处理响应数据
                            console.log(clickInvitationXhr.responseText);
                            GlobalVariables.gameType = "MATCH";
                        }
                    };
                    // 定义请求出错的回调函数
                    clickInvitationXhr.onerror = function () {

                    };
                    // 设置请求方法和 URL
                    clickInvitationXhr.open('GET', GlobalVariables.httpPrefix+'://' + GlobalVariables.serverIp + ':'
                        +GlobalVariables.httpPort+'/ningJinGame/zouDing/clickInvitation?invitedId=' +
                        GlobalVariables.userId+"&"+shareMsg, true);
                    clickInvitationXhr.send();
                }
            }catch (e) {
                console.log("clickInvitationXhr error:"+e)
            }
        }

        function actionAfterGetUserInfo(){
            //获取self节点
            const self = find('Canvas/User/Self');
            const sprite = self.getComponent(Sprite);
            try{
                // 使用微信小游戏的 API 下载图片
                wx.downloadFile({
                    url: WechatRegisterAndLoginDTO.avatarUrl,
                    success: (res) => {
                        if (res.statusCode === 200) {
                            console.log(res)
                            // 下载成功，创建 cc.Texture2D
                            assetManager.loadRemote<ImageAsset>(res.tempFilePath, (err, imageAsset) => {
                                if (err) {
                                    console.error('Failed to load image:', err);
                                    return;
                                }
                                // 创建 cc.SpriteFrame
                                const spriteFrame = SpriteFrame.createWithImage(imageAsset);
                                // 将头像显示在 Sprite 上
                                sprite.spriteFrame = spriteFrame;

                                //授权成功后

                                try{
                                    let object: any = {
                                        timeout: 10000,         // 超时时间毫秒
                                        success: (res) => {
                                            // 用户登录凭证，有效期5分钟
                                            console.log("微信登陆成功:"+res.code);
                                            // 创建一个新的 XMLHttpRequest 对象
                                            var wxLoginXhr = new XMLHttpRequest();
                                            // 定义请求完成的回调函数
                                            wxLoginXhr.onload = function () {
                                                if (wxLoginXhr.status === 200) {
                                                    try{
                                                        // 请求成功，处理响应数据
                                                        console.log('wxLoginXhr请求结果:');
                                                        console.log(wxLoginXhr.responseText);
                                                        let openId = JSON.parse(wxLoginXhr.responseText).data.openId;
                                                        chessManager.instance.handlerClickRequest.setUserId(openId);
                                                        console.log("data.openId:"+openId)
                                                        GlobalVariables.userId = openId;
                                                        console.log("GlobalVariables.userId:"+GlobalVariables.userId)
                                                        WechatRegisterAndLoginDTO.openId = openId;

                                                        //建立websocket链接
                                                        const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
                                                        if(webSocketManagerNode){
                                                            const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                                                            if(webSocketManager){
                                                                webSocketManager.sendSocket("onopen",GlobalVariables.userId,GlobalVariables.userName);
                                                            }
                                                        }

                                                        // 注册登录
                                                        var xhr = new XMLHttpRequest();
                                                        // 定义请求完成的回调函数
                                                        xhr.onload = function () {
                                                            if (xhr.status === 200) {
                                                                // 请求成功，处理响应数据
                                                                console.log('wechatRegisterAndLogin请求结果:');
                                                                console.log(xhr.responseText);
                                                                //注册登录完成之后开始判断是否为邀请
                                                                getShareMsg();
                                                            } else {
                                                                // 请求失败，处理错误
                                                                console.error('wechatRegisterAndLogin请求失败: ' + xhr.statusText);
                                                            }
                                                        };
                                                        // 定义请求出错的回调函数
                                                        xhr.onerror = function () {
                                                            console.error('wechatRegisterAndLogin网络错误');
                                                        };
                                                        // 设置请求方法和 URL
                                                        xhr.open('POST', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'+GlobalVariables.httpPort+'/ningJinGame/zouDing/wechatRegisterAndLogin', true);
                                                        // 设置请求头（如果需要的话）
                                                        xhr.setRequestHeader('Content-Type', 'application/json');
                                                        xhr.send(JSON.stringify(WechatRegisterAndLoginDTO));
                                                    }catch (e) {
                                                        try{
                                                            console.log('wxLoginXhr.error',e);
                                                            //这里解析json数据可能会出现错误,原因未知,出现错误重试一次
                                                            // 创建一个新的 XMLHttpRequest 对象
                                                            var wxLoginAgainXhr = new XMLHttpRequest();
                                                            // 定义请求完成的回调函数
                                                            wxLoginAgainXhr.onload = function () {
                                                                if (wxLoginAgainXhr.status === 200) {
                                                                    try{
                                                                        // 请求成功，处理响应数据
                                                                        console.log('wxLoginAgainXhr请求结果:');
                                                                        console.log(wxLoginAgainXhr.responseText);
                                                                        let openId = JSON.parse(wxLoginAgainXhr.responseText).data.openId;
                                                                        chessManager.instance.handlerClickRequest.setUserId(openId);
                                                                        console.log("data.openId:"+openId)
                                                                        GlobalVariables.userId = openId;
                                                                        console.log("GlobalVariables.userId:"+GlobalVariables.userId)
                                                                        WechatRegisterAndLoginDTO.openId = openId;

                                                                        //建立websocket链接
                                                                        const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
                                                                        if(webSocketManagerNode){
                                                                            const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                                                                            if(webSocketManager){
                                                                                webSocketManager.sendSocket("onopen",GlobalVariables.userId,GlobalVariables.userName);
                                                                            }
                                                                        }

                                                                        // 注册登录
                                                                        var xhr = new XMLHttpRequest();
                                                                        // 定义请求完成的回调函数
                                                                        xhr.onload = function () {
                                                                            if (xhr.status === 200) {
                                                                                // 请求成功，处理响应数据
                                                                                console.log('wechatRegisterAndLogin请求结果:');
                                                                                console.log(xhr.responseText);
                                                                                //注册登录完成之后开始判断是否为邀请
                                                                                getShareMsg();
                                                                            } else {
                                                                                // 请求失败，处理错误
                                                                                console.error('wechatRegisterAndLogin请求失败: ' + xhr.statusText);
                                                                            }
                                                                        };
                                                                        // 定义请求出错的回调函数
                                                                        xhr.onerror = function () {
                                                                            console.error('wechatRegisterAndLogin网络错误');
                                                                        };
                                                                        // 设置请求方法和 URL
                                                                        xhr.open('POST', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'+GlobalVariables.httpPort+'/ningJinGame/zouDing/wechatRegisterAndLogin', true);
                                                                        // 设置请求头（如果需要的话）
                                                                        xhr.setRequestHeader('Content-Type', 'application/json');
                                                                        xhr.send(JSON.stringify(WechatRegisterAndLoginDTO));
                                                                    }catch (e) {
                                                                        console.error('wxLoginAgainXhr请求失败: ' + e);
                                                                        //提示微信登陆失败,请点击右上角重新进入小程序
                                                                        wx.showModal({
                                                                            title: '提示',
                                                                            content: '微信登陆失败,请点击右上角重新进入小程序',
                                                                            success (res) {
                                                                                if (res.confirm) {
                                                                                    console.log('用户点击确定')
                                                                                } else if (res.cancel) {
                                                                                    console.log('用户点击取消')
                                                                                }
                                                                            }
                                                                        })
                                                                    }


                                                                } else {
                                                                    // 请求失败，处理错误
                                                                    console.error('wxLoginAgainXhr请求失败: ' + wxLoginAgainXhr.statusText);
                                                                    //提示微信登陆失败,请点击右上角重新进入小程序
                                                                    wx.showModal({
                                                                        title: '提示',
                                                                        content: '微信登陆失败,请点击右上角重新进入小程序',
                                                                        success (res) {
                                                                            if (res.confirm) {
                                                                                console.log('用户点击确定')
                                                                            } else if (res.cancel) {
                                                                                console.log('用户点击取消')
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            };
                                                            // 定义请求出错的回调函数
                                                            wxLoginAgainXhr.onerror = function () {
                                                                wx.showModal({
                                                                    title: '错误',
                                                                    content: "微信登陆失败,请点击右上角重新进入小程序",
                                                                    showCancel:false
                                                                })
                                                                console.error('wxLoginAgainXhr网络错误');
                                                            };
                                                            WechatRegisterAndLoginDTO.jsCode = res.code;
                                                            // 设置请求方法和 URL
                                                            wxLoginAgainXhr.open('GET', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'
                                                                +GlobalVariables.httpPort+'/ningJinGame/zouDing/wxLogin?jsCode='+res.code, true);
                                                            // 设置请求头（如果需要的话）
                                                            wxLoginAgainXhr.setRequestHeader('Content-Type', 'application/json');
                                                            wxLoginAgainXhr.send();
                                                        }catch (e) {
                                                            //提示微信登陆失败,请点击右上角重新进入小程序
                                                            wx.showModal({
                                                                title: '提示',
                                                                content: '微信登陆失败,请点击右上角重新进入小程序',
                                                                success (res) {
                                                                    if (res.confirm) {
                                                                        console.log('用户点击确定')
                                                                    } else if (res.cancel) {
                                                                        console.log('用户点击取消')
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                } else {
                                                    // 请求失败，处理错误
                                                    console.error('wxLogin请求失败: ' + wxLoginXhr.statusText);
                                                }
                                            };
                                            // 定义请求出错的回调函数
                                            wxLoginXhr.onerror = function () {
                                                console.error('wxLogin网络错误');
                                            };
                                            WechatRegisterAndLoginDTO.jsCode = res.code;
                                            // 设置请求方法和 URL
                                            wxLoginXhr.open('GET', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'
                                                +GlobalVariables.httpPort+'/ningJinGame/zouDing/wxLogin?jsCode='+res.code, true);
                                            // 设置请求头（如果需要的话）
                                            wxLoginXhr.setRequestHeader('Content-Type', 'application/json');
                                            wxLoginXhr.send();
                                        },
                                        fail: (err) => {
                                            console.log(`wx.login 失败, errorCode:${err.errno}, msg:${err.errMsg}`)
                                        },
                                    };
                                    wx.login(object);
                                }catch (e) {
                                    console.log("微信登陆报错:"+e)
                                }


                            });
                        } else {
                            console.error('Failed to download image, status code:', res.statusCode);
                        }
                    },
                    fail: (err) => {
                        //授权失败 单机游戏  生成随机userid 时间戳生成
                        // 创建一个新的Date对象，它默认设置为当前日期和时间
                        GlobalVariables.gameType = "SINGLE";
                        let timeUserId = new Date().getTime();
                        GlobalVariables.userId = timeUserId+"";
                        GlobalVariables.otherUserId = "0"+timeUserId;
                        const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
                        if(webSocketManagerNode){
                            const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                            if(webSocketManager){
                                webSocketManager.initWebSocket("");
                            }
                        }
                        wx.showToast({
                            title: '游戏资源加载中...',
                            icon: 'loading',
                            duration: 2000
                        })
                        console.error('Failed to download image:', err);
                        //未登录 禁用邀请按钮
                        Invite.disabledButton();

                    }
                });
            }catch (e) {
                console.log("加载头像异常:"+e)
            }finally {
                wx.showToast({
                    title: '游戏资源加载中...',
                    icon: 'loading',
                    duration: 2000
                })
            }
        }

        try{
            // 通过 wx.getSetting 查询用户是否已授权头像昵称信息
            wx.getSetting({
                success (res){
                    console.log("wx.getSetting 调用成功了",res);
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function(res) {
                                console.log(res.userInfo);
                                //设置自己的游戏昵称为微信昵称
                                const selfData = find('Canvas/User/SelfData');
                                GlobalVariables.userName = res.userInfo.nickName;
                                WechatRegisterAndLoginDTO.nickName = res.userInfo.nickName;
                                WechatRegisterAndLoginDTO.gender = res.userInfo.gender;
                                WechatRegisterAndLoginDTO.avatarUrl = res.userInfo.avatarUrl;
                                selfData.getComponent(Label).string = res.userInfo.nickName;
                                //获取到信息以后的动作
                                actionAfterGetUserInfo();

                            }
                        })
                    } else {
                        // 否则，先通过 wx.createUserInfoButton 接口发起授权
                        let button = wx.createUserInfoButton({
                            type: 'text',
                            text: '点击授权',
                            style: {
                                left: windowInfo.screenWidth/2-50,
                                top: windowInfo.screenHeight-100,
                                width: 100,
                                height: 50,
                                lineHeight: 50,
                                backgroundColor: '#45ec0c',
                                color: '#030303',
                                textAlign: 'center',
                                fontSize: 20,
                                borderRadius: 4
                            }
                        })
                        button.onTap((res) => {
                            button.hide()
                            // 用户同意授权后回调，通过回调可获取用户头像昵称信息
                            //设置自己的游戏昵称为微信昵称
                            const selfData = find('Canvas/User/SelfData');
                            GlobalVariables.userName = res.userInfo.nickName;
                            WechatRegisterAndLoginDTO.nickName = res.userInfo.nickName;
                            WechatRegisterAndLoginDTO.gender = res.userInfo.gender;
                            WechatRegisterAndLoginDTO.avatarUrl = res.userInfo.avatarUrl;
                            selfData.getComponent(Label).string = res.userInfo.nickName;
                            //获取到信息以后的动作
                            actionAfterGetUserInfo();
                        })
                    }
                },
                fail(res){
                    console.log("wx.getSetting 调用失败了:",res)
                }
            })
        }catch (e) {
            console.log("wx getSetting error:",e);
            let timeUserId = new Date().getTime();
            GlobalVariables.userId = timeUserId+"";
            GlobalVariables.otherUserId = "0"+timeUserId;
            const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
            if(webSocketManagerNode){
                const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                if(webSocketManager){
                    webSocketManager.initWebSocket("");
                }
            }
            wx.showToast({
                title: '游戏资源加载中...',
                icon: 'loading',
                duration: 2000
            })
            //未登录 禁用邀请按钮
            Invite.disabledButton();
        }
        //小游戏回到前台的事件

        wx.onShow(res =>  {
            console.log("onShow");
            console.log(res);
            //如果之前是联机中,就重置,并弹窗一下。  todo后面优化成对方下线后 才进行重置
            if(GlobalVariables.gameType != "SINGLE" && globalVariables.needRestart){
                wx.restartMiniProgram({
                    success(res) {
                        console.log('重启成功', res)
                    },
                    fail(err) {
                        console.log('重启失败', err)
                    }
                })
            }else {
                //小游戏重新到前台,强制重新建立连接
                const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
                if(webSocketManagerNode){
                    const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                    if(webSocketManager){
                        webSocketManager.connectSocket(this.node);
                    }
                }

                //判断音乐是否在播放 没有在播放要继续播放
                const chessManagerNode = find('Canvas/background');
                if(GlobalVariables.gaming){
                    if(!chessManagerNode.getComponents(AudioSource)[1].playing){
                        chessManagerNode.getComponents(AudioSource)[1].play();
                    }
                }else{
                    if(!chessManagerNode.getComponents(AudioSource)[0].playing){
                        chessManagerNode.getComponents(AudioSource)[0].play();
                    }
                }
            }

            //重置的对方信息和棋盘
            /*GlobalVariables.otherUserId = "123456";
            find('Canvas/User/Other').getComponent(Sprite).spriteFrame = GlobalVariables.defaultSpriteFrame;
            find('Canvas/User/OtherData').getComponent(Label).string = "黑色方";*/

        })

        //小程序隐藏到后台
        wx.onHide(function () {
            //如果是
            console.log("小程序隐藏到后台")
        })

        // 授权显示菜单
        wx.showShareMenu({
            withShareTicket: false,
            // 显示菜单
            menus: ['shareAppMessage'],
            success: (res) => {
                console.log("开始被动转发shareMenu成功");
            },
            fail: () => {
                console.log("开始被动转发shareMenu失败");
            }
        });

        // 好友点击回调
        wx.onShareAppMessage(() => {
            console.log("好友点分享了链接")
            return {
                // 转发标题, 没有则默认使用小游戏的昵称
                title: "朋友棋 不客气",
                // 图片链接，
                //imageUrl: "",
                query: 'shareMsg='+'testParam'
            };
        });
        // 朋友圈点击回调
        /*wx.onShareTimeline(() => {
            console.log("朋友圈点击了分享链接")
            return {
                title: '朋友圈转发标题',
            };
        })*/

        //创建游戏圈
        try{
            wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: 15,
                    top: 76,
                    width: 40,
                    height: 40
                }
            })
        }catch (e) {
            console.log("createGameClubButton:"+e)
        }
    }
    public static startGamingMusic(){
        if(!GlobalVariables.canPlayBgMusic){
            return;
        }
        const chessManagerNode = find('Canvas/background');
        if(chessManagerNode.getComponents(AudioSource)[0].playing){
            chessManagerNode.getComponents(AudioSource)[0].stop();
            chessManagerNode.getComponents(AudioSource)[1].play();
        }
    }

    public static pauseBgMusic(){
        const chessManagerNode = find('Canvas/background');
        if(chessManagerNode.getComponents(AudioSource)[0].playing){
            chessManagerNode.getComponents(AudioSource)[0].stop();
        }
        if(chessManagerNode.getComponents(AudioSource)[1].playing){
            chessManagerNode.getComponents(AudioSource)[1].stop();
        }
        GlobalVariables.canPlayBgMusic = false;
    }

    public static startBgMusic(){
        const chessManagerNode = find('Canvas/background');
        if(GlobalVariables.gaming){
            if(!chessManagerNode.getComponents(AudioSource)[1].playing){
                chessManagerNode.getComponents(AudioSource)[1].play();
            }
        }else {
            if(!chessManagerNode.getComponents(AudioSource)[0].playing){
                chessManagerNode.getComponents(AudioSource)[0].play();
            }
        }
        GlobalVariables.canPlayBgMusic = true;
    }

}


