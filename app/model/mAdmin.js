'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MAdmin = app.model.define('admin', {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {type: STRING(50)},
		account: {type: STRING(50)},
		password: {type: STRING(20)},
		token:{type: STRING(20)}
	},{
		paranoid: true,
		tableName: 'admin',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	});
	MAdmin.sync();
	return MAdmin;
}

