// 字典相关的路由
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);

  router.group({ name: 'dict', prefix: '/api/v1' }, router => {
        const {
          addDict,
          putDict,
          delDict,
          getDictList,
          getDictInfo
        } = controller.dict.dict;


        // 添加字典
        router.post('/dict',jwt,addDict);
        //修改字典
        router.put('/dict',jwt,putDict);
        //删除字典
        router.delete('/dict',jwt,delDict);
        //获取字典列表分页
        router.get('/dict/page',jwt,getDictList);
        //获取字典详情
        router.get('/dict/form',jwt,getDictInfo)


  });

};
