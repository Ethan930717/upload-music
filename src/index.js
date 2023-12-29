/*
 * @Author: yanghongxuan
 * @Date: 2023-12-21 21:31:51
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2023-12-25 22:00:49
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
import server from 'koa-static';
import path from 'path';
import router from './routes/index.js';
import { __dirname } from './utils.js';
const app = new Koa();
// 跨域
app.use(async (ctx, next) => {
    const allowedOrigins = ['https://kimoji.club', 'https://mirror.kimoji.club'];
    const origin = ctx.request.header.origin;
    if (allowedOrigins.includes(origin)) {
        ctx.set('Access-Control-Allow-Origin', origin);
    } else {
        ctx.set('Access-Control-Allow-Origin', 'false'); // 或者不设置，或者返回错误
    }
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
app.use(koaBody({
    multipart: true,
    jsonLimit: '100mb', // body体的大小
    formidable: {
        keepExtensions: true,  // 保持文件的扩展名
        maxFileSize: 100 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
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
// 初始化路由
app.use(router.routes()).use(router.allowedMethods());
// 设置 public 目录作为静态文件目录
app.use(server(path.join(__dirname, '../public'),{
    gzip: true,
    maxAge: 30 * 24 * 60 * 60,
}))

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});