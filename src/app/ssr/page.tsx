import fs from 'fs';
import path from 'path';
import { micromark } from 'micromark';

export default function Home() {
  const filePath = path.join(process.cwd(), 'src', 'doc', 'FastV.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const htmlString = micromark(fileContent);
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}
