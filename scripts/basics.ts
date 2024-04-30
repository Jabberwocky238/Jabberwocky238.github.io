import fs from 'node:fs';
import path from 'node:path';

export interface FolderItem {
    uriName: string;
    isDir: Boolean;
    urlPath: string[];
    items?: FolderItem[];
}

export function getRootStrcuture(DOC_BASE_DIR: string) {
    const baseFolderPath = DOC_BASE_DIR;
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
    const result = getFolderStructure([]);
    return result;
}

export function getRootUriStrcuture(result: FolderItem[]) {
    function flatten(array: FolderItem[]): FolderItem[] {
        return array.reduce((acc: FolderItem[], val) => {
            return val.isDir ? acc.concat(flatten(val.items!)) : acc.concat(val);
        }, []);
    }
    const flat = flatten(result)
    return flat
}