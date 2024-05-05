import { makeAutoObservable } from "mobx";

export interface FolderItem {
    uriName: string;
    isDir: Boolean;
    urlPath: string[];
    items?: FolderItem[];
}

class Counter {
    constructor() {
        // 参数1：target 把谁变成响应式(可观察)；参数2：指定哪些属性或方法变成可观察
        makeAutoObservable(this, {}, { autoBind: true })
    }
    // 当前的初始化状态数据
    sidebarShow = true
    graphShow = false

    toggleSidebar() {
        this.sidebarShow = !this.sidebarShow
        if(this.graphShow){
            this.graphShow = !this.graphShow
        }
        console.log("toggleSidebar")
    }
    toggleGraph() {
        this.graphShow = !this.graphShow
        if(this.sidebarShow){
            this.sidebarShow = !this.sidebarShow
        }
        console.log("toggleGraph")
    }
    
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Counter()