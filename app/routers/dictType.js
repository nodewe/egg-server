// 字典类型相关的路由
module.exports = app => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt(app);

  router.group({ name: 'dictType', prefix: '/api/v1' }, router => {
    const {
      addDictType,
      putDictType,
      delDictType,
      getDictTypeList,
      getDictTypeInfo,
    } = controller.dict.dictType;

        // 添加字典类型
        router.post('/dict/types',jwt,addDictType);
        //修改字典类型
        router.put('/dict/types',jwt,putDictType);
        //删除字典类型
        router.delete('/dict/types',jwt,delDictType);
        //获取字典类型列表分页
        router.get('/dict/types/page',jwt,getDictTypeList);
        //获取字典类型详情
        router.get('/dict/types/form',jwt,getDictTypeInfo)

  });

};
