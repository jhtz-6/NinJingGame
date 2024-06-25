// GlobalVariables.js
import {HandlerClickRequest} from "./HandlerClickRequest";

const GlobalVariables = {
    showReturnButton: false,
    currentChess: "X",
    otherChess: "O",
    screenHeight: 1200,
    screenWidth:2100,
    serverIp:"520myf.com",//110.40.208.47  520myf.com ->localhost
    webSocketPrefix:"wss",//wss->ws
    webSocketPort:8184,//8184->8084
    httpPrefix:"https",//https ->http
    httpPort:8183,//8183->8083
    userId:"",
    userName:"白色方(未登录)",
    userType:"",
    defaultSpriteFrame:null,
    gaming:false,
    canPlayBgMusic:true,
    avatarUrl:"",
    otherUserId:"123456",
    inviteType:"INVITED", //INVITED INVITER
    otherUserName:"黑色方",
    gameType:"SINGLE",//SINGLE 单机、MATCH 匹配、INVITE 邀请
    otherAvatarUrl:"",
    needRestart:true,
    handlerClickRequest: HandlerClickRequest // 假设我们有一个棋盘，上面放置了多个Chess实例

};

// 如果需要单例模式来访问这个全局变量对象
// 你可以添加一个静态方法来获取这个对象
GlobalVariables.getInstance = function () {
    return this;
};

// 导出全局变量对象，以便在其他文件中使用
export default GlobalVariables;