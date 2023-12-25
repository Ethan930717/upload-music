/*
 * @Author: yanghongxuan
 * @Date: 2023-12-21 23:03:48
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-25 21:40:18
 * @Description:
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 不存在文件夹，直接创建
export const Folder = async (reaPath) => {
    if (!fs.existsSync(reaPath)) {
        fs.mkdirSync(reaPath,{
            recursive: true
        });
    }
};
export function formatTime(date, format) {
    const map = {
        'YYYY': date.getFullYear(),
        'MM': ('0' + (date.getMonth() + 1)).slice(-2),
        'DD': ('0' + date.getDate()).slice(-2),
        'HH': ('0' + date.getHours()).slice(-2),
        'mm': ('0' + date.getMinutes()).slice(-2),
        'ss': ('0' + date.getSeconds()).slice(-2)
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
}
