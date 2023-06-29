'use strict';
//后台管理端
const adminRouter = require('./adminRouter/index');

//移动端路由
const mobileRouter = require('./mobileRouter/index');

//上传文件
const uploadRouter = require('./routers/upload');

// 工具路由
const utilRouter = require('./routers/util');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  // router.get('/', controller.home.index);

  adminRouter(app)

  mobileRouter(app)

  utilRouter(app);

  uploadRouter(app);
};
