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
		const {start, end} = ctx.params;
		console.log("start", start);
		console.log("end", end);
		const {MStall} = ctx.model;
		const conf = {
			"name": "sheet1",
			"data": []
		};

		const stalles = await MStall.findAll({
			where:{
				'id': {
					'$between': [start, end]
				}
			}
		});
		for(let stall of stalles){
			const s = [];
			s.push(stall.types);
			s.push(stall.stall_name);
			s.push(stall.shaft);
			s.push(stall.phone);
			s.push(stall.identity_card);
			s.push(stall.remark);
			console.log('sss', s)
			conf.data.push(s);
		}
		const buffer = xlsx.build([conf]);
		const fileName = (new Date()).getTime();
		await fs.writeFileSync(`${fileName}.xlsx`,buffer,{'flag':'w'});
		const filePath = path.join(__dirname, `../../${fileName}.xlsx`);
		console.log("filePath", filePath);
		ctx.attachment(filePath);
		await send(ctx, `${fileName}.xlsx`);
		await fs.unlinkSync(filePath);
	}
}
module.exports = excelController;