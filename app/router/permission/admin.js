'use strict';

const { Permission } = require('../../lib/permission');

/**
 * 管理员路由
 * @param {Object} app app
 */
module.exports = app => {
  const { router, controller, middlewares, config } = app;
  const adminRouter = router.namespace(config.apiPrefix + '/admin');
  const adminCtrl = controller.permission.admin;

  // 超管权限-最大权限者
  const adminRequired = middlewares.permission.admin.adminRequired();
  // 角色权限-含有权限才可以调用
  const groupRequired = middlewares.permission.admin.groupRequired();
  // 登录权限-只需要登录就可以访问，无需设置opt.permission，设置的话则需mountPermission=false
  const loginRequired = middlewares.permission.admin.loginRequired();

  const opts = new Permission({ type: 'admin' });

  // ---------------------- 基础操作 ----------------------
  adminRouter.post('登录', '/auth/login', adminCtrl.auth.login);
  adminRouter.get('退出登录', '/auth/logout', loginRequired, adminCtrl.auth.logout);
  adminRouter.get('获取登录用户信息', '/auth/info', loginRequired, adminCtrl.auth.info);

  // ---------------------- 权限管理 ----------------------
  // 权限暂不支持分配，开启分配后也无实际作用
  opts.router({ module: '管理员管理', mountPermission: false });
  adminRouter.get(opts.permission({ name: 'adminIndex', permission: '列表' }), '/admins', adminRequired, adminCtrl.admin.index);
  adminRouter.get(opts.permission({ name: 'adminShow', permission: '详情' }), '/admins/:id', adminRequired, adminCtrl.admin.show);
  adminRouter.post(opts.permission({ name: 'adminCreate', permission: '创建' }), '/admins', adminRequired, adminCtrl.admin.create);
  adminRouter.put(opts.permission({ name: 'adminUpdate', permission: '修改' }), '/admins/:id', adminRequired, adminCtrl.admin.update);
  adminRouter.delete(opts.permission({ name: 'adminDestroy', permission: '删除' }), '/admins/:id', adminRequired, adminCtrl.admin.destroy);
  adminRouter.get(opts.permission({ name: 'adminStatus', permission: '更改状态' }), '/admins/:id/status', adminRequired, adminCtrl.admin.status);
  adminRouter.post(opts.permission({ name: 'adminPwd', permission: '修改密码' }), '/admins/:id/pwd', adminRequired, adminCtrl.admin.pwd);
  adminRouter.get(opts.permission({ name: 'adminRole', permission: '角色列表' }), '/admin/roles', adminRequired, adminCtrl.admin.role);

  opts.router({ module: '角色管理', mountPermission: false });
  adminRouter.get(opts.permission({ name: 'roleIndex', permission: '列表' }), '/roles', adminRequired, adminCtrl.role.index);
  adminRouter.get(opts.permission({ name: 'roleShow', permission: '详情' }), '/roles/:id', adminRequired, adminCtrl.role.show);
  adminRouter.post(opts.permission({ name: 'roleCreate', permission: '创建' }), '/roles', adminRequired, adminCtrl.role.create);
  adminRouter.put(opts.permission({ name: 'roleUpdate', permission: '修改' }), '/roles/:id', adminRequired, adminCtrl.role.update);
  adminRouter.delete(opts.permission({ name: 'roleDestroy', permission: '删除' }), '/roles/:id', adminRequired, adminCtrl.role.destroy);
  adminRouter.post(opts.permission({ name: 'dispatchPermissions', permission: '分配权限' }), '/roles/:id/permission', adminRequired, adminCtrl.role.dispatchPermission);
  adminRouter.get(opts.permission({ name: 'getAllPermission', permission: '查询所有可分配的权限' }), '/role/permission', adminRequired, adminCtrl.role.permission);

  // ---------------------- 演示 ----------------------
  opts.router({ module: '模块名称1', mountPermission: true });
  adminRouter.get('不设置opt.permission', '/login/required', loginRequired, adminCtrl.index.loginRequired);
  adminRouter.put(opts.permission({ name: 'loginRequired', permission: '权限名称' }), '/login/required', loginRequired, adminCtrl.index.loginRequired);

  opts.router({ module: '模块名称2' });
  adminRouter.get(opts.permission({ name: 'groupRequired', permission: '权限名称' }), '/group/required', groupRequired, adminCtrl.index.groupRequired);
};
