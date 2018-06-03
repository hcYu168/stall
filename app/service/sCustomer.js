'use strict';
const Service = require('egg').Service;
class customerService extends Service{
	async show(id){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const limit = 10;
		const offset = (id-1)*limit;
		const customers = await MCustomer.findAndCountAll({
			limit,
			offset,
			order:[
				["created_at", "DESC"]
			]
		});
		const customers_detail = [];
		const pageCount = Math.ceil(customers.count/10);
		for(let customer of customers.rows){
			const customer_detail = ctx.helper.getAttributes(customer, [
				"id", "name", "color"]);
			customers_detail.push(customer_detail);
		}
		return {pageCount, customers_detail};
	}

	async findAll(){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const customers = await MCustomer.findAll({});
		const customers_detail = [];
		for(let customer of customers){
			const customer_detail = ctx.helper.getAttributes(customer, [
				"id", "name"]);
			customers_detail.push(customer_detail);
		}
		return {customers_detail};
	}
	async create(name, color){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const existsCustomer = await MCustomer.findOne({
			where:{name}
		});
		if(existsCustomer){
			ctx.throw(401, "客户名称已经存在");
		}
		await MCustomer.create({
			name,
			color
		});
	}

	async findCustomer(id){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const existsCustomer = await MCustomer.findOne({
			where:{id}
		});
		if(!existsCustomer){
			ctx.throw(401, "客户不存在");
		}
		const customer_detail = ctx.helper.getAttributes(existsCustomer, [
				"id", "name", "color"]);
		return {customer_detail};
	}
	async update(id, name, color){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const existCustomer = await MCustomer.findOne({
			where:{id}
		});
		if(!existCustomer){
			ctx.throw(404, "客户不存在");
		}
		await MCustomer.update({
			name,
			color
		},{
			where:{id}
		});
	}

	async destroy(id){
		const {ctx} = this;
		const {MCustomer} = ctx.model;
		const existCustomer = await MCustomer.findOne({
			where:{id}
		});
		if(!existCustomer){
			ctx.throw(404, "客户不存在");
		}
		await MCustomer.destroy({where:{id}});
	}


}
module.exports = customerService;