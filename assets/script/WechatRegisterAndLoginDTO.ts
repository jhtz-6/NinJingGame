// GlobalVariables.js

const WechatRegisterAndLoginDTO = {
    jsCode: "",
    openId: "",
    nickName: "",
    avatarUrl: "",
    gender: 0
};

// 如果需要单例模式来访问这个全局变量对象
// 你可以添加一个静态方法来获取这个对象
WechatRegisterAndLoginDTO.getInstance = function () {
    return this;
};

// 导出全局变量对象，以便在其他文件中使用
export default WechatRegisterAndLoginDTO;