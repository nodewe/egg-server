'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
//添加socket.io 插件
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
exports.routerGroup = {
  enable:true,
  package:'egg-router-group'
}