'use strict';

/* indent size: 2 */
const { BaseModel } = require('./base_model');

module.exports = app => {

  const { INTEGER, STRING, DATE } = app.Sequelize;

  const Model = app.model.define('cms_admin', {

    id: { type: INTEGER(11).UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true, comment: '自增id' },
    username: { type: STRING(20), allowNull: false, comment: '账号' },
    password: { type: STRING(32), allowNull: false, comment: '密码' },
    name: { type: STRING(30), defaultValue: null, comment: '名称' },
    avatar: { type: STRING(120), defaultValue: null, comment: '头像' },
    phone: { type: STRING(20), defaultValue: null, comment: '手机号码' },
    email: { type: STRING(30), defaultValue: null, comment: '邮箱' },
    status: { type: INTEGER(1), allowNull: false, defaultValue: 1, comment: '管理员登录状态1启动2禁用' },
    login_num: { type: INTEGER(11), allowNull: false, defaultValue: 0, comment: '登录次数' },
    login_time: { type: DATE, defaultValue: null, comment: '最后一次登录时间' },
    login_err_num: { type: INTEGER(3), allowNull: false, defaultValue: 0, comment: '当天累计登录错误次数' },
    login_err_time: { type: DATE, defaultValue: null, comment: '最后一次登录错误时间' },
    is_lock: { type: INTEGER(2), allowNull: false, defaultValue: 2, comment: '是否当天禁止登录,1:是;2:否' },

  }, {
    tableName: 'cms_admin',
    comment: '管理员表',
    ...BaseModel,
    indexes: [
      {
        name: 'username_del',
        unique: true,
        fields: [ 'username', 'delete_time' ],
      },
      {
        name: 'email_del',
        unique: true,
        fields: [ 'email', 'delete_time' ],
      },
      {
        name: 'phone_del',
        unique: true,
        fields: [ 'phone', 'delete_time' ],
      },
    ],
  });

  Model.associate = function() {
    Model.hasMany(app.model.Permission.CmsAdminGroup, { as: 'groups', foreignKey: 'admin_id', constraints: false });
  };

  return Model;
};
