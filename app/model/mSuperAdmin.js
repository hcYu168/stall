'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MSuperAdmin = app.model.define('superAdmin', {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {type: STRING(50)},
		account: {type: STRING(20)},
		password: {type: STRING(20)},
	},{
		paranoid: true,
		tableName: 'superAdmin',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	});
	MSuperAdmin.sync();
	return MSuperAdmin;
}