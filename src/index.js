/*
 * @Author: yanghongxuan
 * @Date: 2023-12-21 21:31:51
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-23 00:01:21
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
// koabody
app.use(koaBody({
    multipart: true,
    jsonLimit: '150mb', // body体的大小
    formidable: {
        uploadDir, // 上传文件的保存路径
        keepExtensions: true,  // 保持文件的扩展名
        maxFileSize: 150 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
    }
}))
// 上传文件类型限制
app.use(async (ctx,next) => {
    // 检查文件类型是否为音频
    if (ctx.request?.files?.musicfile && !ctx.request?.files?.musicfile?.mimetype.startsWith('audio/')) {
        ctx.throw(400, 'Only audio files are accepted');
    }
    await next()
});
// error
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 错误处理逻辑
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message
      }
    };
  }
});


// 上传服务
router.post('/upload', async (ctx) => {
    const file = ctx.request.files.musicfile; // 获取上传的文件
    // 返回文件的访问URL
    console.log('File uploaded successfully: ',file.toJSON());
    ctx.status = 200
    ctx.body = {
        message: 'File uploaded successfully.',
        url: `/uploads/${file?.newFilename || file.name}` // 返回文件的URL
    };
});
app.use(router.routes()).use(router.allowedMethods());
// 设置 public 目录作为静态文件目录
app.use(server(path.join(__dirname, '../public'),{
    gzip: true,
    maxAge: 30 * 24 * 60 * 60,
}))

app.listen(3000, () => {
    Folder(uploadDir)
    console.log('Server started on http://localhost:3000');
});



