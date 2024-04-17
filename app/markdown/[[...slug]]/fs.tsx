import fs from 'fs';
import path from 'path';

export interface FolderItem {
    name: string;
    idDir: boolean;
    items?: FolderItem[];
    path?: string;
}

export function getRootStrcuture() {
    const folderPath = path.join(process.cwd(), 'markdown');
    const result: FolderItem[] = getFolderStructure(folderPath);

    function getFolderStructure(folderPath: string) {
        const items = fs.readdirSync(folderPath);
        const result: FolderItem[] = [];

        items.forEach(item => {
            if (item.startsWith('assets')) {
                return
            }
            const itemPath = path.join(folderPath, item);
            const stat = fs.lstatSync(itemPath);

            // 如果是目录，递归调用
            if (stat.isDirectory()) {
                const subItems = getFolderStructure(itemPath);
                // 将子目录结构合并到当前目录结构中
                result.push({ 
                    name: decodeURIComponent(item), 
                    idDir: true, 
                    items: subItems 
                });
            } else {
                // 如果是文件，添加到结果中
                result.push({ 
                    name: decodeURIComponent(item), 
                    idDir: false, 
                    path: path.join(folderPath.slice(process.cwd().length), item) 
                });
            }
        });
        return result;
    }
    return result;
}
