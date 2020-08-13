'use strict';

const Service = require('egg').Service;

class AdminService extends Service {
  // 列表 GET
  async index(data) {
    const { ctx } = this;
    const { CmsAdmin, CmsAdminGroup, CmsGroup } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    let { page, pagesize, role_id, status, username, phone } = data;

    const where = {
      id: {
        [Sequelize.Op.ne]: 1,
      },
    };
    if (role_id) {
      const list = await CmsAdminGroup.findAll({
        where: {
          group_id: role_id,
        },
      });
      const adminIds = list.map(v => v.admin_id);
      Object.assign(where.id, {
        [Sequelize.Op.in]: adminIds,
      });
    }
    status = parseInt(status);
    if (status) where.status = status;
    if (username) where.username = username;
    if (phone) where.phone = phone;

    // 获取列表
    const rows = await CmsAdmin.findAll({
      where,
      offset: (page - 1) * pagesize,
      limit: pagesize,
      order: [[ 'id', 'desc' ]],
      attributes: { exclude: [ 'password' ] },
      include: [
        {
          as: 'groups',
          model: CmsAdminGroup,
          include: [
            {
              as: 'group',
              model: CmsGroup,
              attributes: [ 'id', 'name' ],
            },
          ],
        },
      ],
    });
    const count = await CmsAdmin.count({ where });
    rows.map(async item => {
      const row = item.dataValues;
      const groups = row.groups;
      delete row.groups;
      const role = groups.map(v => v.group.name).join(',');
      const role_id = groups.map(v => v.group.id).join(',');
      row.role = role;
      row.role_id = role_id;
      return row;
    });
    return { count, rows };
  }

  // 查询 GET /:id
  async show(id) {
    const { ctx } = this;
    const { CmsAdmin } = ctx.model.Permission;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');
    const info = await CmsAdmin.findOne({
      where: { id },
      attributes: { exclude: [ 'password' ] },
    });
    if (!info) ctx.throwBizError(4000, '无该管理员');
    return info;
  }

  // 创建 POST
  async create(data) {
    const { ctx } = this;
    const { CmsAdmin, CmsGroup, CmsAdminGroup } = ctx.model.Permission;
    const { username, password, name, avatar, phone, email, role_id, status } = data;

    if (parseInt(role_id) === 1) ctx.throwBizError(4000, '无该角色');
    const checkRole = await CmsGroup.findOne({ where: { id: role_id } });
    if (!checkRole) ctx.throwBizError(4000, '无该角色');

    const md5Pwd = ctx.helper.md5(password);
    const createData = { username, password: md5Pwd, name, avatar, phone, email, status };
    const check = await CmsAdmin.findOne({ where: { username } });
    if (check) ctx.throwBizError(4000, '该用户名已存在');
    const res = await CmsAdmin.create(createData);

    // 添加角色
    await CmsAdminGroup.create({ admin_id: res.id, group_id: role_id });
    return { id: res.id };
  }

  // 更新 PUT /:id
  async update(id, data) {
    const { ctx } = this;
    const { CmsAdmin, CmsGroup, CmsAdminGroup } = ctx.model.Permission;
    const { Sequelize } = ctx.model;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');

    const info = await CmsAdmin.findOne({ where: { id } });
    if (!info) ctx.throwBizError(4000, '无该管理员');

    const { username, name, avatar, phone, email, role_id, status } = data;

    const checkRole = await CmsGroup.findOne({ where: { id: role_id } });
    if (!checkRole) ctx.throwBizError(4000, '无该角色');

    const updateData = { username, name, avatar, phone, email, status };
    const check = await CmsAdmin.findOne({ where: { username } });
    if (check && check.id !== info.id) ctx.throwBizError(4000, '该用户名已存在');

    // 修改角色
    const cmsAdminGroup = await CmsAdminGroup.findOne({ admin_id: id, group_id: role_id });
    if (!cmsAdminGroup) {
      await CmsAdminGroup.create({ admin_id: id, group_id: role_id });
      // 删除其他角色 - 限制只有一个角色 - TODO
      await CmsAdminGroup.destroy({
        where: {
          admin_id: id,
          group_id: {
            [Sequelize.Op.ne]: role_id,
          },
        },
      });
    }

    await info.update(updateData);
  }

  // 删除 DELETE /:id
  async destroy(id) {
    const { ctx } = this;
    const { CmsAdmin } = ctx.model.Permission;
    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');
    await CmsAdmin.destroy({ where: { id } });
  }

  // 更新状态 GET /:id/status
  async status(id) {
    const { ctx } = this;
    const { CmsAdmin } = ctx.model.Permission;

    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');
    const info = await CmsAdmin.findOne({ where: { id } });
    if (!info) ctx.throwBizError(4000, '无该管理员');
    const status = info.status === 2 ? 1 : 2;
    await info.update({ status });
  }

  // 修改密码 POST /:id/pwd
  async pwd(id, data) {
    const { ctx } = this;
    const { CmsAdmin } = ctx.model.Permission;

    if (parseInt(id) === 1) ctx.throwBizError(4000, 'id错误');
    const info = await CmsAdmin.findOne({ where: { id } });
    if (!info) ctx.throwBizError(4000, '无该管理员');

    const { password } = data;
    const md5Pwd = ctx.helper.md5(password);
    const updateData = { password: md5Pwd };
    await info.update(updateData);
  }
}
module.exports = AdminService;
