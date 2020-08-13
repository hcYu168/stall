'use strict';

/* indent size: 2 */

module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const Model = app.model.define('cms_admin_group', {

    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: { type: INTEGER, allowNull: false, comment: '用户id' },
    group_id: { type: INTEGER, allowNull: false, comment: '分组id' },

  }, {
    tableName: 'cms_admin_group',
    comment: '用户分组表',
    indexes: [
      {
        name: 'admin_id_group_id',
        using: 'BTREE',
        fields: [ 'admin_id', 'group_id' ],
      },
    ],
  });

  Model.associate = function() {
    Model.belongsTo(app.model.Permission.CmsGroup, { as: 'group', foreignKey: 'group_id', constraints: false });
  };

  return Model;
};
