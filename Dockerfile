FROM node:14.16.0-alpine3.11 as base

MAINTAINER lixianjun

## apk mirror sources
# RUN set -eux && sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# RUN set -eux && sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN set -eux && sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

FROM base as builder

EXPOSE 3000
EXPOSE 9000

WORKDIR www

# set yarn registry
RUN yarn config set registry https://registry.npm.taobao.org
## set sharp chiness mirror
## see https://sharp.pixelplumbing.com/install#chinese-mirror
RUN yarn config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"

COPY ["package.json", "yarn.lock",".yarnclean", "./patches", "./"]

# dependancies of node-gyp: python build-base
# see https://github.com/nodejs/node-gyp
# dependancies of mozjpeg: autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev
# see https://github.com/imagemin/mozjpeg-bin/issues/47#issuecomment-699629892

RUN apk add --no-cache --virtual .build-deps build-base autoconf automake libtool pkgconf nasm \
&& apk add --no-cache at \
ffmpeg \
python3 \
tiff jpeg zlib zlib-dev \
&& yarn global add node-gyp --production \
&& yarn install --production \
&& yarn postinstall \
&& yarn autoclean --force \
&& yarn cache clean \
&& apk del .build-deps

## production ##

FROM base as production

WORKDIR www

RUN apk add --no-cache ffmpeg git openssh at
COPY --from=builder /www .

COPY . .

## EXEC TYPE
CMD ["./start.sh"]
# CMD ["node", "./webhook.js]
# CMD ["/bin/sh"]
