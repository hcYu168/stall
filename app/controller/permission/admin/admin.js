'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 列表 GET
  async index() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const getData = ctx.query;
    ctx.helper.filterPageAndPagesize(getData);
    const data = await admin.index(getData);
    ctx.body = { code: 200, data };
  }

  // 查询 GET /:id
  async show() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const params = ctx.params;
    const data = await admin.show(params.id);
    ctx.body = { code: 200, data };
  }

  // 创建 POST
  async create() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.adminPost', postData);
    const data = await admin.create(postData);
    ctx.body = { code: 200, data };
  }

  // 更新 PUT /:id
  async update() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const params = ctx.params;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.admin', postData);
    await admin.update(params.id, postData);
    ctx.body = { code: 200 };
  }

  // 删除 DELETE /:id
  async destroy() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const params = ctx.params;
    await admin.destroy(params.id);
    ctx.body = { code: 200 };
  }

  // 更新状态 GET /:id/status
  async status() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const params = ctx.params;
    await admin.status(params.id);
    ctx.body = { code: 200 };
  }

  // 角色列表 GET /roles
  async role() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const data = await role.getList();
    ctx.body = { code: 200, data };
  }

  // 修改密码 POST /:id/pwd
  async pwd() {
    const { ctx, service } = this;
    const { admin } = service.permission.admin;
    const params = ctx.params;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.adminPwd', postData);
    await admin.pwd(params.id, postData);
    ctx.body = { code: 200 };
  }
}

module.exports = AdminController;
