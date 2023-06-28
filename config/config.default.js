/* eslint valid-jsdoc: "off" */

'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1667603577627_7508';

  // add your middleware config here
  // config.middleware = [];
  //关闭安全验证 解决 invalid csrf token
  config.security = {
    csrf: {
      enable: false
    }
  }
  //jwt
  config.jwt = {
    security: '@huanglihui'
  }
  //是否 使用密码 算法加密 默认false
  // config.password = {
  //   enabled:false
  // }
  //修改端口
  config.cluster = {
    listen: {
      path: '',
      port: 9999,
      hostname: '0.0.0.0'
    }
  }
  config.rundir = process.cwd() + '/run';

  //配置文件上传
  config.multipart = {
    mode: 'file',
    whitelist: () => true
  };

  //配置上传目录
  config.UPLOAD_DIR = path.join(appInfo.baseDir, 'app/public/file')

  //配置静态托管
  config.static = {
    prefix: '/public',
    dir: path.join(appInfo.baseDir, 'app/public'),
    // dirs: [ dir1, dir2 ] or [ dir1, { prefix: '/static2', dir: dir2 } ],
    // support lazy load
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000,
  };

  //配置mysql
  config.mysql = {
    client: {
      host: '127.0.0.1',
      //端口号
      port: '3306',
      //用户名
      user: 'root',
      //密码
      password: '',
      //数据库名
      database: 'youlai_boot'
    },
    //是否加载到app上
    app: true,
    // 是否加载到agent上 默认关闭
    agent: false
  }
  // config.io = {
  //   // init: {
  //   //   wsEngine: 'ws',
  //   // }, // passed to engine.io
  //   namespace: {
  //     '/': {
  //       connectionMiddleware: [
  //         'auth',
  //       ],
  //       packetMiddleware: [],
  //     },
  //     '/test': {
  //       connectionMiddleware: [],
  //       packetMiddleware: [],
  //     },
  //   },
  // };

  return config;
};