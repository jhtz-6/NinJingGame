
import {chessManager} from "db://assets/script/chessManager";
import GlobalVariables from "db://assets/script/GlobalVariables";

export default class XmlHttpManager  {

    queryInvitationCode(callback: (result: string | null) => void): void {
        var xhr = new XMLHttpRequest();
        // 定义请求完成的回调函数
        xhr.onload = function () {
            if (xhr.status === 200) {
                // 请求成功，处理响应数据
                console.log("queryInvitationCode.responseText");
                console.log(xhr.responseText);
                const responseData = JSON.parse(xhr.responseText);
                callback(responseData);
            } else {
                // 请求失败，处理错误
                console.error('queryInvitationCode请求失败: ' + xhr.statusText);
                callback(null);
            }
        };
        // 定义请求出错的回调函数
        xhr.onerror = function () {
            console.error('queryInvitationCode网络错误');
            callback(null);
        };
        // 设置请求方法和 URL
        xhr.open('GET', GlobalVariables.httpPrefix+'://' + GlobalVariables.serverIp + ':'+
            GlobalVariables.httpPort+'/ningJinGame/zouDing/generateInvitationCode?userId='
            + GlobalVariables.userId+'&level='+chessManager.instance.handlerClickRequest.getColumnNumber(), true);
        xhr.send();
    }


}


