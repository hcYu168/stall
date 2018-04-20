'use strict';
module.exports = () => {
	return async (ctx, next) =>{
		if(ctx.req.url === '/stall/admin/login'){
			await next();
		}else{
		    if(ctx.session.name === undefined || ctx.session.name === "" ||ctx.session.name === null){
		    	console.log("ctx.session.name", ctx.session.name);	
		    	ctx.redirect('/stall/admin/login');
		    }else{
		    	await next();
		    }
		}
	}
}