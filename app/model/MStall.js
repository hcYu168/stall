'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MStall = app.model.define('stall', {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		customer_type: {type: STRING},
		market_type: {type: STRING},
		floor: {type: STRING},
		stall_name: {type: STRING},
		customer_name: {type: STRING},
		phone: {type: STRING},
		identity_card: {type: STRING},
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

