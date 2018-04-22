'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MStall = app.model.define('stall', {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		customer_type: {type: STRING(50)},
		market_type: {type: STRING(50)},
		floor: {type: STRING(50)},
		stall_name: {type: STRING(50)},
		customer_name: {type: STRING(50)},
		phone: {type: STRING(20)},
		identity_card: {type: STRING(20)},
		remark: {type: STRING}
	},{
		paranoid: true,
		tableName: 'stall',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	});
	MStall.sync();
	return MStall;
}

