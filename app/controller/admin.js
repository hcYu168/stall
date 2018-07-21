'use strict';
const Controller = require('egg').Controller;
const jwt = require("jsonwebtoken");
class adminController extends Controller{
	async index(){
		const { MAdmin } = this.ctx.model;
	    const limit = 10;
	    const offset = 0;
	    const users = await MAdmin.findAndCountAll({
	    	limit,
	    	offset,
	    });
	    const pageCount = Math.ceil(users.count / limit);
	    const users_detail = users.rows.map(user => this.ctx.helper.getAttributes(user, [
	        	'id', 'account', 'name', "password" ]));
	    await this.ctx.render('admin', {
	     	pageCount,
	      	users_detail,
	     	page: 1,
	    	name: this.ctx.session.name ? this.ctx.session.name : null,
	    });
	}

	async show() {
	    const { MAdmin } = this.ctx.model;
	    let { id } = this.ctx.params;
	    id = Number(id) || 1;
	    console.log('id', id);
	    const limit = 10;
	    let offset = 0;
	    if (id < 0) {
	      this.ctx.throw(404, 'err pageId');
	    } else if (id >= 1) {
	      offset = (id - 1) * limit;
	    }
	    try{
	    	const users = await MAdmin.findAndCountAll({
		      limit,
		      offset,
		    });
		    const pageCount = Math.ceil(users.count / limit);
		    const users_detail = users.rows.map(user => this.ctx.helper.getAttributes(user, [
		        	'id', 'account', 'name', "password" ]));
		    await this.ctx.render('admin', {
		      pageCount,
		      users_detail,
		      page: parseInt(id),
		      name: this.ctx.session.name ? this.ctx.session.name : null,
		    });
	    }catch(err){
	    	ctx.status = 400;
	    	ctx.message = "服务错误";
	    	return ;
	    }
	    
  	}

	async create() {
	    const { MAdmin } = this.ctx.model;
	    const { account, name, password } = this.ctx.request.body;
	    const rule = {
	    	accout: "string",
	    	name: "string",
	    	password: "string"
	    };
	    try{
	    	this.ctx.validate(rule, this.ctx.request.body);
		    let user = await MAdmin.findOne({
		      where: { account },
		    });
		    if (user) {
		      this.ctx.throw(404, 'account already exist');
		    }
		    user = await MAdmin.create({ account, name, password });
		    if (!user) {
		      this.ctx.throw(404, 'created user is not success');
		    }
		    const updateJson = {
		      action: 'create user',
		      info: 'ok',
		    };
		    this.ctx.body = updateJson;
	    }catch(err){
	    	if(err.code == "invalid_param"){
	    		this.ctx.status = 401;
	    		this.ctx.message = "参数错误";
	    		return;
	    	}else{
	    		this.ctx.status = 400;
	    		this.ctx.message = "服务错误";
	    		return;
	    	}
	    }
	    
    }

    async getUserInfo() {
	    const { MAdmin } = this.ctx.model;
	    let { id } = this.ctx.params;
	    const user = await MAdmin.findById(id);
	    if (!user) {
	      this.ctx.throw(404, 'user not found');
	    }
	    const user_detail = this.ctx.helper.getAttributes(user, [
	      'id', 'account', 'name', 'password' ]);
	    this.ctx.body = user_detail;
  	}

    async update() {
	    const { MAdmin } = this.ctx.model;
	    let { id } = this.ctx.params;
	    const { account, name, password } = this.ctx.request.body;
	    const rule = {
	    	account: "string",
	    	name: "string",
	    	password: "string"
	    };
	    try{
		    ctx.validate(rule, this.ctx.request.body);
		    const findUser = await MAdmin.findById(id);
		    if (!findUser) {
		      this.ctx.throw(404, 'user not found');
		    }
		    await MAdmin.update({ account, name, password },
		      {
		        where: { id },
		      });
		    const updateJson = {
		      action: 'update user',
		      info: 'ok',
		    };
		    this.ctx.body = updateJson;
	    }catch(err){
	    	if(err.code == "invalid_param"){
	    		this.ctx.status = 401;
	    		this.ctx.message = "参数错误";
	    		return;
	    	}else{
	    		this.ctx.status = 400;
	    		this.ctx.message = "服务错误";
	    		return;
	    	}
	    }
    }

	async destroy() {
	    const { MAdmin } = this.ctx.model;
	    let { id } = this.ctx.params;
	    const findUser = await MAdmin.findById(id);
	    if (!findUser) {
	      this.ctx.throw(404, 'user not found');
	    }
	    const user = await MAdmin.destroy({
	      where: { id },
	    });
	    const updateJson = {
	      action: 'delete user',
	      info: 'ok',
	    };
	    this.ctx.body = updateJson;
	}

	async login(){
		await this.ctx.render("login");
	}

	async logging(){
		const {account, password, admin} = this.ctx.request.body;
		console.log("account", account);
		const {MSuperAdmin, MAdmin} = this.ctx.model;
		let admin_detail = "";
		if(admin == ""){
			const findAdmin = await MAdmin.findOne({where:{account}});
			if(!findAdmin){
				this.ctx.throw(404, "账号不存在");
			}
			const admin = await MAdmin.findOne({
				where: {account, password},
			});
			if(!admin){
				this.ctx.throw(401, "账号 or 密码 错误");
			}
			const {token} = await this.service.jwt.getJWT(admin.id);
			await MAdmin.update({token},{
				where: {
					"id": admin.id
				}
			});
			admin_detail = this.ctx.helper.getAttributes(admin, [
				"id",  "name", "account" ]);
			this.ctx.session.type = "admin";
			this.ctx.session.token = token;
			this.ctx.session.id = admin.id;
		}else if(admin == "superAdmin"){
			const findSuperAdmin = await MSuperAdmin.findOne({where: {}});
			if(!findSuperAdmin){
				this.ctx.throw(404, "账号不存在");
			}
			const superAdmin = await MSuperAdmin.findOne({where: {account, password}});
			if(!superAdmin){
				this.ctx.throw(401, "账号 or 密码 错误");
			}
			const {token} = await this.service.jwt.getJWT(superAdmin.id);
			await MSuperAdmin.update({token},{
				where: {
					"id": superAdmin.id
				}
			});
			admin_detail = this.ctx.helper.getAttributes(superAdmin, [
				"id", "name", "account"]);
			this.ctx.session.type = "superAdmin";
			this.ctx.session.token = token;
			this.ctx.session.id = superAdmin.id;
		}
		this.ctx.session.name = admin_detail.name;
		const loginJson = {
			"action" : "admin login",
			"info" : true,
		}
		this.ctx.body = loginJson
	}

	async logout(){
		this.ctx.session.name = null;
		this.ctx.session.type = null;
		this.ctx.session.id = null;
		this.ctx.session.token = null;
		this.ctx.redirect('/stall/admin/login');
	}
}
module.exports = adminController;

/*
	挤掉别人登录
	判断token是否一样
	如果不一样 就直接跳转到登录界面
*/