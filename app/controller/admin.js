'use strict';
const Controller = require('egg').Controller;
class adminController extends Controller{
	async index(){
		const { MAdmin } = this.ctx.model;
	    const limit = 10;
	    const offset = 0;
	    const users = await MAdmin.findAndCountAll({
	      limit,
	      offset,
	    });
	    const pageCount = Math.ceil(users.count / 10);
	    const users_detail = [];
	    for (const user of users.rows) {
	    	const user_detail = this.ctx.helper.getAttributes(user, [
	        	'id', 'account', 'name', "password" ]);
	      	users_detail.push(user_detail);
	    }
	    await this.ctx.render('admin', {
	     	pageCount,
	      	users_detail,
	     	page: 1,
	    	name: this.ctx.session.name ? this.ctx.session.name : null,
	    });
	}

	async show() {
	    const { MAdmin } = this.ctx.model;
	    const { id } = this.ctx.params;
	    console.log('id', id);
	    const limit = 5;
	    let offset = 0;
	    if (id < 0) {
	      this.ctx.throw(404, 'err pageId');
	    } else if (id >= 1) {
	      offset = (id - 1) * limit;
	    }
	    const users = await MAdmin.findAndCountAll({
	      limit,
	      offset,
	    });
	    const pageCount = Math.ceil(users.count / 5);
	    const users_detail = [];
	    for (const user of users.rows) {
	      const user_detail = this.ctx.helper.getAttributes(user, [
	        'id', 'account', 'name', 'password' ]);
	      users_detail.push(user_detail);
	    }
	    await this.ctx.render('admin', {
	      pageCount,
	      users_detail,
	      page: parseInt(id),
	      name: this.ctx.session.name ? this.ctx.session.name : null,
	    });
  	}
	async create() {
	    const { MAdmin } = this.ctx.model;
	    const { account, name, password } = this.ctx.request.body;
	    console.log('1111111');
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
    }

    async getUserInfo() {
	    const { MAdmin } = this.ctx.model;
	    const { id } = this.ctx.params;
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
	    const { id } = this.ctx.params;
	    const { account, name, password } = this.ctx.request.body;
	    console.log("das",{ account, name, password });
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
    }

	async destroy() {
	    const { MAdmin } = this.ctx.model;
	    const { id } = this.ctx.params;
	    const findUser = await MAdmin.findById(id);
	    if (!findUser) {
	      this.ctx.throw(404, 'user not found');
	    }
	    const user = await MAdmin.destroy({
	      where: { id },
	    });
	    console.log(user);
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
				this.ctx.throw(404, "admin not found");
			}
			const admin = await MAdmin.findOne({
				where: {account, password},
			});
			if(!admin){
				this.ctx.throw(401, "password wrong");
			}
			admin_detail = this.ctx.helper.getAttributes(admin, [
				"id",  "name", "account" ]);
			this.ctx.session.type = "admin";
		}else if(admin == "superAdmin"){
			const findSuperAdmin = await MSuperAdmin.findOne({where: {}});
			if(!findSuperAdmin){
				this.ctx.throw(404, "superAdmin not found");
			}
			const superAdmin = await MSuperAdmin.findOne({where: {account, password}});
			if(!superAdmin){
				this.ctx.throw(401, "password wrong");
			}
			admin_detail = this.ctx.helper.getAttributes(superAdmin, [
				"id", "name", "account"]);
			this.ctx.session.type = "superAdmin";
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
		this.ctx.redirect('/stall/admin/login');
	}
}
module.exports = adminController;