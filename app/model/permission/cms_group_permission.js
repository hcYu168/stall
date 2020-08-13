'use strict';

/* indent size: 2 */

module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const Model = app.model.define('cms_group_permission', {

    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    group_id: { type: INTEGER, allowNull: false, comment: '分组id' },
    permission_id: { type: INTEGER, allowNull: false, comment: '权限id' },

  }, {
    tableName: 'cms_group_permission',
    comment: '分组权限关联表',
    indexes: [
      {
        name: 'group_id_permission_id',
        using: 'BTREE',
        fields: [ 'group_id', 'permission_id' ],
      },
    ],
  });

  Model.associate = function() {
  };

  return Model;
};
