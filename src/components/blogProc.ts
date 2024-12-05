import fs from 'fs';
import path from 'path';
import { micromark } from 'micromark';

const postsDirectory = path.join(process.cwd(), 'blogs');

const postsObjs = fs.readdirSync(postsDirectory).map(filename => {
    const date = filename.slice(0, 10);
    const title = filename.slice(11);
    return { date, title }
})

type Params = {
    date: string
    title: string
}

const readContent = (filename: string) => {
    let filePath = path.join(postsDirectory, filename);
    const isPurefile = fs.lstatSync(filePath + ".md").isFile();
    if (!isPurefile) {
        const isIndexFile = fs.lstatSync(filePath + "/index.md").isFile();
        if (!isIndexFile) {
            throw new Error(`文件夹${filePath}内没有index.md文件`);
        }
        filePath = filePath + "/index";
    }
    const postContent = fs.readFileSync(path.join(postsDirectory, `${filePath}.md`), 'utf8');
    return postContent;
}


const posts = (function () {
    // 根据文件名获取文件内容
    return postsObjs.map(({ date, title }, index) => {
        let filePath = path.join(postsDirectory, title);
        const isPurefile = fs.lstatSync(filePath + ".md").isFile();
        if (!isPurefile) {
            const isIndexFile = fs.lstatSync(filePath + "/index.md").isFile();
            if (!isIndexFile) {
                throw new Error(`文件夹${filePath}内没有index.md文件`);
            }
            filePath = filePath + "/index";
        }
        const postContent = fs.readFileSync(path.join(postsDirectory, `${filePath}.md`), 'utf8');
        // 处理文件内容，例如解析Markdown等
        const content = micromark(postContent); // 这里应该是处理后的内容
        return {
            date,
            title,
            originalContent: postContent,
            content
        }
    });
})();

export { postsObjs };
export type { Params };
