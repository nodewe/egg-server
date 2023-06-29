/**
 * 部门相关的操作
 * @param app
 */
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);

  router.group({ name: 'dept', prefix: '/api/v1' }, router => {
    const {
      addDept,
      putDept,
      delDept,
      getDeptTreeList,
      getDeptOptions,
      getMenuInfo
    } = controller.admin.dept.dept;
    //获取菜单的树形列表
    router.get('/dept', jwt, getDeptTreeList);
    //获取菜单的详情
    router.get('/dept/form',jwt,getMenuInfo)
    // 获取部门的下拉列表
    router.get('/dept/options', jwt, getDeptOptions);
    // 添加菜单
    router.post('/dept', jwt, addDept);

    // 删除用户
    router.delete('/dept', jwt, delDept);
    // 修改菜单
    router.put('/dept', jwt, putDept);
  });

};
