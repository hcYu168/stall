'use strict';
module.exports = app =>{
	const {INTEGER, STRING} = app.Sequelize;
	const MCustomer = app.model.define("customer", {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {type: STRING},
		color: {type: STRING}
	},{
		paranoid: true,
		tableName: "customer",
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci"
	});
	MCustomer.sync();
	return MCustomer
}