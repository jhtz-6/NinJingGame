import { _decorator, Component, Node ,Vec3,Button,find,AudioSource, assetManager, ImageAsset,SpriteFrame,Sprite,Label} from 'cc';
const { ccclass, property } = _decorator;
import {SocketEntity} from "./SocketEntity";
import GlobalVariables from './GlobalVariables';
import {chessManager} from "./chessManager";
import {background} from "./background";
import globalVariables from "./GlobalVariables";
import {FifthOrder} from "db://assets/script/Button/FifthOrder";
import {ForthOrder} from "db://assets/script/Button/ForthOrder";
import WechatRegisterAndLoginDTO from "db://assets/script/WechatRegisterAndLoginDTO";

@ccclass('WebSocketManager')
export class WebSocketManager extends Component {
    private socketEntity: SocketEntity = new SocketEntity(); // 假设我们有一个棋盘，上面放置了多个Chess实例
    private xy2NameMap: Map<string, string> = new Map();
    private convert4Map: Map<string, string> = new Map();
    private convert5Map: Map<string, string> = new Map();

    start() {
        this.initWebSocket("");
    }
    onLoad(){

        this.convert5Map.set("00","-400|-400");
        this.convert5Map.set("10","-200|-400");
        this.convert5Map.set("20","0|-400");
        this.convert5Map.set("30","200|-400");
        this.convert5Map.set("40","400|-400");

        this.convert5Map.set("01","-400|-200");
        this.convert5Map.set("11","-200|-200");
        this.convert5Map.set("21","0|-200");
        this.convert5Map.set("31","200|-200");
        this.convert5Map.set("41","400|-200");

        this.convert5Map.set("02","-400|0");
        this.convert5Map.set("12","-200|0");
        this.convert5Map.set("22","0|0");
        this.convert5Map.set("32","200|0");
        this.convert5Map.set("42","400|0");

        this.convert5Map.set("03","-400|200");
        this.convert5Map.set("13","-200|200");
        this.convert5Map.set("23","0|200");
        this.convert5Map.set("33","200|200");
        this.convert5Map.set("43","400|200");

        this.convert5Map.set("04","-400|400");
        this.convert5Map.set("14","-200|400");
        this.convert5Map.set("24","0|400");
        this.convert5Map.set("34","200|400");
        this.convert5Map.set("44","400|400");



        this.xy2NameMap.set("00","BgChess1");
        this.xy2NameMap.set("10","BgChess2");
        this.xy2NameMap.set("20","BgChess3");
        this.xy2NameMap.set("30","BgChess4");

        this.xy2NameMap.set("01","BgChess5");
        this.xy2NameMap.set("11","BgChess6");
        this.xy2NameMap.set("21","BgChess7");
        this.xy2NameMap.set("31","BgChess8");

        this.xy2NameMap.set("02","BgChess9");
        this.xy2NameMap.set("12","BgChess10");
        this.xy2NameMap.set("22","BgChess11");
        this.xy2NameMap.set("32","BgChess12");

        this.xy2NameMap.set("03","BgChess13");
        this.xy2NameMap.set("13","BgChess14");
        this.xy2NameMap.set("23","BgChess15");
        this.xy2NameMap.set("33","BgChess16");

        this.convert4Map.set("00","-300|-300");
        this.convert4Map.set("10","-100|-300");
        this.convert4Map.set("20","100|-300");
        this.convert4Map.set("30","300|-300");

        this.convert4Map.set("01","-300|-100");
        this.convert4Map.set("11","-100|-100");
        this.convert4Map.set("21","100|-100");
        this.convert4Map.set("31","300|-100");

        this.convert4Map.set("02","-300|100");
        this.convert4Map.set("12","-100|100");
        this.convert4Map.set("22","100|100");
        this.convert4Map.set("32","300|100");

        this.convert4Map.set("03","-300|300");
        this.convert4Map.set("13","-100|300");
        this.convert4Map.set("23","100|300");
        this.convert4Map.set("33","300|300");


    }


