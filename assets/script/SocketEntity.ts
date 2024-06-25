
export class SocketEntity {
    private type: string;
    private friendUserId: string;
    private columnNumber: number;
    private userId: string;
    private otherUserId: string;
    private userName: string;

    // 构造方法
    constructor(
        type: string = '',
        friendUserId: string = '',
        columnNumber: number = 0,
        userId: string = '',
        otherUserId: string = '',
        userName: string = ''
    ) {
        this.type = type;
        this.friendUserId = friendUserId;
        this.columnNumber = columnNumber;
        this.userId = userId;
        this.otherUserId = otherUserId;
        this.userName = userName;
    }

    // 类型属性的getter和setter
    setType(type: string) {
        this.type = type;
    }
    getType() {
        return this.type;
    }

    // friendUserId属性的getter和setter
    setFriendUserId(friendUserId: string) {
        this.friendUserId = friendUserId;
    }
    getFriendUserId() {
        return this.friendUserId;
    }

    // columnNumber属性的getter和setter
    setColumnNumber(columnNumber: number) {
        this.columnNumber = columnNumber;
    }
    getColumnNumber() {
        return this.columnNumber;
    }

    // userId属性的getter和setter
    setUserId(userId: string) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }

    // otherUserId属性的getter和setter
    setOtherUserId(otherUserId: string) {
        this.otherUserId = otherUserId;
    }
    getOtherUserId() {
        return this.otherUserId;
    }

    // userName属性的getter和setter
    setUserName(userName: string) {
        this.userName = userName;
    }
    getUserName() {
        return this.userName;
    }
}