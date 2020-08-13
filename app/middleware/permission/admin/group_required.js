'use strict';

const { MountType } = require('../../../lib/type');
const { uniq } = require('lodash');

/**
 * 守卫函数，用于权限组鉴权
 */
module.exports = () => {
  return async function groupRequired(ctx, next) {
    const { app } = ctx;
    const { CmsAdminGroup, CmsGroupPermission, CmsPermission, Sequelize } = ctx.model;
    if (ctx.request.method !== 'OPTIONS') {
      await ctx.service.permission.admin.auth.mountUser();

      // 超级管理员
      if (await ctx.service.permission.admin.auth.isAdmin()) {
        await next();
      } else {
        if (ctx.matched) {
          const routeName = ctx._matchedRouteName || ctx.routerName;
          let endpoint = `${ctx.method} `;
          if (typeof (routeName) === 'object') {
            endpoint += routeName.name;
          } else {
            endpoint += routeName;

          }
          const { permission, module } = app.routeMetaInfo.get(endpoint);
          const adminGroup = await CmsAdminGroup.findAll({
            where: {
              admin_id: ctx.userInfo.id,
            },
          });
          const groupIds = adminGroup.map(v => v.group_id);
          const groupPermission = await CmsGroupPermission.findAll({
            where: {
              group_id: {
                [Sequelize.Op.in]: groupIds,
              },
            },
          });
          const permissionIds = uniq(groupPermission.map(v => v.permission_id));
          const item = await CmsPermission.findOne({
            where: {
              name: permission,
              mount: MountType.Mount,
              module,
              id: {
                [Sequelize.Op.in]: permissionIds,
              },
            },
          });
          if (item) {
            await next();
          } else {
            ctx.throwBizError(4106, '权限不足');
          }
        } else {
          ctx.throwBizError(4106, '权限不足');
        }
      }
    } else {
      await next();
    }
  };
};
