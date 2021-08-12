/* eslint no-use-before-define: 0 */
const http = require('http');
const Koa = require('koa');
const router = require('@quanxiaoxiao/router');
const compress = require('koa-compress');
const config = require('./config');
const apis = require('./apis');
const logger = require('./logger');

const app = new Koa();

app.use(async (ctx, next) => {
  const { method, originalUrl } = ctx;
  ctx.logger = logger;
  const { ip } = ctx;
  const start = Date.now();

  function handleClose() {
    ctx.logger.info(`${ctx.path} \`${ctx.method}\` x-> ${ip}`);
    ctx.res.off('finish', handleFinish);
  }

  function handleFinish() {
    ctx.logger.info(`${ctx.path} \`${ctx.method}\` -> ${ip} ${Date.now() - start}ms`);
    ctx.res.off('close', handleClose);
  }

  ctx.res.once('close', handleClose);
  ctx.res.once('finish', handleFinish);
  try {
    await next();
  } catch (error) {
    logger.error(`${originalUrl} \`${method}\`  ${error.message}`);
    ctx.res.off('close', handleClose);
    ctx.res.off('finish', handleFinish);
    throw error;
  }
});

app.use(compress());

app.use(router({
  ...apis,
}));

const server = http.createServer({}, app.callback());

server.listen(config.server.port, () => {
  logger.info(`server listen at port: ${config.server.port}`);
});

process.on('uncaughtException', (error) => {
  console.error(error);
  logger.error(`${Date.now()} ${error.message}`);
  const killTimer = setTimeout(() => {
    process.exit(1);
  }, 3000);
  killTimer.unref();
});
