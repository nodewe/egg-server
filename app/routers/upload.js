// 上传相关的代码
module.exports = app => {
    const { controller, router } = app;
    const jwt = app.middleware.jwt(app);
  
    router.group({ name: 'menu', prefix: '/api/v1' }, router => {
      const {
        uploadAliOSS,
        uploadTencentCos,
        uploadServerStorage
      } = controller.upload.file;
      // 阿里云oss 上传文件
      router.post('/alioss/upload', jwt, uploadAliOSS);
      //腾讯云COS 上传文件
      router.post('/tencentcos/upload',jwt,uploadTencentCos)
      //本地上传
      router.post('/upload',jwt,uploadServerStorage)
    });
  
  };
  