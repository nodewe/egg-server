const jwt = require('jsonwebtoken');
module.exports = app => {
  // console.log(app,'app');
  return async function verify(ctx, next) {
    // console.log(ctx.request.header,'ctx.request.header');
    if (!ctx.request.header.authorization) {
      return ctx.body = {
        msg: '用户没有登录',
        code: 401,
      };
    }
    // 有token
    const token = ctx.request.header.authorization;
    try {
      const ret = await jwt.verify(token, app.config.jwt.security);
      // 直接将当前用户信息查出来
      const userInfo = await app.mysql.get('sys_user', {
        id: ret.id,
      });

      // 查询role 转换为code
      const roleList = await app.mysql.query(
        'select id,code from sys_role where sys_role.id in (select role_id from sys_user_role where user_id = ?)',
        [ret.id]
      );
      console.log(roleList, 'role');
      //保存角色code
      userInfo.roles = roleList.map(ele => ele.code);
      // 保存用户的roleId
      userInfo.roleIds = roleList.map(ele => ele.id);

      // 封装 perms
      // 使用角色的id集合查询 菜单表 里面perm不是NULL 并且菜单id 为 关联表使用role_id 查询到的菜单id 查询perm
      let perms = await app.mysql.query(
        'select * from sys_menu where perm IS NOT NULL and sys_menu.id in (select menu_id from sys_role_menu WHERE FIND_IN_SET(role_id,?))',
        [userInfo.roleIds.join(',')]
      );
      //保存角色的perms权限
      userInfo.perms = perms.map(ele => ele.perm);

      ctx.state.userInfo = userInfo;
      await next();
    } catch (error) {
      console.log(error, 'error');
      if (error.name == 'TokenExpiredError') {
        ctx.body = {
          code: 401,
          msg: '用户信息过期',
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '用户信息出错',
        };
      }
    }
  };
};