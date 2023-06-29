

/**
 * @description 腾讯云OSS 文件上传文档
 * https://cloud.tencent.com/document/product/436/7743
 */



const SecretId = "AK**********Od" // 秘钥id
const SecretKey = "zi**********Am" // 秘钥
const Bucket = "b**********9" // 存储桶名称 可在腾讯云的图像界面创建
const Region = "ap-nanjing" // 购买时选择的区域 我这里是南京
const prefix = "indexImages/" // 可选 腾讯云中自定义的文件夹名称 我这里是indexImages

const COS = require("cos-nodejs-sdk-v5")


const TencentCos = new COS({
    SecretId,
    SecretKey
})

/**
 * @description 腾讯云上传文件
 * @param {Object} param key 是文件路径名称 (唯一)   body是内容可以是FileStream 字符串 BUffer
 * @returns 
 */
async function putObject({key,body}) {
    const data = await TencentCos.putObject({
        Bucket, // 存储桶名称
        Region, // 存储桶所在地域
        Key:prefix+key,
        //上传文件的内容
        Body:body
    })
    return data;// data.Location
}


module.exports = {
    putObject
}