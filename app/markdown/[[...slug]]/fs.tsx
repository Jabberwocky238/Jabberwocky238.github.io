import fs from 'fs';
import path from 'path';

export interface FolderItem {
    name: string;
    isDir: boolean;
    items?: FolderItem[];
    path?: string;
}

export function getRootStrcuture() {
    const baseFolderPath = path.join(process.cwd(), 'markdown');
    const getFolderStructure = (folder: string) => {
        const items = fs.readdirSync(folder);
        const result: FolderItem[] = [];
        items.forEach(item => {
            if (item.startsWith('assets')) {
                return
            }
            const itemPath = folder + '/' + item;
            const stat = fs.lstatSync(itemPath);

            // 如果是目录，递归调用
            if (stat.isDirectory()) {
                const subItems = getFolderStructure(itemPath);
                // 将子目录结构合并到当前目录结构中
                result.push({ 
                    name: decodeURIComponent(item), 
                    isDir: true, 
                    items: subItems 
                });
            } else {
                // 如果是文件，添加到结果中
                result.push({ 
                    name: decodeURIComponent(item), 
                    isDir: false, 
                    path: folder.slice(baseFolderPath.length) + '/' + item
                });
            }
        });
        return result;
    }
    const result: FolderItem[] = getFolderStructure(baseFolderPath);
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
