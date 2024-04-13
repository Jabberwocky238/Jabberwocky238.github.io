import fs from 'fs';
import path from 'path';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';



export default function Home() {
  const filePath = path.join(process.cwd(), 'src', 'doc', 'FastV.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const htmlString = micromark(fileContent, null, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  });
  const regex = /!\[\[([\w| |\.]+)\]\]/g;
  const replacedStr = htmlString.replaceAll(regex, (match, group1) => {
    return '<img src="' + group1 + '"></img>';
  });
  return <div dangerouslySetInnerHTML={{ __html: replacedStr }} />;
}
