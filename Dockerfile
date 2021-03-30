FROM node:lts-alpine

MAINTAINER lixianjun

EXPOSE 3000
WORKDIR www

RUN set -eux && sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories 
RUN apk add git openssh
RUN apk add ffmpeg
# mozjpeg: see https://github.com/imagemin/mozjpeg-bin/issues/47#issuecomment-699629892
RUN apk add autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev

COPY package*.json yarn.lock patches .

# set yarn registry
RUN yarn config set registry https://registry.npm.taobao.org

RUN yarn install
RUN yarn postinstall
# If you are building your code for production
# RUN npm ci --only=production

# VOLUME ["www/contents"]

COPY webhook.js .
COPY . .
CMD ["node", "webhook.js"]