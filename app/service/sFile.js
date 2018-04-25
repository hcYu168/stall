'use strict';
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const XLSX = require('node-xlsx');
const Service = require('egg').Service;
class fileService extends Service{
	async upload(ctx){
		const {MStall} = ctx.model;
		console.log("MStall", MStall);
		//console.log("ctx", ctx);
		let customer_type = "";
		let market_type = "";
		let floor = "";
		let stall_name = "";
		let customer_name = "";
		let phone = "";
		let identity_card = "";
		let remark = "";
		const parts = ctx.multipart();
	    let part;
        let result;
        
	    while ((part = await parts()) != null) {
	      if (part.length) {
	      } else {
	        if (!part.filename) {
	          return;
	        }
	        console.log('field: ' + part.fieldname);
	        console.log('filename: ' + part.filename);
	        try {
	        	const picPath = path.join(__dirname,"../public/upload/")+(new Date()).getTime()+'_'+part.filename;
				part.pipe(fs.createWriteStream(picPath));
				setTimeout(async function(){
					const excels = XLSX.parse(picPath);
					for(let i=0; i< excels.length; i++){
						const data = excels[i].data;
						for(let j=1; j< data.length; j++){
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
							const stall = await MStall.findOne({customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark});
							if(!stall){
								await MStall.create({customer_type, market_type, floor, stall_name, customer_name, phone, identity_card, remark});
							}
						}
					}
					await fs.unlinkSync(picPath);
				}, 1000);	
	        } catch (err) {
	          await sendToWormhole(part);
	          throw err;
	        }
	      }
	    }
		return result;
	}
}
module.exports = fileService;