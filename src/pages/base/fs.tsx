import fs from 'node:fs';
import path from 'path';

export class FolderItem {
    uriName: string;
    isDir: boolean;
    urlPath: string[];
    items?: FolderItem[];

    constructor(name: string, isDir: boolean, urlPath: string[], items?: FolderItem[]) {
        this.uriName = name;
        this.isDir = isDir;
        this.urlPath = urlPath;
        this.items = items;
    }

    toUrl(baseDir = 'markdown'): string {
        return '/'+ this.urlPath.map((item) => encodeURIComponent(item)).join('/')
        // return '/' + baseDir + '/'+ this.urlPath.map((item) => encodeURIComponent(item)).join('/')
    }
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
                result.push(
                    new FolderItem(item, true, [...urlPath, item], subItems));
            } else {
                // 如果是文件，添加到结果中
                result.push(
                    new FolderItem(item, false, [...urlPath, item]));
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
        return array.reduce((acc: FolderItem[], val: FolderItem) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    return flatten(result)
}
