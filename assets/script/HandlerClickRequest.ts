import { Chess } from "./chess";

export class HandlerClickRequest {
    private boards: Chess[][];
    private currentCell: Chess;
    private beforeCell: Chess;
    private column: number;
    private row: number;
    private columnNumber: number;
    private userId: string;
    private userName: string;
    private otherUserId: string;
    private otherUserName: string;
    private inviteType: "INVITER" | "INVITED" = "INVITER"; // 直接赋值
    private gameType: "SINGLE" | "MATCH" | "INVITE" = "SINGLE"; // 添加其他可能的类型，并赋值
    // 构造函数
    constructor(
    ) {

    }

    setGameType(gameType: "SINGLE" | "MATCH" | "INVITE") {
        this.gameType = gameType; // 现在这里不会有类型错误，因为参数类型和属性类型一致
    }
    getGameType() {
        return this.gameType;
    }

    setInviteType(inviteType: "INVITER" | "INVITED") { // 如果只有这一个值，可以保持原样
        this.inviteType = inviteType;
    }
    getInviteType() {
        return this.inviteType;
    }

    // 方法用于设置boards属性
    setBoards(boards: Chess[][]) {
        this.boards = boards;
    }
    getBoards() {
        return this.boards;
    }

    setOtherUserName(otherUserName: string) {
        this.otherUserName = otherUserName;
    }
    getOtherUserName() {
        return this.otherUserName;
    }

    setUserName(userName: string) {
        this.userName = userName;
    }
    getUserName() {
        return this.userName;
    }


    setOtherUserId(otherUserId: string) {
        this.otherUserId = otherUserId;
    }
    getOtherUserId() {
        return this.otherUserId;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }

    // 方法用于设置currentCell属性
    setCurrentCell(currentCell: Chess) {
        this.currentCell = currentCell;
    }
    getCurrentCell() {
        return this.currentCell;
    }

    // 方法用于设置beforeCell属性
    setBeforeCell(beforeCell: Chess) {
        this.beforeCell = beforeCell;
    }
    // 方法用于设置beforeCell属性
    getBeforeCell() {
        return this.beforeCell;
    }

    // 方法用于设置column属性
    setColumn(column: number) {
        this.column = column;
    }

    // 方法用于设置row属性
    setRow(row: number) {
        this.row = row;
    }

    // 方法用于设置columnNumber属性
    setColumnNumber(columnNumber: number) {
        this.columnNumber = columnNumber;
    }
    getColumnNumber() {
        return this.columnNumber;
    }

}