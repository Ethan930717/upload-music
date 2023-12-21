import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 不存在文件夹，直接创建
export const Folder = async (reaPath) => {
  const absPath = path.resolve(__dirname, reaPath);
  try {
    await fs.promises.stat(absPath);
  } catch (e) {
    // {recursive: true} 这个配置项是配置自动创建多层文件夹
    await fs.promises.mkdir(absPath, { recursive: true });
  }
};
// 执行建立需要储存的数据文件夹
