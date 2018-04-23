'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	router.get('/stall', controller.home.index);
	router.get('/stall/:id', 'home.indexShow');
	router.get('/query/stall', 'home.queryStall');
	router.get('/query/stall/show/:id', 'home.show');
	router.get('/query/stall/:id', 'home.getCustomerInfo');
	router.put('/query/stall/:id', 'home.updateCustomerInfo');
	router.post("/stall/excel/import", "excel.import");
	router.get('/stall/excel/export/:start/:end', "excel.export");
	
	router.resources("admin", "/admin", app.controller.admin);
	router.get('/admin/update/:id', 'admin.getUserInfo');

	router.get("/stall/admin/login", "admin.login");
	router.post("/stall/admin/login", "admin.logging");
	router.get("/stall/admin/logout", "admin.logout");
};
