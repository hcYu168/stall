'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1524054018280_4759';

  // add your config here
  config.middleware = ['userAuth', 'adminAuth'];

  config.adminAuth = {
      match: [
        "/",
        "/query/stall",
        "/admin",
        "/admin/*"
      ]
  }

  config.userAuth = {
      match: [
        "/admin",
        "/admin/*"
      ]
  }
  
  config.view = {
    defaultViewEngine: "ejs",
    defaultExtension: ".ejs"
  };

  config.static = {
    prefix: '/public',
    dir: path.join(appInfo.baseDir, 'app/public/'),
    dynamic: true,
    preload: false,
    maxAge:31536000,
    buffer:false  
  };

   config.sequelize = {
    dialect: 'mysql',
    database: 'lijie',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'root',
    timezone: '+08:00' //东八时区
  };

  config.session = {
    key: "rainchapter",
    maxAge: 4*3600*1000,
    httpOnly: true,
    encrypt: true
  }
  
  config.security = {
    domainWhiteList: [
        'http://localhost:8090',
        'http://127.0.0.1:8090'
      ],
    csrf: {
      enable: false
    }
  };

  config.cluster = {
  	listen:{
  	     port:8090
  	}
  }

  config.multipart = {
    fileExtensions: [
      ".xlsx",
      ".xls"
    ]
  }

  config.jwt = {
      secret: "rainchapter"
  }

  return config;
};
