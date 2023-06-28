// 工具相关的路由
module.exports = app => {
    const { controller,router } = app;
    
    router.group({ name: 'util', prefix: '/api/v1' }, router => {
        const { 
            captcha
         } = controller.util
         //验证码
         router.get('/auth/captcha',captcha)
    })
   
  };
  