'use strict';
module.exports = app =>{
	const {INTEGER, STRING} = app.Sequelize;
	const MRenter = app.model.define('renter',{
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		customer_id: {type: INTEGER},
		customer_type: {type: STRING},
		name: {type: STRING},
		phone1: {type: STRING},
		phone2: {type: STRING},
		currentPosition: {type: STRING},
		IntentionToMarket: {type: STRING},
		IntentionToStall: {type: STRING},
		remark: {type: STRING},
		renter_time: {type: STRING}
	},{
		paranoid: true,
		tableName: "renter",
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	});
	MRenter.sync();
	MRenter.associate = function(){
		MRenter.belongsTo(app.model.MCustomer, {
			as: "renter_cus",
			foreignKey: "customer_id"
		});
	}
	return MRenter;
}