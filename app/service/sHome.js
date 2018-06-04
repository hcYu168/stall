'use strict';
const moment = require('moment');
const Service = require('egg').Service;
class homeService extends Service{
	async typeShow(id, category){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		const type = ctx.session.type;
		const limit = 10;
		let offset;
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		const stalles_detail = [];
		let stalles;
		let pageCount;
		let max;
		if(category == "1"){
			stalles = await MStall.findAndCountAll({
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
		}else if(category == "2"){
			stalles = await MRenter.findAndCountAll({
				limit,
				offset,
				order:[
					["updated_at", "DESC"]
				],
				include:[{
					model: ctx.model.MCustomer,
					as: "renter_cus"
				}]
			});
		}
		for(let stall of stalles.rows){
			let stall_detail;
			if(category == "1"){
				stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stall_detail.color = stall.stall_cus.color;
			}else if(category == "2"){
				stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_id", "customer_type", "name",  "currentPosition", "IntentionToMarket", "IntentionToStall"]);
				stall_detail.color = stall.renter_cus.color;
				stall_detail.date = moment(stall.updated_at).format("YYYY-MM-DD HH:mm");
			}			
			stalles_detail.push(stall_detail);
		}
		max = stalles.count;
		pageCount = Math.ceil(max/limit);
		return {max, pageCount, stalles_detail}	
	}

	async getCustomerInfo(category, id){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		let stall_detail;
		let remarkes = [];
		if(category == "1"){
			const stall = await MStall.findById(id);
			stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name",
				"customer_name", "phone", "identity_card", "remark"]);
			if(stall_detail.remark){
				const stall_time = moment(stall.updated_at).format("YYYY-MM-DD HH:mm");
				stall_detail.remark = stall.remark+"··········"+stall_time;
			}
			const stalles = await MStall.findAll({
				where:{
					"market_type": stall.market_type,
					"customer_type": stall.customer_type,
					"stall_name": stall.stall_name,
					"floor": stall.floor
				},
				attributes: ["remark", "updated_at"],
				order:[
					["updated_at", "DESC"]
				]
			});
			for(let s of stalles){
				if(s.remark){
					const formatTime = moment(s.updated_at).format("YYYY-MM-DD HH:mm");
					const remark_detail = s.remark+"··········"+formatTime;
					remarkes.push(remark_detail);
				}
				
			}
			console.log("remarkes", remarkes);
			stall_detail.remarkes = remarkes;
		}else if(category == "2"){
			const stall = await MRenter.findById(id);
			stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_id", "customer_type", "name", "phone1", "phone2", "currentPosition", 
				"IntentionToMarket", "IntentionToStall", "remark"]);
			if(stall_detail.remark){
				const stall_time = moment(stall.updated_at).format("YYYY-MM-DD HH:mm");
				stall_detail.remark = stall.remark+"··········"+stall_time;
			}
			const stalles = await MRenter.findAll({
				where:{
					"name": stall.name,
					"customer_type": stall.customer_type,
					"currentPosition": stall.currentPosition,
					"IntentionToMarket": stall.IntentionToMarket,
					"IntentionToStall": stall.IntentionToStall
				},
				attributes: ["remark", "updated_at"],
				order:[
					["updated_at", "DESC"]
				]
			});
			for(let s of stalles){
				if(s.remark){
					const formatTime = moment(s.updated_at).format("YYYY-MM-DD HH:mm");
					const remark_detail = s.remark+"··········"+formatTime;
					remarkes.push(remark_detail);
				}
				
			}
			console.log("stall_detail", stall_detail);
			console.log("remarkes", remarkes);
			stall_detail.remarkes = remarkes;
		}
		return {stall_detail};
	}

	async updateInfo(category, id, updateInfo){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		if(category == "1"){
			const stall = await MStall.findOne({where:{id}});
			if(!stall){
				ctx.throw(404, "找不到该信息");
			}
			const { customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark} = updateInfo;
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
		}else if(category == "2"){
			console.log("id", id);
			const renter = await MRenter.findOne({where:{id}});
			if(!renter){
				ctx.throw(404, "找不到该信息");
			}
			const {customer_type, name, phone1, phone2, currentPosition, IntentionToMarket, IntentionToStall, remark} = updateInfo;
			await MRenter.update({
				customer_type,
				name,
				phone1,
				phone2,
				currentPosition,
				IntentionToMarket,
				IntentionToStall,
				remark
			},{
				where: {id}
			});
		}
		
	}

	async create(add_info){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		if(add_info.customer_id == '1'){
			const {customer_id,customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark} = add_info;
			const stall  = await MStall.findOne({where:{customer_id,customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark}});
			if(!stall){
				await MStall.create({customer_id, customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark});
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
		}else if(add_info.customer_id == '2'){
			const {customer_id,customer_type, name, phone1, phone2, currentPosition, IntentionToMarket, IntentionToStall, remark} = add_info;
			const renter  = await MRenter.findOne({where:{customer_id,customer_type, name, phone1, phone2, currentPosition, IntentionToMarket, IntentionToStall, remark}});
			if(!renter){
				await MRenter.create({
					customer_id, 
					customer_type, 
					name, 
					phone1, 
					phone2, 
					currentPosition, 
					IntentionToMarket, 
					IntentionToStall, 
					remark
				});
				ctx.body= {
					"action": "create renter",
					"info": true
				}
			}else{
				ctx.body= {
					"action": "create renter",
					"info": false
				}
			}
		}
		
	}

	async queryTypeShow(id, category, query_info){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		const limit = 10;
		let offset;
		let url;
		let max;
		let pageCount;
		const stalles_detail = [];
		if(id>0){
			offset = (id-1)*10;
		}else{
			ctx.throw(401, "id出错");
		}
		if(category == '1'){
			const {m, f, s, c} = query_info;
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
			url=`?m=${m}&f=${f}&s=${s}&c=${c}`;
			if(m != ""){
	            options.where.market_type = {'$like': `%${m}%`};
	        }
	        if(f != ""){
	            options.where.floor = {'$like': `%${f}%`};
	        }
	        if(s != ""){
	            options.where.stall_name = {'$like': `%${s}%`};
	        }
	        if(c != ""){
	            options.where.customer_name = {'$like': `%${c}%`};
	        }		
			max = await MStall.findAll({});
			const stalles = await MStall.findAndCountAll(options);
			pageCount = Math.ceil(stalles.count/limit);
			for(let stall of stalles.rows){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "market_type", "floor", "stall_name", "customer_name", "phone", "identity_card", "remark"]);
				stall_detail.color = stall.stall_cus.color
				stalles_detail.push(stall_detail);
			}
		}else if(category == '2'){
			const {m, d, s, c} = query_info;
			const options = {
				where:{},
				"limit": limit,
				"offset": offset,
				"order": [
					["updated_at", "DESC"]
				],
				include:[{
					model: ctx.model.MCustomer,
					as: "renter_cus"
				}]
			};
			url=`?m=${m}&d=${d}&s=${s}&c=${c}`;
			if(m != ""){
	            options.where.IntentionToMarket = {'$like': `%${m}%`};
	        }
	        if( d != ""){
	            options.where.updated_at = {'$like': `%${d}%`};
	        }
	        if(s != ""){
	            options.where.IntentionToStall = {'$like': `%${s}%`};
	        }
	        if(c != ""){
	            options.where.name = {'$like': `%${c}%`};
	        }	
	        console.log(options);
			max = await MRenter.findAll({});
			const stalles = await MRenter.findAndCountAll(options);
			pageCount = Math.ceil(stalles.count/limit);
			for(let stall of stalles.rows){
				const stall_detail = ctx.helper.getAttributes(stall, [
				"id", "customer_type", "name", "phone1", "phone2", "IntentionToStall", "currentPosition", "IntentionToMarket", "remark"]);
				stall_detail.color = stall.renter_cus.color
				stalles_detail.push(stall_detail);
			}
		}
		return {url, max, pageCount, stalles_detail};
	}
}
module.exports = homeService;