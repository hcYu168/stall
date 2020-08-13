'use strict';

const Service = require('egg').Service;

class RoleService extends Service {
  // 列表 GET
  async index(data) {
    const { ctx } = this;
    const { CmsGroup } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    const { page, pagesize, name } = data;

    const where = {
      id: {
        [Sequelize.Op.ne]: 1,
      },
    };
    if (name) where.name = name;

    // 获取列表
    const res = await CmsGroup.findAndCountAll({
      where,
      offset: (page - 1) * pagesize,
      limit: pagesize,
      order: [[ 'id', 'desc' ]],
    });

    return res;
  }

  // 查询 GET /:id
  async show(id) {
    const { ctx, service } = this;
    const { CmsGroup } = ctx.model.Permission;
    const { permission } = service.permission.admin;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');
    const info = await CmsGroup.findOne({ where: { id } });
    if (!info) ctx.throwBizError(4000, '无该角色');
    const permissions = await permission.getPermissionListByGroupId(id);
    info.dataValues.permissions = permissions;
    return info;
  }

  // 创建 POST
  async create(data) {
    const { ctx } = this;
    const { CmsGroup } = ctx.model.Permission;

    const { name, info } = data;
    const createData = { name, info };
    const check = await CmsGroup.findOne({ where: { name } });
    if (check) ctx.throwBizError(4000, '该名称已存在');
    const res = await CmsGroup.create(createData);
    return { id: res.id };
  }

  // 更新 PUT /:id
  async update(id, data) {
    const { ctx } = this;
    const { CmsGroup } = ctx.model.Permission;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');

    const checkInfo = await CmsGroup.findOne({ where: { id } });
    if (!checkInfo) ctx.throwBizError(4000, '无该角色');
    const { name, info } = data;
    const updateData = { name, info };
    const check = await CmsGroup.findOne({ where: { name } });
    if (check && check.id !== checkInfo.id) ctx.throwBizError(4000, '该名称已存在');

    await checkInfo.update(updateData);
  }

  // 删除 DELETE /:id
  async destroy(id) {
    const { ctx } = this;
    const { CmsGroup, CmsAdminGroup } = ctx.model.Permission;

    if (parseInt(id) <= 2) ctx.throwBizError(4000, '该角色不能删除');

    const check = await CmsAdminGroup.findOne({
      where: {
        group_id: id,
      },
    });
    if (check) ctx.throwBizError(4000, '该角色下存在管理员，不可删除');
    await CmsGroup.destroy({ where: { id } });
  }

  // 更新 PUT /:id
  async dispatchPermission(data) {
    const { ctx, service } = this;
    const { CmsGroup } = ctx.model.Permission;
    const { permission } = service.permission.admin;

    const { id, permission_ids = [] } = data;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');

    const checkInfo = await CmsGroup.findOne({ where: { id } });
    if (!checkInfo) ctx.throwBizError(4000, '无该角色');

    // 分配权限
    await permission.dispatchPermission({ group_id: id, permission_ids });
  }

  // 角色列表
  async getList() {
    const { ctx } = this;
    const { CmsGroup } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    return await CmsGroup.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1,
        },
      },
      attributes: [ 'id', 'name' ],
    });
  }
}
module.exports = RoleService;
