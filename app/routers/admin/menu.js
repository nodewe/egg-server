// 菜单相关的路由
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);

  router.group({ name: 'menu', prefix: '/api/v1' }, router => {
    const {
      addMenu,
      putMenu,
      delMenu,
      getMenuRouteList,
      getMenuTreeList,
      getMenuOption,
      getMenuInfo
    } = controller.admin.menu.menu;
    // 菜单路由列表
    router.get('/menus/routes', jwt, getMenuRouteList);
    // 获取菜单 参数形式的列表
    router.get('/menus/options', jwt, getMenuOption);
    // 获取菜单详情
    router.get('/menus/form',jwt,getMenuInfo)
    // 获取菜单的树形列表
    router.get('/menus', jwt, getMenuTreeList);

    // 添加菜单
    router.post('/menus', jwt, addMenu);

    // 删除用户
    router.delete('/menus', jwt, delMenu);
    // 修改菜单
    router.put('/menus', jwt, putMenu);
  });

};
