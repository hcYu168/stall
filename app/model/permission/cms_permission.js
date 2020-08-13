'use strict';

/* indent size: 2 */
const BaseModel = require('./base_model');
const { MountType } = require('../../lib/type');

module.exports = app => {

  const { INTEGER, STRING, BOOLEAN } = app.Sequelize;

  const Model = app.model.define('cms_permission', {

    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING({ length: 60 }), comment: '权限名称，例如：访问首页', allowNull: false },
    module: { type: STRING({ length: 50 }), comment: '权限所属模块，例如：人员管理', allowNull: false },
    mount: { type: BOOLEAN, comment: '0：关闭 1：开启', defaultValue: 1 },

  }, {
    tableName: 'cms_permission',
    comment: '权限表',
    ...BaseModel,
  });

  Model.associate = function() {
  };

  // 初始化权限
  Model.initPermission = async function() {
    let transaction;
    try {
      transaction = await app.model.transaction();
      const info = Array.from(app.routeMetaInfo.values());
      const permissions = await this.findAll();

      for (const { permission: permissionName, module: moduleName } of info) {
        const exist = permissions.find(
          p => p.name === permissionName && p.module === moduleName
        );
        // 如果不存在这个 permission 则创建之
        if (!exist) {
          await this.create(
            {
              name: permissionName,
              module: moduleName,
            },
            { transaction }
          );
        }
      }

      const permissionIds = [];
      for (const permission of permissions) {
        const exist = info.find(
          meta =>
            meta.permission === permission.name &&
            meta.module === permission.module
        );
        // 如果能找到这个 meta 则挂载之，否则卸载之
        if (exist) {
          permission.mount = MountType.Mount;
        } else {
          permission.mount = MountType.Unmount;
          permissionIds.push(permission.id);
        }
        await permission.save({
          transaction,
        });
      }

      // 相应地要解除关联关系
      if (permissionIds.length) {
        await app.model.Permission.CmsGroupPermission.destroy({
          where: {
            permission_id: {
              [app.Sequelize.Op.in]: permissionIds,
            },
          },
          transaction,
        });
      }
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
    }
  };

  return Model;
};
