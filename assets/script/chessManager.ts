import { _decorator, Component, Node ,find,AudioSource} from 'cc';
import {Chess} from "./chess";
import {HandlerClickRequest} from "./HandlerClickRequest";
const { ccclass, property } = _decorator;
import GlobalVariables from './GlobalVariables';
import {background} from "./background";
import {FifthOrder} from "./Button/FifthOrder";
import {ForthOrder} from "./Button/ForthOrder";

//棋子位置统一管理入口
@ccclass('chessManager')
export class chessManager extends Component {

    private static _instance: chessManager = null;

    public static get instance(): chessManager {
        if (!this._instance) {
            this._instance = new chessManager();
        }
        return this._instance;
    }

    private chessBoard: Chess[][] = []; // 假设我们有一个棋盘，上面放置了多个Chess实例
    private convert4Map: Map<string, string> = new Map();
    private convert5Map: Map<string, string> = new Map();
    private _handlerClickRequest: HandlerClickRequest = new HandlerClickRequest();
    private _initChessBoard: Chess[][] = []; // 假设我们有一个棋盘，上面放置了多个Chess实例


    public get initChessBoard(): Chess[][] {
        return this._initChessBoard;
    }
    public setInitChessBoard(value: Chess[][]): void {
        this._initChessBoard = value;
    }


    public get handlerClickRequest(): HandlerClickRequest {
        return this._handlerClickRequest;
    }

