import fs from 'node:fs';
import path from 'path';

export type FolderItem = {
    uriName: string;
    isDir: boolean;
    urlPath: string[];
    items?: FolderItem[];
}

export function toUrl(fditem: FolderItem, baseDir = 'markdown'): string {
    return '/'+ fditem.urlPath.map((item) => encodeURIComponent(item)).join('/')
    // return '/' + baseDir + '/'+ this.urlPath.map((item) => encodeURIComponent(item)).join('/')
}

export function getRootStrcuture(baseDir = 'markdown') {
    const baseFolderPath = path.join(process.cwd(), "src/content", baseDir);

    const getFolderStructure = (urlPath: string[]) => {
        const fatherPath = path.join(baseFolderPath, ...urlPath);
        const items = fs.readdirSync(fatherPath);
        const result: FolderItem[] = [];
        items.forEach((item: string) => {
            const itemPath = path.join(fatherPath, item);
            const stat = fs.lstatSync(itemPath);
            // 如果是目录，递归调用
            if (stat.isDirectory()) {
                const subItems = getFolderStructure([...urlPath, item]);
                // 将子目录结构合并到当前目录结构中
                result.push({
                    uriName: item, 
                    isDir: true, 
                    urlPath: [...urlPath, item], 
                    items: subItems
                });
            } else {
                // 如果是文件，添加到结果中
                result.push({
                    uriName: item, 
                    isDir: false, 
                    urlPath: [...urlPath, item], 
                });
            }
        });
        return result;
    }
    const result: FolderItem[] = getFolderStructure([]);
    return result;
}

export function getRootUriStrcuture() {
    const result = getRootStrcuture()
    function flatten(array: FolderItem[]): FolderItem[] {
        // console.log(array)
        return array.reduce((acc: FolderItem[], val: FolderItem) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    const res = flatten(result);
    // console.log(res)
    return res
}

