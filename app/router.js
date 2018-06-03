'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	//router.get('/stall', controller.home.index);
	router.post("/stall/add", 'home.addStall');
	//router.get('/stall/:id', 'home.indexShow');
	router.get("/stall/customer_type/:category", 'home.indexType');
	router.get("/stall/customer_type/:category/:id", 'home.indexTypeShow');

	/*router.get('/query/stall', 'home.queryStall');
	router.get('/query/stall/show/:id', 'home.show');*/
	router.get('/query/stall/:category/:id', 'home.getCustomerInfo');
	router.put('/query/stall/:category/:id', 'home.updateCustomerInfo');
	//router.get('/query/stall/customer_type/:category', 'home.queryType');
	router.get('/query/stall/customer_type/:category/:id', 'home.queryTypeShow');

	router.post("/stall/excel/import", "excel.import");
	router.get('/stall/excel/export/:category/:start/:end', "excel.export");
	
	router.resources("admin", "/admin", app.controller.admin);
	router.get('/admin/update/:id', 'admin.getUserInfo');

	router.resources("customer", "/customer", app.controller.customer);
	router.get('/customer/update/:id', 'customer.getCustomerInfo');

	router.get("/stall/admin/login", "admin.login");
	router.post("/stall/admin/login", "admin.logging");
	router.get("/stall/admin/logout", "admin.logout");
};