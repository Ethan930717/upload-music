/*
 * @Author: yanghongxuan
 * @Date: 2023-12-25 21:00:07
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-25 22:01:10
 * @Description:
 */
import fs from 'fs';
import path from 'path';
import { Folder, __dirname, formatTime } from '../utils.js';

class UploadController {
    index(ctx){
        const file = ctx.request.files.musicfile;
        try {
            const dirName = formatTime(new Date(), "YYYY-MM-DD");
            const ext = path.extname(file.originalFilename);
            // 设置新的文件保存目录
            const dir = `/home/file.kimoji.club/data/music/${dirName}`;
            // 检查文件夹是否存在，如果不存在则新建文件夹
            Folder(dir);
            const fileName = `${new Date().getTime()}${ext}`;
            const saveFilePath = `${dir}/${fileName}`;
            // 创建可读流
            const reader = fs.createReadStream(file['filepath']);
            // 创建可写流
            const upStream = fs.createWriteStream(saveFilePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            ctx.status = 200;
            ctx.body = {
                code: 1,
                message: 'File uploaded successfully.',
                url: `/music/${dirName}/${fileName}` // 根据需要更新返回的文件URL
            };
        } catch (err) {
            console.log('err: ', err);
            ctx.status = 500;
            ctx.body = {
                code: 0,
                message: 'File upload error.' + err.toString(),
            };
        }
    }
}
export default UploadController
