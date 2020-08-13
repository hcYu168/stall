'use strict';

/* indent size: 2 */
const BaseModel = require('./base_model');

module.exports = app => {

  const { INTEGER, STRING } = app.Sequelize;

  const Model = app.model.define('cms_group', {

    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING({ length: 60 }), allowNull: false, comment: '分组名称，例如：搬砖者' },
    info: { type: STRING({ length: 255 }), allowNull: true, comment: '分组信息：例如：搬砖的人' },
    level: { type: INTEGER(2), defaultValue: 3, comment: '分组级别 1：root 2：guest 3：user（root、guest分组只能存在一个)' },

  }, {
    tableName: 'cms_group',
    comment: '分组表',
    ...BaseModel,
    indexes: [
      {
        name: 'name_del',
        unique: true,
        fields: [ 'name', 'delete_time' ],
      },
    ],
  });

  Model.associate = function() {
  };

  return Model;
};