    public setHandlerClickRequest(value: HandlerClickRequest): void {
        this._handlerClickRequest = value;
    }
    start() {

    }
    onLoad(){
        //坐标同意从左往右,从下到上  下X上O
        this.convert4Map.set("-300-300","00");
        this.convert4Map.set("-100-300","10");
        this.convert4Map.set("100-300","20");
        this.convert4Map.set("300-300","30");

        this.convert4Map.set("-300-100","01");
        this.convert4Map.set("-100-100","11");
        this.convert4Map.set("100-100","21");
        this.convert4Map.set("300-100","31");

        this.convert4Map.set("-300100","02");
        this.convert4Map.set("-100100","12");
        this.convert4Map.set("100100","22");
        this.convert4Map.set("300100","32");

        this.convert4Map.set("-300300","03");
        this.convert4Map.set("-100300","13");
        this.convert4Map.set("100300","23");
        this.convert4Map.set("300300","33");

        //this.getAllChessPosition();

        this.convert5Map.set("-400400","04");
        this.convert5Map.set("-200400","14");
        this.convert5Map.set("0400","24");
        this.convert5Map.set("200400","34");
        this.convert5Map.set("400400","44");


        this.convert5Map.set("-400200","03");
        this.convert5Map.set("-200200","13");
        this.convert5Map.set("0200","23");
        this.convert5Map.set("200200","33");
        this.convert5Map.set("400200","43");


        this.convert5Map.set("-4000","02");
        this.convert5Map.set("-2000","12");
        this.convert5Map.set("00","22");
        this.convert5Map.set("2000","32");
        this.convert5Map.set("4000","42");


        this.convert5Map.set("-400-200","01");
        this.convert5Map.set("-200-200","11");
        this.convert5Map.set("0-200","21");
        this.convert5Map.set("200-200","31");
        this.convert5Map.set("400-200","41");


        this.convert5Map.set("-400-400","00");
        this.convert5Map.set("-200-400","10");
        this.convert5Map.set("0-400","20");
        this.convert5Map.set("200-400","30");
        this.convert5Map.set("400-400","40");

    }
    //获取所有棋子的位置
    getAllChessPosition(num){
        //这里要区分是四阶还是五阶 todo
        let tiledMapNode;
        if(num == 4){
            tiledMapNode = find('Canvas/ForthMap/TiledMap');
        }else {
            tiledMapNode = find('Canvas/FifthMap/TiledMap');
        }
        console.log("tiledMapNode:"+tiledMapNode)
        let childrenLists = tiledMapNode.children;
        for (let i = 0; i < num; i++) {
            this.chessBoard[i] = [];
        }
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                const chess = new Chess("",
                    "", false, i, j,"");
                this.chessBoard[j][i] = chess;
            }
        }
        // 使用 Array.isArray 来检查 childrenLists 是否是数组
        if (Array.isArray(childrenLists)) {
            for (let h = 0; h < childrenLists.length; h++) {
                //构建一个初始的棋子数组
                if(childrenLists[h].name.includes('Chess')){
                    let position = childrenLists[h].position;
                    let chess;
                    if(num == 4){
                        chess = new Chess(position.y == -300 ? "X" : "O",
                            "", position.y == -300, this.convertRow(position.x+""+position.y),
                            this.convertColumn(position.x+""+position.y),childrenLists[h].name);
                    }else{
                        chess = new Chess(position.y == -400 ? "X" : "O",
                            "", position.y == -400, this.convertRow(position.x+""+position.y),
                            this.convertColumn(position.x+""+position.y),childrenLists[h].name);
                    }
                    this.chessBoard[this.convertRow(position.x+""+position.y)][this.convertColumn(position.x+""+position.y)]= chess;
                }
            }
            chessManager.instance.handlerClickRequest.setBoards(this.chessBoard);
            chessManager.instance.setInitChessBoard(this.chessBoard);
        } else {
            // childrenLists 不是数组，你可能需要处理这个异常情况 https://110.40.208.47:8089/game/native/20/20835ba4-6145-4fbc-a58a-051ce700aa3e.90cf4.png
            console.error('childrenLists is not an array:'+childrenLists);
        }


    }
    convertRow(cocosRow){
        if(chessManager.instance.handlerClickRequest.getColumnNumber() == 5){
            return parseInt(this.convert5Map.get(cocosRow)[0]);
        }
        return parseInt(this.convert4Map.get(cocosRow)[0]);
    };
    convertColumn(cocosColumn){
        if(chessManager.instance.handlerClickRequest.getColumnNumber() == 5){
            return parseInt(this.convert5Map.get(cocosColumn)[1]);
        }
        return parseInt(this.convert4Map.get(cocosColumn)[1]);
    };

    clickChess(node){
        background.startGamingMusic();
        //禁用四阶和五阶按钮
        FifthOrder.disabledButton();
        ForthOrder.disabledButton();
        if(chessManager.instance.handlerClickRequest.getBoards() == undefined){
            this.getAllChessPosition(chessManager.instance.handlerClickRequest.getColumnNumber());
        }
        if(chessManager.instance.handlerClickRequest.getCurrentCell() != null ||
            chessManager.instance.handlerClickRequest.getCurrentCell() != undefined){
            chessManager.instance.handlerClickRequest.setBeforeCell(chessManager.instance.handlerClickRequest.getCurrentCell());
        }
        if(node.name.includes('BgChess')){
            chessManager.instance.handlerClickRequest.setCurrentCell(new Chess(chessManager.instance.handlerClickRequest
                    .getBeforeCell().getName().toUpperCase().includes("O") ? "O" : "X",
                "", true, this.convertRow(node.position.x+""+node.position.y),
                this.convertColumn(node.position.x+""+node.position.y),node.name));
        }else{
            chessManager.instance.handlerClickRequest.setCurrentCell(new Chess(node.name.toUpperCase().includes("O") ? "O" : "X",
                "", true, this.convertRow(node.position.x+""+node.position.y),
                this.convertColumn(node.position.x+""+node.position.y),node.name));
        }

        chessManager.instance.handlerClickRequest.setRow(chessManager.instance.handlerClickRequest.getCurrentCell().getRow());
        chessManager.instance.handlerClickRequest.setColumn(chessManager.instance.handlerClickRequest.getCurrentCell().getColumn());
        chessManager.instance.handlerClickRequest.setUserId(GlobalVariables.userId);
        chessManager.instance.handlerClickRequest.setOtherUserId(GlobalVariables.otherUserId);
        chessManager.instance.handlerClickRequest.setUserName(GlobalVariables.userName);
        chessManager.instance.handlerClickRequest.setOtherUserName(GlobalVariables.otherUserName);


        //GlobalVariables.currentChess = chessManager.instance.handlerClickRequest.getCurrentCell().getContent();
        // 创建一个新的 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 定义请求完成的回调函数
        xhr.onload = function () {
            if (xhr.status === 200) {
                // 请求成功，处理响应数据
                //console.log('收到点击请求结果: '+xhr.responseText);
            } else {
                // 请求失败，处理错误
                console.error('请求失败: ' + xhr.statusText);
            }
        };
        // 定义请求出错的回调函数
        xhr.onerror = function () {
            console.error('网络错误');
        };
        // 设置请求方法和 URL
        xhr.open('POST', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'+GlobalVariables.httpPort+'/ningJinGame/zouDing/wxHandleCellClick', true);
        // 设置请求头（如果需要的话）
        xhr.setRequestHeader('Content-Type', 'application/json');
        // 发送请求，并传入请求体（如果需要的话）
        xhr.send(JSON.stringify(chessManager.instance.handlerClickRequest));

    }


     onNodeTouchStart(node) {
        try{
            GlobalVariables.gaming = true;
            //下X上O
            let selectVoice = node.getComponents(AudioSource)[0];
            //联机时 己方点击了对方的可移动位置 则禁止生效
            if(GlobalVariables.gameType != "SINGLE" && GlobalVariables.userType == "other" && node.name.includes('BgChess')){
                let errorVoice = node.getComponents(AudioSource)[1];
                errorVoice.playOneShot(errorVoice.clip, 1);
                return;
            }
            //选择的不是己方棋子并且不是单机 则禁止选择
            if(!node.name.includes('BgChess') && !node.name.toUpperCase().includes(GlobalVariables.currentChess.toUpperCase())
                && !this.isPureNumber(GlobalVariables.otherUserId)){
                let errorVoice = node.getComponents(AudioSource)[1];
                errorVoice.playOneShot(errorVoice.clip, 1);
                return;
            }else{
                selectVoice.playOneShot(selectVoice.clip, 1);
                this.clickChess(node);
            }
        }catch (e) {
            console.error("chessManager.onNodeTouchStart.error.name:{}",node.name,e);
        }

    }

      isPureNumber(str: string): boolean {
        // 使用正则表达式检查字符串是否仅包含数字
        const regex = /^\d+$/;
        return regex.test(str);
    }
    changeColumnNumber() {
        // 创建一个新的 XMLHttpRequest 对象
        var changeColumnNumberXhr = new XMLHttpRequest();
        // 定义请求完成的回调函数
        changeColumnNumberXhr.onload = function () {
            if (changeColumnNumberXhr.status === 200) {
                // 请求成功，处理响应数据
                //console.log('收到点击请求结果: '+xhr.responseText);
            } else {
                // 请求失败，处理错误
                console.error('请求失败: ' + changeColumnNumberXhr.statusText);
            }
        };
        // 定义请求出错的回调函数
        changeColumnNumberXhr.onerror = function () {
            console.error('网络错误');
        };
        // 设置请求方法和 URL
        changeColumnNumberXhr.open('POST', GlobalVariables.httpPrefix+'://'+GlobalVariables.serverIp+':'+GlobalVariables.httpPort
            +'/ningJinGame/zouDing/changeColumnNumber', true);
        // 设置请求头（如果需要的话）
        changeColumnNumberXhr.setRequestHeader('Content-Type', 'application/json');
        // 发送请求，并传入请求体（如果需要的话）
        changeColumnNumberXhr.send(JSON.stringify(chessManager.instance.handlerClickRequest));
    }
}


