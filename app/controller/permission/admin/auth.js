'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  // 登录 POST
  async login() {
    const { ctx, service } = this;
    const { auth } = service.permission.admin;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.login', postData);
    // 登录
    const data = await auth.login(postData);
    ctx.body = { code: 200, data };
  }

  // 退出登录 GET
  async logout() {
    const { app, ctx, config } = this;
    const { adminPrefix } = config.redisCache;
    await app.redis.get('default').hdel(adminPrefix, ctx.userInfo.id);
    ctx.body = { code: 200 };
  }

  // 获取用户信息 GET
  async info() {
    const { ctx, service } = this;
    const { auth } = service.permission.admin;
    console.log('==========1==============');
    const data = await auth.info();
    console.log('===========2=============');
    ctx.body = { code: 200, data };
  }
}

module.exports = AuthController;
