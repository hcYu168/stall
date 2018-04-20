'use strict';
module.exports = () =>{
	return async(ctx, next) =>{
		if(ctx.session.type == 'superAdmin'){
				await next();
			}else{
				ctx.throw(401,"您没有该权限");
		}
	}
}