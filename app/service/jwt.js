'use strict';
const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class jwtService extends Service{
	async getJWT(id){
		console.log("secret", this.app.config.jwt.secret);
		const token = jwt.sign({
			data: id
		}, this.app.config.jwt.secret);
		console.log("token", token);
		return {token};
	}
}
module.exports = jwtService