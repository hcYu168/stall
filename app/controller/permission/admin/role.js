'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  // 列表 GET
  async index() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const getData = ctx.query;
    ctx.helper.filterPageAndPagesize(getData);
    const data = await role.index(getData);
    ctx.body = { code: 200, data };
  }

  // 查询 GET /:id
  async show() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const params = ctx.params;
    const data = await role.show(params.id);
    ctx.body = { code: 200, data };
  }

  // 创建 POST
  async create() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.role', postData);
    const data = await role.create(postData);
    ctx.body = { code: 200, data };
  }

  // 更新 PUT /:id
  async update() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const params = ctx.params;
    const schema = 'schema.permission.admin';
    const postData = ctx.request.body;
    // 校验数据
    await ctx.validate(schema + '.role', postData);
    await role.update(params.id, postData);
    ctx.body = { code: 200 };
  }

  // 删除 DELETE /:id
  async destroy() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const params = ctx.params;
    await role.destroy(params.id);
    ctx.body = { code: 200 };
  }

  // 查询所有可分配的权限
  async permission() {
    const { ctx, service } = this;
    const { permission } = service.permission.admin;
    const data = await permission.getAllPermissions();
    ctx.body = { code: 200, data };
  }

  // 分配权限 POST /:id/permission
  async dispatchPermission() {
    const { ctx, service } = this;
    const { role } = service.permission.admin;
    const params = ctx.params;
    const postData = ctx.request.body;
    Object.assign(postData, params);
    await role.dispatchPermission(postData);
    ctx.body = { code: 200 };
  }
}

module.exports = RoleController;