    private static instance: WebSocketManager | null = null;  
    private reconnectAttempts = 0;
     private chessNodes: Node[] = []; // 存储所有棋子的引用  
    public mainSocketTask = null;

    private heartbeatInterval;
    private readonly heartbeatIntervalMs = 5000; // 5 seconds

    private startHeartbeat(): void {
        this.socketEntity.setType("heartbeat");
        this.socketEntity.setUserId(GlobalVariables.userId);
        this.socketEntity.setUserName(GlobalVariables.userName);
        this.mainSocketTask.send({
            data:JSON.stringify(this.socketEntity),
        });
        if (this.heartbeatInterval) {
            // 如果定时器已经存在，则不需要再次启动
            return;
        }

        this.heartbeatInterval = setInterval(() => {
            if (this.mainSocketTask.readyState === WebSocket.OPEN) {
                this.socketEntity.setType("heartbeat");
                this.socketEntity.setUserId(GlobalVariables.userId);
                this.socketEntity.setUserName(GlobalVariables.userName);
                this.mainSocketTask.send({
                    data:JSON.stringify(this.socketEntity),
                });
            } else {
                console.log("mainSocketTask.readyState:"+this.mainSocketTask.readyState)
                this.sendSocket("onclose",GlobalVariables.userId,GlobalVariables.userName);
                // 如果连接已关闭，清除定时器
                this.stopHeartbeat();
            }
        }, this.heartbeatIntervalMs);
    }
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
            console.log('心跳定时器已停止');
        }
    }

    public initWebSocket(num) {
        this.mainSocketTask = wx.connectSocket({
            url: GlobalVariables.webSocketPrefix+'://'+globalVariables.serverIp+':'+globalVariables.webSocketPort+'/websocket',
        });

        this.mainSocketTask.onOpen((res) => {

            console.log('WebSocket连接已打开');
            // 启动心跳定时器
            this.startHeartbeat();
            if(num === "1"){
                //点击邀请链接进来的
                try{
                    console.log("initWebSocket开始获取shareMsg")
                    let object = wx.getEnterOptionsSync();
                    let shareMsg = object.query['shareMsg'];
                    console.log("initWebSocket获取shareMsg成功")
                    console.log(shareMsg);
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
                    console.log("initWebSocket error:"+e)
                }
            }

        });
        // 监听WebSocket接收到服务器的消息事件       坐标系从左到右 从上到下

        this.mainSocketTask.onMessage((res) => {
            GlobalVariables.showReturnButton = true;
            try{
                const result = JSON.parse(res.data);
                if (result.success) {
                    if(result.data.columnNumber != undefined){
                        chessManager.instance.handlerClickRequest.setColumnNumber(result.data.columnNumber);
                    }
                    let columnNumber = chessManager.instance.handlerClickRequest.getColumnNumber();
                    let BgChessParentNode;
                    let tiledMapNode;
                    let convertMap= new Map();
                    if(columnNumber == 4){
                        BgChessParentNode = find('Canvas/ForthMap/BackGroundChess');
                        tiledMapNode = find('Canvas/ForthMap/TiledMap');
                        convertMap = this.convert4Map;
                    }else {
                        BgChessParentNode = find('Canvas/FifthMap/BackGroundChess');
                        tiledMapNode = find('Canvas/FifthMap/TiledMap');
                        convertMap = this.convert5Map;
                    }
                    if(result.type ==="HEART_BEAT"){
                        //获取当前在线人数
                        const backgroundNode = find('Canvas/background');
                        backgroundNode.getChildByName("CurrentNumValue").getComponent(Label).string =result.data;
                        console.log("收到服务端心跳:"+result.data);
                    }else if (result.type === "CELL_CLICK") {
                        const HandleCellClickResult = result.data;
                        let BgChessNum=0;
                        //直接把四个背景精灵禁用
                        BgChessParentNode.getChildByName("BgChess1").active = false;
                        BgChessParentNode.getChildByName("BgChess2").active = false;
                        BgChessParentNode.getChildByName("BgChess3").active = false;
                        BgChessParentNode.getChildByName("BgChess4").active = false;
                        globalVariables.userType = HandleCellClickResult.userType;
                        if (HandleCellClickResult.isEnd != null && HandleCellClickResult.isEnd) {
                            if(HandleCellClickResult.anyChessEaten){
                                //有棋子被吃掉的音效
                                let eatenVoice = this.node.getComponents(AudioSource)[2];
                                eatenVoice.playOneShot(eatenVoice.clip, 1);
                            }
                            //下X上O   X白O黑
                            if(GlobalVariables.gameType == "SINGLE"){
                                wx.showModal({
                                    title: '通知',
                                    content: "恭喜"+(HandleCellClickResult.winner.toUpperCase() === "X" ? "白" : "黑") +"色方获胜,游戏已重开",
                                    showCancel:false
                                })
                            }else{
                                wx.showModal({
                                    title: '通知',
                                    content: "恭喜"+(HandleCellClickResult.winner.toUpperCase() === GlobalVariables.currentChess ?
                                        GlobalVariables.userName : GlobalVariables.otherUserName) +"获胜,游戏已重开",
                                    showCancel:false
                                })
                            }
                            // winner： x  o
                            if(HandleCellClickResult.winner.toUpperCase() === GlobalVariables.currentChess.toUpperCase()){
                                //胜利音效播放
                                this.node.getComponents(AudioSource)[0].play();
                            }else{
                                //失败音效播放
                                this.node.getComponents(AudioSource)[1].play();
                            }
                            let initChessBoard = chessManager.instance.initChessBoard;
                            if(HandleCellClickResult.canPlacePosition != undefined){
                                chessManager.instance.handlerClickRequest.setBoards(HandleCellClickResult.canPlacePosition);
                            }else{
                                chessManager.instance.handlerClickRequest.setBoards(initChessBoard);
                            }
                            //重置棋盘元素
                            chessManager.instance.handlerClickRequest.setBeforeCell(null);
                            for(let i = 0;i<columnNumber;i++){
                                for(let j = 0 ; j<columnNumber;j++){
                                    let canPlaceNode = chessManager.instance.handlerClickRequest.getBoards()[i][j];
                                    if(canPlaceNode.name != null && canPlaceNode.name != ''){
                                        if(canPlaceNode.content != null && canPlaceNode.content != ''){
                                            //let nodeName = this.xy2NameMap.get(i+""+j);
                                            //BgChessParentNode.getChildByName(nodeName).active = false;
                                            let positionArr = convertMap.get(i+""+j).split("|");
                                            let childNode = tiledMapNode.getChildByName(canPlaceNode.name);
                                            childNode.active = true;
                                            childNode.position = new Vec3(parseInt(positionArr[0]), parseInt(positionArr[1]),0 );
                                            //上面是精灵棋子位置渲染,下面是精灵棋子状态(可点击/不可点击)渲染
                                            childNode.getComponent(Button).interactable = canPlaceNode.clickable;
                                        }else{
                                            //同时判断该位置是否有精灵棋子,有的话禁用掉
                                            tiledMapNode.getChildByName(canPlaceNode.name).active = false;
                                        }
                                    }
                                }
                            }
                            FifthOrder.activeButton();
                            ForthOrder.activeButton();
                            //更新名字
                            this.updateName(HandleCellClickResult.userDTO);
                        } else {
                            FifthOrder.disabledButton();
                            ForthOrder.disabledButton();
                            console.log('handlerClickRequest.CELL_CLICK.getBoards:');
                            console.log( HandleCellClickResult.canPlacePosition);
                            if (HandleCellClickResult.canPlacePosition != null) {
                                if(HandleCellClickResult.anyChessEaten){
                                    //有棋子被吃掉的音效
                                    let eatenVoice = this.node.getComponents(AudioSource)[2];
                                    eatenVoice.playOneShot(eatenVoice.clip, 1);
                                }
                                chessManager.instance.handlerClickRequest.setBoards(HandleCellClickResult.canPlacePosition);
                                for(let i = 0;i<columnNumber;i++){
                                    for(let j = 0 ; j<columnNumber;j++){
                                        let canPlaceNode = chessManager.instance.handlerClickRequest.getBoards()[i][j];
                                        if(canPlaceNode.name != null && canPlaceNode.name != ''){
                                            if(canPlaceNode.content != null && canPlaceNode.content != ''){
                                                //let nodeName = this.xy2NameMap.get(i+""+j);
                                                //BgChessParentNode.getChildByName(nodeName).active = false;
                                                let positionArr = convertMap.get(i+""+j).split("|");
                                                let childNode = tiledMapNode.getChildByName(canPlaceNode.name);
                                                childNode.position = new Vec3(parseInt(positionArr[0]), parseInt(positionArr[1]),0 );
                                                //上面是精灵棋子位置渲染,下面是精灵棋子状态(可点击/不可点击)渲染
                                                childNode.getComponent(Button).interactable = canPlaceNode.clickable;
                                            }else{
                                                //同时判断该位置是否有精灵棋子,有的话禁用掉
                                                tiledMapNode.getChildByName(canPlaceNode.name).active = false;
                                            }
                                        }else if(canPlaceNode.clickable){
                                            //下一步可以移动到的目标位置精灵 背景精灵 非棋子精灵
                                            BgChessNum++;
                                            BgChessParentNode.getChildByName("BgChess"+BgChessNum).active = true;
                                            let positionArr = convertMap.get(i+""+j).split("|");
                                            BgChessParentNode.getChildByName("BgChess"+BgChessNum).position = new Vec3(parseInt(positionArr[0]), parseInt(positionArr[1]),0 );
                                        }else {
                                            //将其它的可点击精灵禁用 背景精灵 非棋子精灵
                                            //let nodeName = this.xy2NameMap.get(i+""+j);
                                            //BgChessParentNode.getChildByName(nodeName).active = false;
                                        }
                                    }
                                }
                                //todo 判断是否有棋子被吃掉
                                //this.board = HandleCellClickResult.canPlacePosition;
                            }
                        }
                    }else if(result.type === "MATCH_GAME" || result.type === "CHANGE_COLUMN"){
                        try {
                            const HandleCellClickResult = result.data;
                            if(result.type === "MATCH_GAME"){
                                console.log("MATCH_GAME收到消息：" + HandleCellClickResult);
                                GlobalVariables.otherUserId = HandleCellClickResult.otherUserId;
                                GlobalVariables.otherUserName = HandleCellClickResult.otherUserName;
                                GlobalVariables.otherAvatarUrl = HandleCellClickResult.otherAvatarUrl;
                                GlobalVariables.currentChess = HandleCellClickResult.cell;
                                GlobalVariables.otherChess = HandleCellClickResult.otherCell;
                                GlobalVariables.gameType = HandleCellClickResult.gameType;
                                GlobalVariables.inviteType = HandleCellClickResult.inviteType;
                                chessManager.instance.handlerClickRequest.setGameType(HandleCellClickResult.gameType);
                                chessManager.instance.handlerClickRequest.setInviteType(HandleCellClickResult.inviteType);
                                this.initOtherCell();
                                //直接把四个背景精灵禁用
                                BgChessParentNode.getChildByName("BgChess1").active = false;
                                BgChessParentNode.getChildByName("BgChess2").active = false;
                                BgChessParentNode.getChildByName("BgChess3").active = false;
                                BgChessParentNode.getChildByName("BgChess4").active = false;
                                chessManager.instance.handlerClickRequest.setBoards(HandleCellClickResult.initBoards);
                                this.updateName(HandleCellClickResult);
                            }else{
                                console.log('CHANGE_COLUMN.handlerClickRequest');
                                console.log(HandleCellClickResult.canPlacePosition);
                                chessManager.instance.handlerClickRequest.setBoards(HandleCellClickResult.canPlacePosition);
                            }
                            if(4 == HandleCellClickResult.columnNumber){
                                find('Canvas/ForthMap').active = true;
                                find('Canvas/FifthMap').active = false;
                            }else{
                                find('Canvas/ForthMap').active = false;
                                find('Canvas/FifthMap').active = true;
                            }
                            console.log('handlerClickRequest.MATCH_GAME.getBoards:');
                            console.log( chessManager.instance.handlerClickRequest.getBoards());
                            debugger
                            for(let i = 0;i<columnNumber;i++){
                                for(let j = 0 ; j<columnNumber;j++){
                                    let canPlaceNode = chessManager.instance.handlerClickRequest.getBoards()[i][j];
                                    if(canPlaceNode.name != null && canPlaceNode.name != ''){
                                        if(canPlaceNode.content != null && canPlaceNode.content != ''){
                                            let positionArr = convertMap.get(i+""+j).split("|");
                                            let childNode = tiledMapNode.getChildByName(canPlaceNode.name);
                                            childNode.active = true;
                                            childNode.position = new Vec3(parseInt(positionArr[0]), parseInt(positionArr[1]),0 );
                                            //上面是精灵棋子位置渲染,下面是精灵棋子状态(可点击/不可点击)渲染
                                            childNode.getComponent(Button).interactable = canPlaceNode.clickable;
                                        }else{
                                            //同时判断该位置是否有精灵棋子,有的话禁用掉
                                            tiledMapNode.getChildByName(canPlaceNode.name).active = false;
                                        }
                                    }else if(canPlaceNode.clickable){
                                        //下一步可以移动到的目标位置精灵 背景精灵 非棋子精灵
                                        //BgChessNum++;
                                        //BgChessParentNode.getChildByName("BgChess"+BgChessNum).active = true;
                                        //let positionArr = convertMap.get(i+""+j).split("|");
                                        //BgChessParentNode.getChildByName("BgChess"+BgChessNum).position = new Vec3(parseInt(positionArr[0]), parseInt(positionArr[1]),0 );

                                    }
                                }
                            }
                            if(result.type === "MATCH_GAME"){
                                wx.showModal({
                                    title: '通知',
                                    content: GlobalVariables.otherUserName+"已加入游戏,游戏即将开始",
                                    showCancel:false
                                })
                                //this.$vant.showFailToast('匹配成功,O方先走');
                                //匹配成功则禁用掉四阶和五阶按钮
                                FifthOrder.disabledButton();
                                ForthOrder.disabledButton();
                            }
                            return;
                        } catch (error) {
                            console.log("socket.onmessage.error：" + error);
                            //this.startMatchButton = "开始匹配";
                        }
                    }
                }else{
                    if(result.type === "NEED_REFRESH"){
                        //重新加载游戏
                        wx.restartMiniProgram({
                            success(res) {
                                console.log('重启成功', res)
                            },
                            fail(err) {
                                console.log('重启失败', err)
                            }
                        })
                    }
                    console.log("result.error:");
                    console.log(result);
                    //返回失败信息
                    if(result.errorMsg != ""){
                        wx.showModal({
                            title: '错误',
                            content: result.errorMsg,
                            showCancel:false
                        })
                    }
                    /*wx.showToast({
                        title: result.errorMsg,
                        icon: 'error',
                        duration: 2000
                    })*/
                }
            }catch (error){
                console.log("socket.onmessage.error：" + error);
            }
        });



        this.mainSocketTask.onError ((res) => {
            console.error('WebSocket 连接错误:');
            this.reconnectWebSocket();  
        });
        this.mainSocketTask.onClose ((res) => {
            console.log('WebSocket 连接关闭');
            //发送请求给后端
            //这里解析json数据可能会出现错误,原因未知,出现错误重试一次

        });
}


  
  // 提供一个方法来注册棋子节点  注册棋子方法好像没什么用 todo
    public registerChessNode(chessNode: Node) {  
        this.chessNodes.push(chessNode);  
    }  
  
    // 提供一个方法来注销棋子节点（如果需要的话）  
    public unregisterChessNode(chessNode: Node) {  
        const index = this.chessNodes.indexOf(chessNode);  
        if (index !== -1) {  
            this.chessNodes.splice(index, 1);  
        }  
    }


    public connectSocket(chessNode: Node) {
        this.initWebSocket("1"); // 重新初始化WebSocket
    }

    public sendSocket(type: string,userId: string,userName: string) {
        this.socketEntity.setType(type);
        this.socketEntity.setUserId(userId);
        this.socketEntity.setUserName(userName);
        this.mainSocketTask.send({
            data:JSON.stringify(this.socketEntity),
        });
    }
    public send(message: string) {  
        if (this.mainSocketTask && this.mainSocketTask.readyState === WebSocket.OPEN) {
            this.mainSocketTask.send({
                data:message,
            });
        } else {  
            console.warn('WebSocket 连接未打开，无法发送消息');  
        }  
    }


  
    private reconnectWebSocket() {  
        // 如果已经存在一个socket连接，先关闭它  
        if (this.mainSocketTask && this.mainSocketTask.readyState !== WebSocket.CLOSED) {
            this.mainSocketTask.close();
        }  
  
        // 延迟重连，这里使用指数退避算法
        this.initWebSocket(""); // 重新初始化WebSocket
        const delay = Math.min(Math.pow(2, this.reconnectAttempts) * 1000, 60000); // 最大延迟60秒  
        this.reconnectAttempts++; // 增加重连尝试次数  

        this.mainSocketTask = wx.connectSocket({
            url: GlobalVariables.webSocketPrefix+'://'+globalVariables.serverIp+':'+globalVariables.webSocketPort+'/websocket',
            header: {
                'content-type': 'application/json' // 请求头
            }
        });
    }
    private updateName(userDTO) {
        const otherData = find('Canvas/User/OtherData');
        const SelfData = find('Canvas/User/SelfData');
        if (GlobalVariables.otherUserName != undefined) {
            otherData.getComponent(Label).string = GlobalVariables.otherUserName+"(胜:"+userDTO.otherWinCount+" 负:"+userDTO.otherLoseCount+")";
        }
        if(GlobalVariables.userName != undefined){
            SelfData.getComponent(Label).string = GlobalVariables.userName+"(胜:"+userDTO.winCount+" 负:"+userDTO.loseCount+")";
        }
    }
    private initOtherCell(){
        //获取self节点
        const otherData = find('Canvas/User/OtherData');
        const other = find('Canvas/User/Other');
        const sprite = other.getComponent(Sprite);
        GlobalVariables.defaultSpriteFrame = sprite.spriteFrame;
        if(GlobalVariables.otherUserName !=undefined){
            otherData.getComponent(Label).string = GlobalVariables.otherUserName;
        }
        // 使用微信小游戏的 API 下载图片
        if(GlobalVariables.otherAvatarUrl != undefined){
            wx.downloadFile({
                url: GlobalVariables.otherAvatarUrl,
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
                        });
                    } else {
                        console.error('Failed to download image, status code:', res.statusCode);
                    }
                },
                fail: (err) => {
                    //授权失败 单机游戏 todo 生成随机userid
                    const webSocketManagerNode = find('Canvas/WebSocketManager'); // 路径根据实际情况调整
                    if(webSocketManagerNode){
                        const webSocketManager = webSocketManagerNode.getComponent('WebSocketManager');
                        if(webSocketManager){
                            webSocketManager.initWebSocket("");
                        }
                    }
                    console.error('Failed to download image:', err);
                }
            });
        }
    }
}


