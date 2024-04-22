import fs from 'fs';
import path from 'path';

/**
 * @typedef {object} FolderItem
 * @property {string} uriName - 文件或文件夹的URI名称。
 * @property {boolean} isDir - 是否为文件夹。
 * @property {string[]} urlPath - 文件或文件夹的URL路径。
 * @property {FolderItem[] | undefined } items - 文件夹中的项目。
 */


function getRootStrcuture(baseDir = 'public/markdown') {
    const baseFolderPath = path.join(process.cwd(), baseDir);

    /**@type {string[]} */
    const getFolderStructure = (urlPath) => {
        const fatherPath = path.join(baseFolderPath, ...urlPath);
        const items = fs.readdirSync(fatherPath);
        const result = [];

        /**@type {string} */
        items.forEach((item) => {
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

fs.writeFileSync('./public/flat.json', JSON.stringify(getRootStrcuture()))
