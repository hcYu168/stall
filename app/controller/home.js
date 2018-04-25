'use strict';
const moment = require('moment');
const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		const {ctx} = this;
		const {MStall} = ctx.model;
		const limit = 10;
		const offset = 0;
		const stallAll = await MStall.findAll({});
		const stalles_detail = [];
		const type = ctx.session.type;
		if(type == "superAdmin"){
			const stalles = await MStall.findAll({
				limit,
				offset,
				order:[
					["created_at", "DESC"]
				]
			});
			for(let stall of stalles){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stalles_detail.push(stall_detail);
			}
		}
		const pageCount = Math.ceil(stallAll.length/10);
		await ctx.render("index",{
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": type,
			"max": stallAll.length,
			"page": 1,
			"pageCount": pageCount
		});
	}

	async addStall(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark} = ctx.request.body;
		const stall  = await MStall({where:{customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark}});
		if(!stall){
			await MStall.create({customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark});
			ctx.body= {
				"action": "create stall",
				"info": true
			}
		}else{
			ctx.body= {
				"action": "create stall",
				"info": false
			}
		}
	}

	async indexShow(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {id} = ctx.params;
		const limit = 10;
		let offset;
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		const stallAll = await MStall.findAll({});
		const stalles_detail = [];
		const type = ctx.session.type;
		if(type == "superAdmin"){
			const stalles = await MStall.findAll({
				limit,
				offset,
				order:[
					["created_at", "DESC"]
				]
			});
			for(let stall of stalles){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stalles_detail.push(stall_detail);
			}
		}
		const pageCount = Math.ceil(stallAll.length/10);
		await ctx.render("index",{
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount
		});
	}

	async indexType(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {category} = ctx.params;
		const limit = 10;
		const offset = 0;
		const stallAll = await MStall.findAll({});
		const stalles_detail = [];
		const type = ctx.session.type;
		let stalles;
		let pageCount;
		if(type == "superAdmin"){
			if(category == "1"){
				stalles = await MStall.findAll({
					where:{
						"customer_type": "档主"
					},
					limit,
					offset,
					order:[
						["created_at", "DESC"]
					]
				});
				const sum = await MStall.findAll({
					where:{
						"customer_type": "档主"
					}
				});
				pageCount = Math.ceil(sum.length/10);
			}else if(category == "2"){
				stalles = await MStall.findAll({
					where:{
						"customer_type": "租客"
					},
					limit,
					offset,
					order:[
						["created_at", "DESC"]
					]
				});
				const sum = await MStall.findAll({
					where:{
						"customer_type": "租客"
					}
				});
				pageCount = Math.ceil(sum.length/10);
			}
			
			for(let stall of stalles){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stalles_detail.push(stall_detail);
			}
		}
		await ctx.render("indexType",{
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": type,
			"max": stallAll.length,
			"page": 1,
			"pageCount": pageCount,
			"category": category
		});
	}

	async indexTypeShow(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {category, id} = ctx.params;
		const limit = 10;
		let offset;
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		const stallAll = await MStall.findAll({});
		const stalles_detail = [];
		const type = ctx.session.type;
		let stalles;
		let pageCount;
		if(type == "superAdmin"){
			if(category == "1"){
				stalles = await MStall.findAll({
					where:{
						"customer_type": "档主"
					},
					limit,
					offset,
					order:[
						["created_at", "DESC"]
					]
				});
				const sum = await MStall.findAll({
					where:{
						"customer_type": "档主"
					}
				});
				pageCount = Math.ceil(sum.length/10);
			}else if(category == "2"){
				stalles = await MStall.findAll({
					where:{
						"customer_type": "租客"
					},
					limit,
					offset,
					order:[
						["created_at", "DESC"]
					]
				});
				const sum = await MStall.findAll({
					where:{
						"customer_type": "档主"
					}
				});
				pageCount = Math.ceil(sum.length/10);
			}
			
			for(let stall of stalles){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stalles_detail.push(stall_detail);
			}
		}
		await ctx.render("indexType",{
			"stalles_detail": stalles_detail,
			"name": ctx.session.name ? ctx.session.name : null,
			"type": type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"category": category
		});
	}

	async queryStall(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		let {market_type, floor, stall_name, customer_name} = ctx.query;
		console.log("market_type", market_type);
		console.log('floor', floor);
		console.log('stall_name', stall_name);
		console.log('customer_name', customer_name);
		const limit = 10;
		const offset = 0;
		const options = {
			where:{},
			"limit": limit,
			"offset": offset,
			"order": [
				["id", "DESC"]
			]
		};
		const options2 = {
			where:{},
			"order": [
				["id", "DESC"]
			]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
            options2.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
            options2.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
            options2.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
            options2.where.customer_name = {'$like': `%${customer_name}%`};
        }
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAll(options);
		const stalles2 = await MStall.findAll(options2);
		console.log("options2", options2);
		const pageCount = Math.ceil(stalles2.length/10);
		const stalles_detail = [];
		for(let stall of stalles){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stalles_detail.push(stall_detail);
		}
		console.log("stalles_detail", stalles_detail);
		await ctx.render("queryStall", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": 1,
			"pageCount": pageCount,
			"url":url
		});
	}

	async queryType(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		let {market_type, floor, stall_name, customer_name} = ctx.query;
		const {category} = ctx.params;
		console.log("market_type", market_type);
		console.log('floor', floor);
		console.log('stall_name', stall_name);
		console.log('customer_name', customer_name);
		const limit = 10;
		const offset = 0;
		const options = {
			where:{},
			"limit": limit,
			"offset": offset,
			"order": [
				["id", "DESC"]
			]
		};
		const options2 = {
			where:{},
			"order": [
				["id", "DESC"]
			]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
            options2.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
            options2.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
            options2.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
            options2.where.customer_name = {'$like': `%${customer_name}%`};
        }
		if(category == "1"){
			options.where.customer_type = "档主";
			options2.where.customer_type = "档主";
		}else if(category == "2"){
			options.where.customer_type = "租客";
			options2.where.customer_type = "租客";
		}
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAll(options);
		const stalles2 = await MStall.findAll(options2);
		const pageCount = Math.ceil(stalles2.length/10);
		const stalles_detail = [];
		for(let stall of stalles){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stalles_detail.push(stall_detail);
		}
		console.log("stalles_detail", stalles_detail);
		await ctx.render("queryStallType", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": 1,
			"pageCount": pageCount,
			"url":url,
			"category": category
		});
	}

	async queryTypeShow(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		let {id, category} = ctx.params;
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
				["id", "DESC"]
			]
		};
		const options2 = {
			where:{},
			"order": [
				["id", "DESC"]
			]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
            options2.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
            options2.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
            options2.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
            options2.where.customer_name = {'$like': `%${customer_name}%`};
        }
		if(category == "1"){
			options.where.customer_type = "档主";
			options2.where.customer_type = "档主";
		}else if(category == "2"){
			options.where.customer_type = "租客";
			options2.where.customer_type = "租客";
		}
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAll(options);
		const stalles2 = await MStall.findAll(options2);
		const pageCount = Math.ceil(stalles2.length/10);
		const stalles_detail = [];
		for(let stall of stalles){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stalles_detail.push(stall_detail);
		}
		console.log("stalles_detail", stalles_detail);
		await ctx.render("queryStallType", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"url": url,
			"category": category
		});
	}
	async getCustomerInfo(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		const {id} = ctx.params;
		const stall = await MStall.findById(id);
		const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name",
			"customer_name", "phone", "identity_card", "remark"]);
		const stalles = await MStall.findAll({
			where:{
				"market_type": stall.market_type,
				"customer_type": stall.customer_type,
				"stall_name": stall.stall_name,
				"floor": stall.floor
			},
			attributes: ["remark", "created_at"],
			order:[
				["created_at", "DESC"]
			]
		});
		const stall_time = moment(stall.created_at).format("YYYY-MM-DD HH:mm");
		stall_detail.remark = stall.remark+"··········"+stall_time;
		console.log("stall_detail.remark", stall_detail.remark);
		const remarkes = [];
		for(let s of stalles){
			const formatTime = moment(s.created_at).format("YYYY-MM-DD HH:mm");
			const remark_detail = s.remark+"··········"+formatTime;
			remarkes.push(remark_detail);
		}
		console.log("remarkes", remarkes);
		stall_detail.remarkes = remarkes;
		ctx.body = {
			"action": "query stall by id",
			"info": true,
			"stall_detail": stall_detail
		}
	}

	async updateCustomerInfo(){
		const {ctx} = this;
		const {MStall} = ctx.model;
		let {id} = ctx.params;
		const {customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark} = ctx.request.body;
		await MStall.update({
			customer_type,
			market_type,
			floor,
			stall_name,
			customer_name,
			phone,
			identity_card,
			remark
		},{
			where: {id}
		});
		ctx.body = {
			"action": "update customer info",
			"info": true
		}
	}

	async show(){
		const {ctx} = this;
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
				["id", "DESC"]
			]
		};
		const options2 = {
			where:{},
			"order": [
				["id", "DESC"]
			]
		};
		const url=`?market_type=${market_type}&floor=${floor}&stall_name=${stall_name}&customer_name=${customer_name}`;
		if(market_type != ""){
            options.where.market_type = {'$like': `%${market_type}%`};
            options2.where.market_type = {'$like': `%${market_type}%`};
        }
        if(floor != ""){
            options.where.floor = {'$like': `%${floor}%`};
            options2.where.floor = {'$like': `%${floor}%`};
        }
        if(stall_name != ""){
            options.where.stall_name = {'$like': `%${stall_name}%`};
            options2.where.stall_name = {'$like': `%${stall_name}%`};
        }
        if(customer_name != ""){
            options.where.customer_name = {'$like': `%${customer_name}%`};
            options2.where.customer_name = {'$like': `%${customer_name}%`};
        }
        console.log("options", options);
		const stallAll = await MStall.findAll({});
		const stalles = await MStall.findAll(options);
		const stalles2 = await MStall.findAll(options2);
		const pageCount = Math.ceil(stalles2.length/10);
		const stalles_detail = [];
		for(let stall of stalles){
			const stall_detail = ctx.helper.getAttributes(stall, [
			"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
			stalles_detail.push(stall_detail);
		}
		console.log("stalles_detail", stalles_detail);
		await ctx.render("queryStall", {
			"stalles_detail": stalles_detail,
			"name": this.ctx.session.name ? this.ctx.session.name : null,
			"type": this.ctx.session.type,
			"max": stallAll.length,
			"page": parseInt(id),
			"pageCount": pageCount,
			"url": url
		});
	}
}

module.exports = HomeController;