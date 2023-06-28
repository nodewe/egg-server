'use strict';
// 用户相关的路由
const userRouter = require('./routers/user');
// 工具路由
const utilRouter = require('./routers/util');

// 菜单路由
const menuRouter = require('./routers/menu');

// 部门表
const deptRouter = require('./routers/dept');
// 角色
const roleRouter = require('./routers/role');

//字典路由
const dictRouter = require('./routers/dict')
//字典类型
const dictTypeRouter = require('./routers/dictType');

//上传文件
const uploadRouter = require('./routers/upload')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  // router.get('/', controller.home.index);
  userRouter(app);

  utilRouter(app);

  menuRouter(app);

  deptRouter(app);

  roleRouter(app);

  dictRouter(app);

  dictTypeRouter(app);

  uploadRouter(app);
};
