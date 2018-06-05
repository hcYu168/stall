'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;

class HomeController extends Controller {
	async addStall(){
		const {ctx, service} = this;
		const add_info = ctx.request.body;
		await service.sHome.create(add_info);
	}

	async indexType(){
		const {category} = this.ctx.params;
		await this.ctx.redirect(`/stall/customer_type/${category}/1`);
	}

	async indexTypeShow(){
		const {ctx, service} = this;
		const {category, id} = ctx.params;
		const {max, pageCount, stalles_detail} = await service.sHome.typeShow(id, category);
		const {customers_detail} = await service.sCustomer.findAll();
		await ctx.render("indexType", {
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": ctx.session.type,
			"max": max,
			"page": parseInt(id),
			"pageCount": pageCount,
			"category": category,
			"customers": customers_detail
		})
	}

	async queryTypeShow(){
		const {ctx, service} = this;
		const {id, category} = ctx.params;
		const query_info = ctx.query;
		const {url, max, pageCount, stalles_detail} = await service.sHome.queryTypeShow(id, category, query_info);
		const {customers_detail} = await service.sCustomer.findAll();
		console.log('url2', url);
		await ctx.render("queryStallType", {
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": ctx.session.type,
			"max": max.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"url": url,
			"category": category,
			"customers": customers_detail
		});
	}
	async getCustomerInfo(){
		const {ctx, service} = this;
		const {category, id} = ctx.params;
		const {stall_detail} = await service.sHome.getCustomerInfo(category, id);	
		console.log("stall_detail", stall_detail.id);
		ctx.body = {
			"action": "query stall by id",
			"info": true,
			"stall_detail": stall_detail
		}
	}

	async updateCustomerInfo(){
		const {ctx, service} = this;
		let {category, id} = ctx.params;
		console.log("category", category);
		console.log("id", id)
		const updateInfo = ctx.request.body;
		await service.sHome.updateInfo(category, id, updateInfo);
		ctx.body = {
			"action": "update customer info",
			"info": true
		}
	}
}

module.exports = HomeController;