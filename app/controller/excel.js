'use strict';
const fs = require('fs');
const path = require('path');
const xlsx = require("node-xlsx");
const send = require('koa-send');
const Controller = require('egg').Controller;
class excelController extends Controller{
	async import(){
		const {ctx, service} = this;
		await service.sFile.upload(ctx);
		ctx.body = {
			"action": "import excel",
			"info": true
		};
	}

	async export(){
		const {ctx, service} = this;
		let {category, start, end} = ctx.params;
		start = isNaN(Number(start))? 1 : Number(start);
		end = isNaN(Number(end))? 1 : Number(end);
		await service.sFile.export(category, start, end);
	}
}
module.exports = excelController;