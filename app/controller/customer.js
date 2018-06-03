'use strict';
const Controller = require('egg').Controller;
class customerController extends Controller{
	async index(){
		await this.ctx.redirect("/customer/1");
	}

	async show(){
		const {ctx, service} = this;
		const {id} = ctx.params;
		const {pageCount, customers_detail} = await service.sCustomer.show(id);
		await ctx.render("customer",{
			"page":id,
			"pageCount": pageCount,
			"customers": customers_detail,
			name: ctx.session.name ? ctx.session.name : null
		})
	}
	async create(){
		const {ctx, service} = this;
		const createRule = {
			name: {type: 'string'},
			color: {type: 'string'}
		};
		ctx.validate(createRule);
		const {name, color} = ctx.request.body;
		await service.sCustomer.create(name, color);
		const createJson = {
	      action: 'create customer',
	      info: 'ok',
	    };
	    ctx.body = createJson;
	}

	async getCustomerInfo(){
		const {ctx, service} = this;
		const {id} = ctx.params;
		const {customer_detail} = await service.sCustomer.findCustomer(id);
		ctx.body = customer_detail;
	}

	async update(){
		const {ctx, service} = this;
		const {id} = ctx.params;
		const createRule = {
			name: {type: 'string'},
			color: {type: 'string'}
		};
		ctx.validate(createRule);
		const {name, color} = ctx.request.body;
		await service.sCustomer.update(id, name, color);
		const updateJson = {
	      action: 'update customer',
	      info: 'ok',
	    };
	    ctx.body = updateJson;
	}

	async destroy(){
		const {ctx, service} = this;
		const {id} = ctx.params;
		await service.sCustomer.destroy(id);
		const destroyJson = {
	      action: 'destroy customer',
	      info: 'ok',
	    };
	    ctx.body = destroyJson;
	}
}
module.exports = customerController;