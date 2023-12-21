/*
 * @Author: yanghongxuan
 * @Date: 2023-12-21 21:31:51
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-21 23:36:20
 * @Description:
 */
/*
 * @Author: yanghongxuan
 * @Date: 2023-12-21 21:31:51
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-21 23:00:18
 * @Description:
 */
import Koa from 'koa';
import { koaBody } from 'koa-body';
import Router from 'koa-router';
import server from 'koa-static';
import path from 'path';
import { __dirname, Folder } from './utils.js';


const app = new Koa();
const router = new Router();
// 跨域
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200;
    } else {
      await next();
    }
});
// 上传路径
const uploadDir = path.join(__dirname, '../public/uploads')
// 上传服务
router.post('/upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir, // 上传文件的保存路径
        keepExtensions: true  // 保持文件的扩展名
    }
}), async (ctx) => {
    const file = ctx.request.files.musicfile; // 获取上传的文件
    console.log('file: ', file);
    // // 返回文件的访问URL
    ctx.body = {
        message: 'File uploaded successfully.',
        url: `/uploads/${file.newFilename}` // 返回文件的URL
    };

});
app.use(router.routes()).use(router.allowedMethods());
// 设置 public 目录作为静态文件目录
app.use(server(path.join(__dirname, '../public')))

app.listen(3000, () => {
    Folder(uploadDir)
    console.log('Server started on http://localhost:3000');
});
