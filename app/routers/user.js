// 用户相关的路由
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);
  router.group({ name: 'user', prefix: '/api/v1' }, router => {
    const {
      login,
      addUser,
      delUser,
      putUser,
      list,
      getMeInfo,
      getUserInfoById,
      resetPassword
    } = controller.user.user;
    // 登录接口
    router.post('/auth/login', login);
    // router.post('/register', register)
    // 添加用户
    router.post('/users', jwt, addUser);
    // 获取当前登录用户信息
    router.get('/users/me', jwt, getMeInfo);
    // 根据用户id查询用户信息
    router.get('/users/form', jwt, getUserInfoById);

    // 获取用户分页
    router.get('/users/page', jwt, list);
    // 删除用户
    router.delete('/users', jwt, delUser);
    // 修改用户
    router.put('/users', jwt, putUser);
    
    // 重置密码
    router.patch('/users/password',jwt, resetPassword)
  });

};
