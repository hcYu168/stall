'use strict';

/**
 * 守卫函数，非超级管理员不可访问
 */
module.exports = () => {
  return async function adminRequired(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
      await ctx.service.permission.admin.auth.mountUser();
      if (await ctx.service.permission.admin.auth.isAdmin()) {
        await next();
      } else {
        ctx.throwBizError(4106, '权限不足');
      }
    } else {
      await next();
    }
  };
};
