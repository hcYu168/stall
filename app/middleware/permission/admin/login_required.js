'use strict';

/**
 * 守卫函数，用户登陆即可访问
 */
module.exports = () => {
  return async function loginRequired(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
      await ctx.service.permission.admin.auth.mountUser();
      await next();
    } else {
      await next();
    }
  };
};
