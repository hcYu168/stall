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
		let types = "";
		let stall_name = "";
		let shaft = "";
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
									types = data[j][0]+"";
								}
							}
							if(data[j].length >= 2){
								if(data[j][1] != undefined){
									stall_name = data[j][1]+"";
								}
							}
							if(data[j].length >= 3){
								if(data[j][2] != undefined){
									shaft = data[j][2]+"";
								}			
							}
							if(data[j].length >= 4){
								if(data[j][3] != undefined){
									phone = data[j][3]+"";
								}			
							}
							if(data[j].length >= 5){
								if(data[j][4] != undefined){
									identity_card = data[j][4]+"";
								}		
							}
							if(data[j].length >= 6){
								if(data[j][5] != undefined){
									remark = data[j][5]+"";
								}
							}
							await MStall.create({types, stall_name, shaft, phone, identity_card, remark});
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