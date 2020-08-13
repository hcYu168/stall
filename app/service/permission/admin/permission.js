'use strict';

const Service = require('egg').Service;
const { MountType } = require('../../../lib/type');
const { get } = require('lodash');

class PermissionService extends Service {
  // 权限初始化
  async init() {
    const { app, ctx } = this;
    const { CmsPermission } = ctx.model.Permission;
    const router = app.router.stack;
    const routeMetaInfo = new Map();
    for (const key in router) {
      if (router.hasOwnProperty(key)) {
        let { name, methods } = router[key];
        const method = methods[methods.length - 1];
        const permission = name;
        if (typeof (permission) !== 'object' || !permission || permission.type !== 'admin') continue;
        name = permission.permission;
        const endpoint = `${method} ${permission.name}`;
        if (permission.mount) routeMetaInfo.set(endpoint, { permission: name, module: permission.module });
      }
    }
    app.routeMetaInfo = routeMetaInfo;
    await CmsPermission.initPermission();
  }

  // 获取角色权限列表
  async getPermissionListByGroupId(group_id) {
    const { ctx } = this;
    const { CmsGroupPermission, CmsPermission } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    const groupPermission = await CmsGroupPermission.findAll({ where: { group_id } });
    const permissionIds = groupPermission.map(v => v.permission_id);

    const permissions = await CmsPermission.findAll({
      where: {
        mount: MountType.Mount,
        id: {
          [Sequelize.Op.in]: permissionIds,
        },
      },
    });
    return permissions;
  }

  // 获取所有可分配权限
  async getAllPermissions() {
    const { ctx } = this;
    const { CmsPermission } = ctx.model.Permission;
    const permissions = await CmsPermission.findAll({
      where: {
        mount: MountType.Mount,
      },
    });
    const modules = await CmsPermission.findAll({
      where: {
        mount: MountType.Mount,
      },
      attributes: [ 'module' ],
      group: 'module',
    });
    const list = [];
    for (let index = 0; index < modules.length; index++) {
      const row = modules[index];
      const title = row.module;
      const permission = [];
      permissions.forEach(v => {
        const item = {
          id: get(v, 'id'),
          name: get(v, 'name'),
          module: get(v, 'module'),
        };
        if (title === item.module) permission.push(item);
      });
      if (permission.length > 0)list.push({ title, permission });
    }
    return list;
  }

  // 分配权限
  async dispatchPermission(data) {
    const { ctx } = this;
    const { CmsPermission, CmsGroupPermission } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    const { permission_ids = [], group_id } = data;
    for (const id of permission_ids || []) {
      const permission = await CmsPermission.findOne({
        where: {
          id,
          mount: MountType.Mount,
        },
      });
      if (!permission) ctx.throwBizError(4000, `id=${id}权限不存在`);
    }

    let transaction;
    try {
      transaction = await ctx.model.Permission.transaction();
      const insertPermissionIds = [];
      for (const id of permission_ids) {
        await CmsGroupPermission.create({
          group_id,
          permission_id: id,
        }, { transaction });
        if (!insertPermissionIds.includes(id)) insertPermissionIds.push(id);
      }
      // 删除旧权限并且这一次未未分配的
      await CmsGroupPermission.destroy({
        where: {
          group_id,
          permission_id: {
            [Sequelize.Op.notIn]: insertPermissionIds,
          },
        },
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      if (transaction) await transaction.rollback();
    }
  }
}
module.exports = PermissionService;
