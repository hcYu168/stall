'use strict';
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const fs = require('fs');
const XLSX = require('node-xlsx');
const send = require('koa-send');
const Service = require('egg').Service;
class fileService extends Service{
	async upload(ctx){
		const parts = ctx.multipart();
	    let result;
	    let part;
	    const info = {};
	    while ((part = await parts()) != null) {
	      if (part.length) {
	        info[part[0]] = part[1];
	      } else {
	        if (!part.filename) {
	          return;
	        }
	        console.log('field2: ' + part.fieldname);
	        console.log('filename2: ' + part.filename);
	        try {
	        	const filePath = path.join(__dirname,"../public/upload/")+(new Date()).getTime()+'_'+part.filename;
				await awaitWriteStream(part.pipe(fs.createWriteStream(filePath)));
				await ctx.service.sFile.import(filePath, info);
				await fs.unlinkSync(filePath);
	        } catch (err) {
	          await sendToWormhole(part);
	          throw err;
	        }
	      }
	    }
		return filePath;
	}

	async import(filePath, info){
		const {MStall, MRenter} = this.ctx.model;
		const excels = XLSX.parse(filePath);
		for(let i=0; i< excels.length; i++){
			const data = excels[i].data;
			console.log("data", data);
			for(let j=1; j< data.length; j++){
				let customer_type = "";
				let market_type = "";
				let floor = "";
				let stall_name = "";
				let customer_name = "";
				let phone = "";
				let identity_card = "";
				let remark = "";
				if(data[j].length >= 1){
					if(data[j][0] != undefined){
						customer_type = data[j][0]+"";
					}
				}
				if(data[j].length >= 2){
					if(data[j][1] != undefined){
						market_type = data[j][1]+"";
					}
				}
				if(data[j].length >= 3){
					if(data[j][2] != undefined){
						floor = data[j][2]+"";
					}			
				}
				if(data[j].length >= 4){
					if(data[j][3] != undefined){
						stall_name = data[j][3]+"";
					}			
				}
				if(data[j].length >= 5){
					if(data[j][4] != undefined){
						customer_name = data[j][4]+"";
					}		
				}
				if(data[j].length >= 6){
					if(data[j][5] != undefined){
						phone = data[j][5]+"";
					}
				}
				if(data[j].length >= 7){
					if(data[j][6] != undefined){
						identity_card = data[j][6]+"";
					}
				}
				if(data[j].length >= 8){
					if(data[j][7] != undefined){
						remark = data[j][7]+"";
					}
				}
				if(info.customer_id == '1'){
					const stall = await MStall.findOne({
						where:{
							"customer_id": info.customer_id,
							customer_type, 
							market_type, 
							floor, 
							stall_name, 
							customer_name, 
							phone, 
							identity_card, 
							remark
						}
					});
					if(!stall){
						await MStall.create({
							"customer_id": info.customer_id,
							customer_type, 
							market_type, 
							floor, 
							stall_name, 
							customer_name, 
							phone, 
							identity_card, 
							remark
						});
					}
				}else if(info.customer_id == '2'){
					let renter_time = "";
					if(data[j].length >= 9){
						if(data[j][8] != undefined){
							renter_time = data[j][8]+"";
						}
					}
					const renter = await MRenter.findOne({
						where:{
							"customer_id": info.customer_id,
							customer_type, 
							"name": market_type, 
							"phone1": floor, 
							"phone2": stall_name, 
							"currentPosition": customer_name, 
							"IntentionToMarket": phone, 
							"IntentionToStall": identity_card, 
							remark,
							renter_time
						}
					});
					if(!renter){
						await MRenter.create({
							"customer_id": info.customer_id,
							customer_type, 
							"name": market_type, 
							"phone1": floor, 
							"phone2": stall_name, 
							"currentPosition": customer_name, 
							"IntentionToMarket": phone, 
							"IntentionToStall": identity_card, 
							remark,
							renter_time
						});
					}
				}
			}
		}
	}
	
	async export(category, start, end){
		const {ctx} = this;
		const {MStall, MRenter} = ctx.model;
		console.log("category", category);
		let conf;
		if(category == "1"){
			conf = {
				"name": "sheet1",
				"data": [["客户", "市场", "楼层", "档口", "姓名", "电话", "身份证", "备注"]]
			};
			const firstStall = await MStall.findOne({});
			console.log();
			if(firstStall.id > start){
				start += firstStall.id;
				console.log("start", start);
				end += firstStall.id;
				console.log("end", end);
			}
			const stalles = await MStall.findAll({
				where:{
					'id': {
						'$between': [start, end]
					}
				}
			});
			for(let stall of stalles){
				const s = [];
				s.push(stall.customer_type);
				s.push(stall.market_type);
				s.push(stall.floor);
				s.push(stall.stall_name);
				s.push(stall.customer_name);
				s.push(stall.phone);
				s.push(stall.identity_card);
				s.push(stall.remark);
				console.log('sss', s)
				conf.data.push(s);
			}
			console.log("conf", conf);
		}else if(category == "2"){
			conf = {
				"name": "sheet1",
				"data": [["客户", "姓名", "号码1", "号码2", "目前经营位置", "意向市场", "意向档口", "备注"]]
			};
			const firstStall = await MRenter.findOne({});
			if(firstStall.id > start){
				start += firstStall.id;
				end += firstStall.id;
			}
			const renters = await MRenter.findAll({
				where:{
					'id': {
						'$between': [start, end]
					}
				}
			});
			for(let renter of renters){
				const s = [];
				s.push(renter.customer_type);;
				s.push(renter.name);
				s.push(renter.phone1);
				s.push(renter.phone2);
				s.push(renter.currentPosition);
				s.push(renter.IntentionToStall);
				s.push(renter.remark);
				console.log('sss', s)
				conf.data.push(s);
			}
		}
		const buffer = XLSX.build([conf]);
		const fileName = (new Date()).getTime();
		await fs.writeFileSync(`${fileName}.xlsx`,buffer,{'flag':'w'});
		const filePath = path.join(__dirname, `../../${fileName}.xlsx`);
		console.log("filePath", filePath);
		ctx.attachment(filePath);
		await send(ctx, `${fileName}.xlsx`);
		await fs.unlinkSync(filePath);
	}
}
module.exports = fileService;