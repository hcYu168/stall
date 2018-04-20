'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const {ctx} = this;
		const {MStall} = ctx.model;
		const stallAll = await MStall.findAll({});
		await this.ctx.render("index",{
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length
		});
	}

	async queryStall(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {stall_name} = ctx.params;
		const stallAll = await MStall.findAll({});
		const stall = await MStall.findOne({
			where:{stall_name}
		});
		const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "stall_name", "shaft", "phone", "identity_card", "remark", "types"]);
		console.log("ads", stall_detail);
		await ctx.render("queryStall", {
			"stall_detail": stall_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length
		});
	}
}

module.exports = HomeController;
