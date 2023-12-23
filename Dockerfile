# 使用 Node.js 16.14.2 的 Alpine 版本作为基础镜像
FROM node:16.14.2-alpine

# 设置容器内的工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 到工作目录
COPY package.json pnpm-lock.yaml ./

# 设置 npm 镜像源并全局安装 pnpm，然后安装依赖
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install pm2 pnpm -g && \
    pnpm install

# 复制应用程序文件到工作目录
COPY src ./src
COPY public ./public

# 容器启动时的命令
CMD ["pm2-runtime", "src/index.js"]
