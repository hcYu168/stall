'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;

class HomeController extends Controller {
	async addStall(){
		const {ctx, service} = this;
		const add_info = ctx.request.body;
		await service.sHome.create(add_info);
	}

	async indexTypeShow(){
		const {ctx, service} = this;
		const rule = {
			category: {
				type: 'enum',
				values: ["1", "2"],
				required: true
			},
			id: {
				type: 'string',
				required: false
			}
		}
		try{			
			ctx.validate(rule, ctx.params);
			let {category, id} = ctx.params;
			id = Number(id) || 1;
			if(id < 0){
				ctx.status = 401;
				ctx.message = "id出错";
				return;
			}
			const {max, pageCount, stalles_detail} = await service.sHome.typeShow(id, category);
			const {customers_detail} = await service.sCustomer.findAll();
			await ctx.render("indexType", {
				"stalles_detail": stalles_detail,
				"name": ctx.session.name ? ctx.session.name : null,
				"type": ctx.session.type,
				"max": max,
				"page": id,
				"pageCount": pageCount,
				"category": category,
				"customers": customers_detail
			})
		}catch(err){
			if(err.code == 'invalid_param'){
				ctx.status = 401;
				ctx.message = "参数错误";
				return;
			}else{
				ctx.status = 400;
				ctx.message = "服务错误";
				return;
			}
		}
	}

	async queryTypeShow(){
		const {ctx, service} = this;
		let {id, category} = ctx.params;
		const rule = {
			category: {
				type: 'enum',
				values: ["1", "2"],
				required: true
			},
			id: {
				type: 'string',
				required: false
			}
		}
		try{
			ctx.validate(rule, ctx.params);
			id = Number(id) || 1;
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
		}catch(err){
			if(err.code == 'invalid_param'){
				ctx.status = 401;
				ctx.message = "参数错误";
				return;
			}else{
				console.log("code", err.message);
				ctx.status = 401;
				ctx.message = err.message;
				return;
			}
		}
	}
	async getCustomerInfo(){
		const {ctx, service} = this;
		const {category, id} = ctx.params;
		const rule = {
			category: {
				type: 'string',
				values: ['1', '2']
			},
			id: 'string'
		};
		try{
			ctx.validate(rule, ctx.params);
			const {stall_detail} = await service.sHome.getCustomerInfo(category, id);	
			console.log("stall_detail", stall_detail.id);
			ctx.body = {
				"action": "query stall by id",
				"info": true,
				"stall_detail": stall_detail
			}
		}catch(err){
			if(err.code == 'invalid_param'){
				ctx.status = 401;
				ctx.message = "参数错误";
				return;
			}else{
				ctx.status = 400;
				ctx.message = "服务错误";
				return;
			}
		}
	}

	async updateCustomerInfo(){
		const {ctx, service} = this;
		let {category, id} = ctx.params;
		const updateInfo = ctx.request.body;
		await service.sHome.updateInfo(category, id, updateInfo);
		ctx.body = {
			"action": "update customer info",
			"info": true
		}
	}
}

module.exports = HomeController;