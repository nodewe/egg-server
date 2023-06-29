

/**
 * 阿里云OSS相关文档
 * https://help.aliyun.com/document_detail/31837.html
 * 
 * https://help.aliyun.com/document_detail/111265.html
 * 
 */

let OSS = require('ali-oss');


let aliInfo = {
   // 以华南3（广州）为例，region填写为oss-cn-guangzhou。
   region: '你的region',
   // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
   accessKeyId: '你的accessKeyId',
   accessKeySecret: '你的AccessKeySecret',
   // 填写待配置跨域资源共享规则的Bucket名称。
   bucket: '你创建的bucket名'
}

let client = new OSS(aliInfo);

/**
 * @description 阿里云文件上传
 * @param {String} fileName 文件名
 * @param {String} filePath 文件路径
 * @returns 
 */

async function putObject(fileName,filePath) {
  const data = await client.put(fileName, filePath);
  return data;
}


module.exports = {
  putObject
}