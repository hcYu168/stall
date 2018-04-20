'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	router.get('/stall', controller.home.index);
	router.get('/query/stall/:stall_name', 'home.queryStall');

	router.post("/stall/excel/import", "excel.import");
	router.get('/stall/excel/export/:start/:end', "excel.export");
	
	router.resources("admin", "/admin", app.controller.admin);
	router.get('/admin/update/:id', 'admin.getUserInfo');

	router.get("/stall/admin/login", "admin.login");
	router.post("/stall/admin/login", "admin.logging");
	router.get("/stall/admin/logout", "admin.logout");
};
