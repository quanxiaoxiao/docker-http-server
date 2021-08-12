FROM node:14.15.0-alpine

RUN apk update && apk add bash tzdata \
  && rm -rf /tmp/* /var/lib/apt/list/* \
  && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app

COPY package.json .

COPY npm.taobao.sh .
RUN ./npm.taobao.sh

RUN npm install --production

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "run", "start"]
