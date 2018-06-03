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
		const {category, start, end} = ctx.params;
		await service.sFile.export(category, start, end);
	}
}
module.exports = excelController;