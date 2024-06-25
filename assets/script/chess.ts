export class Chess {
    private content: string; // 使用小写类型名称 string
    private color: string;
    private clickable: boolean; // 使用小写类型名称 boolean
    private row: number; // 对于整数类型，使用 number
    private column: number; // 缺少分号，并且使用 number 类型
    private name: string; // 缺少分号，并且使用 number 类型


    // 构造函数（如果需要的话）
    constructor(content: string, color: string, clickable: boolean, row: number, column: number,name: string) {
        this.content = content;
        this.color = color;
        this.clickable = clickable;
        this.row = row;
        this.column = column;
        this.name = name;
    }

    public getContent(): string {
        return this.content;
    }

    public setContent(value: string) {
        this.content = value;
    }

    // row字段的get/set方法
    public getRow(): number {
        return this.row;
    }

    public setRow(value: number) {
        this.row = value;
    }

    public getName(): string {
        return this.name;
    }

    public setName(value: string) {
        this.name = value;
    }

    // column字段的get/set方法
    public getColumn(): number {
        return this.column;
    }

    public setColumn(value: number) {
        this.column = value;
    }

    public getClickable(): boolean {
        return this.clickable;
    }

    public setClickable(value: boolean) {
        this.clickable = value;
    }
}