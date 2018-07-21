'use strict';
const status = [400, 404, 401 ];
module.exports = () =>{
	return async function errPage(ctx, next){
		await next();
		console.log("ctx.status", ctx.status);
		if ((status.indexOf(ctx.status) > -1) && !ctx.body) {
	      const { message } = ctx;
	      ctx.status = ctx.status;
	      if (ctx.acceptJSON) {
	        ctx.body = { message: 'Not Found' };
	      } else {
	        await ctx.render('err/err', { message: message });
	      }
	    }
	}
}