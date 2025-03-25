# 使用 Node.js 官方镜像作为基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install -g pnpm
RUN pnpm install

# 复制所有源代码到容器中
COPY . .

# 设置环境变量
ENV NEXT_PUBLIC_API_URL=https://api.qz.run

# 构建应用
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start"]
# CMD ["pnpm", "next:start"]