'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		await this.ctx.redirect("/stall/1");
	}
	async indexShow(){
		const {ctx, service} = this;
		const {MStall} = ctx.model;
		const {id} = ctx.params;
		const limit = 10;
		let offset;
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		let customer_type = "档主";
		const stallAll = await MStall.findAll({});
		const stalles_detail = [];
		const type = ctx.session.type;
		if(type == "superAdmin"){
			const stalles = await MStall.findAll({
				where:{
					"customer_type": "档主"
				},
				limit,
				offset,
				order:[
					["updated_at", "DESC"]
				],
				include:[{
					model: ctx.model.MCustomer,
					as: "stall_cus"
				}]
			});
			for(let stall of stalles){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stall_detail.color = stall.stall_cus.color;
				stalles_detail.push(stall_detail);
			}
		}
		const pageCount = Math.ceil(stallAll.length/limit);
		const {customers_detail} = await service.sCustomer.findAll();
		await ctx.render("index",{
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"customers": customers_detail
		});
	}

	async queryStall(){
		const {ctx, service} = this;
		const {MStall} = ctx.model;
		let {market_type, floor, stall_name, customer_name} = ctx.query;
		const limit = 10;
		const offset = 0;
		const options = {
			where:{},
			"limit": limit,
			"offset": offset,
			"order": [
				["updated_at", "DESC"]
			],
			include:[{
				model: ctx.model.MCustomer,
				as: "stall_cus"
			}]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
        }
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAndCountAll(options);
		const pageCount = Math.ceil(stalles.count/limit);
		console.log("pageCount", pageCount);
		const stalles_detail = [];
		for(let stall of stalles.rows){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stall_detail.color = stall.stall_cus.color
			stalles_detail.push(stall_detail);
		}
		const {customers_detail} = await service.sCustomer.findAll();
		await ctx.render("queryStall", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": 1,
			"pageCount": pageCount,
			"url":url,
			"customers": customers_detail
		});
	}

	async show(){
		const {ctx, service} = this;
		const {MStall} = ctx.model;
		let {id} = ctx.params;
		let {market_type, floor, stall_name, customer_name} = ctx.query;
		const limit = 10;
		let offset;
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		const options = {
			where:{},
			"limit": limit,
			"offset": offset,
			"order": [
				["updated_at", "DESC"]
			],
			include:[{
				model: ctx.model.MCustomer,
				as: "stall_cus"
			}]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
        }
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAndCountAll(options);
		const pageCount = Math.ceil(stalles.count/limit);
		const stalles_detail = [];
		for(let stall of stalles.rows){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stall_detail.color = stall.stall_cus.color;
			stalles_detail.push(stall_detail);
		}
		const {customers_detail} = await service.sCustomer.findAll();
		await ctx.render("queryStall", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"url": url,
			"customers": customers_detail
		});
	}
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
		console.log("type",ctx.session.type);
		const {max, pageCount, stalles_detail} = await service.sHome.typeShow(id, category);
		console.log("max", max);
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



/*
	导入的时候也是选择类型，再导入，
	一个表档主表 再加一个租客表

*/