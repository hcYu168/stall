'use strict';

const Service = require('egg').Service;

const moment = require('moment');
const { GroupLevel, MountType } = require('../../../lib/type');
const { set, uniq } = require('lodash');

class AuthService extends Service {
  // 登录
  async login(data) {
    const { ctx, service } = this;
    const { token } = service.permission.utils;
    const { CmsAdmin } = ctx.model.Permission;
    const nowTime = moment();
    const { username, password } = data;
    // --------------- 获取管理员信息 ---------------
    const adminInfo = await CmsAdmin.findOne({ where: { username } });

    const toDate = moment().format('YYYYMMDD');

    if (!adminInfo) ctx.throwBizError(40001, '账户名或者密码错误');

    if (adminInfo.is_lock === 1) { // 验证是否已达到错误登录限制
      const last_error_date = moment(adminInfo.login_err_time).format('YYYYMMDD');
      if (last_error_date === toDate) ctx.throwBizError(40002, '禁止登录,当天累计达到登录错误次数');
    }

    const md5Pwd = ctx.helper.md5(password);

    if (password === undefined || md5Pwd !== adminInfo.password) {
      const err_data = { login_err_time: nowTime };
      if (adminInfo.login_err_time) {
        const last_error_date = moment(adminInfo.login_err_time).format('YYYYMMDD');
        if (last_error_date !== toDate) {
          Object.assign(err_data, {
            login_err_num: 0,
            is_lock: 2,
          });
        } else {
          if ((adminInfo.login_err_num + 1) >= 10) { // 账号禁止登录
            Object.assign(err_data, { is_lock: 1 });
          }
        }
      }
      await adminInfo.update(err_data);
      await adminInfo.increment('login_err_num');
      ctx.throwBizError(40001, '账号或密码错误');
    }

    if (adminInfo.status !== 1) ctx.throwBizError(40003, '账号不可用，请联系管理员');
    // --------------- 更新登录次数 ---------------
    await adminInfo.increment('login_num');
    // --------------- 更新登录时间 ---------------
    await adminInfo.update({ login_time: nowTime });

    const tmpToken = await token.getToken(adminInfo.id, 'admin');

    return { token: tmpToken };
  }

  // 获取登录用户信息
  async info() {
    const { ctx } = this;
    const { CmsAdminGroup, CmsGroup, CmsPermission, CmsGroupPermission } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    const userInfo = ctx.userInfo.info;
    const userGroup = await CmsAdminGroup.findAll({
      where: {
        admin_id: userInfo.id,
      },
    });
    const groupIds = userGroup.map(v => v.group_id);

    const root = await CmsGroup.findOne({
      where: {
        level: GroupLevel.Root,
        id: {
          [Sequelize.Op.in]: groupIds,
        },
      },
    });

    const user = {
      id: userInfo.id,
      avatar: userInfo.avatar,
      name: userInfo.name,
    };
    set(user, 'admin', !!root);

    let permissions = [];

    if (root) {
      permissions = await CmsPermission.findAll({
        where: {
          mount: MountType.Mount,
        },
      });
    } else {
      const groupPermission = await CmsGroupPermission.findAll({
        where: {
          group_id: {
            [Sequelize.Op.in]: groupIds,
          },
        },
      });

      const permissionIds = uniq(groupPermission.map(v => v.permission_id));

      permissions = await CmsPermission.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: permissionIds,
          },
          mount: MountType.Mount,
        },
      });
    }

    set(user, 'permissions', await this.formatPermissions(permissions));

    return user;
  }

  // 转化权限
  async formatPermissions(permissions) {
    const arr = [];
    permissions.forEach(v => {
      const permission = `${v.module}-${v.name}`;
      if (!arr.includes(permission)) {
        arr.push(permission);
      }
    });
    return arr;
  }

  // 是否超级管理员
  async isAdmin() {
    const { ctx } = this;
    const { CmsAdminGroup, CmsGroup } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    const adminGroup = await CmsAdminGroup.findAll({
      where: {
        admin_id: ctx.userInfo.id,
      },
    });
    const groupIds = adminGroup.map(v => v.group_id);
    const is = await CmsGroup.findOne({
      where: {
        level: GroupLevel.Root,
        id: {
          [Sequelize.Op.in]: groupIds,
        },
      },
    });
    return is;
  }

  /**
   * 将 user 挂在 ctx 上
   */
  async mountUser() {
    const { ctx, app, config, service } = this;
    const { CmsAdmin } = ctx.model.Permission;
    const { token } = service.permission.utils;
    const { expireTime, adminPrefix } = config.redisCache;

    const authorization = ctx.header.authorization;
    if (authorization === '' || authorization === null || authorization === undefined) {
      ctx.throwBizError(4104, '未登录');
    }

    ctx.userInfo = await token.validate(authorization);
    // 线上环境才启动单点登录
    if (ctx.userInfo.prefix !== adminPrefix || (config.env === 'prod' && authorization !== ctx.userInfo.token)) {
      ctx.throwBizError(4105, '授权过期');
    }

    // 获得用户信息
    const userInfo = await CmsAdmin.findByPk(ctx.userInfo.id, { raw: true });
    if (!userInfo) ctx.throwBizError(4105, '授权过期');
    ctx.userInfo.info = userInfo;
    if (userInfo.status !== 1) ctx.throwBizError(4107, '账号禁用中，请联系管理员');

    // 增加有效期
    ctx.userInfo.expired_at = moment().add(expireTime, 's').unix();
    await app.redis.get('default').hset(ctx.userInfo.prefix, ctx.userInfo.id, JSON.stringify(ctx.userInfo));
  }
}
module.exports = AuthService;
