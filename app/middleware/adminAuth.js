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
		    	const {MSuperAdmin, MAdmin} = ctx.model;
		    	if(ctx.session.type == "superAdmin"){
		    		const superAdmin = await MSuperAdmin.findById(ctx.session.id);
		    		if(superAdmin.token != ctx.session.token){
		    			ctx.redirect('/stall/admin/login');
		    		}
		    	}else if(ctx.session.type == "admin"){
		    		const admin = await MAdmin.findById(ctx.session.id);
		    		if(admin.token != ctx.session.token){
		    			ctx.redirect('/stall/admin/login');
		    		}
		    	}
		    	await next();
		    }
		}
	}
}