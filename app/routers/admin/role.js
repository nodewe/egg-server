// 角色相关的路由
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);

  router.group({ name: 'role', prefix: '/api/v1' }, router => {
    const {
      addRole,
      putRoleMenu,
      delRole,
      getRoleOptions,
      getRoleList,
      getMenuIdByRoleId,
      putRole
    } = controller.admin.role.role;
    //  获取角色列表分页
    router.get('/roles/page', jwt, getRoleList);
    // 根据角色id 获取对应的菜单ids
    router.get('/roles/menuIds', jwt, getMenuIdByRoleId);

    // 获取角色数据作为参数
    router.get('/roles/options', jwt, getRoleOptions);
    // 添加角色
    router.post('/roles', jwt, addRole);

    // 删除用户
    router.delete('/roles', jwt, delRole);
    // 修改角色菜单权限
    router.put('/roles/menus', jwt, putRoleMenu);
    //修改角色信息
    router.put('/roles', jwt, putRole);
  });

};
