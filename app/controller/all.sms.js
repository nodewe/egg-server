const SMSClient = require('@alicloud/sms-sdk');


// 设置值
let accessKeyId = "LTAI5tKAwfQVNM7nBM28XW9f";// AccessKey ID
let secretAccessKey = "zyg78UkQxWqboS04oNTaja4Gzkr8Jn";// AccessKey Secret
let signName = "阿里云短信测试"; // 签名名称
let templateCode = "SMS_154950909";// 短信模板code
​
// 初始化sms_client
const smsClient = new SMSClient({accessKeyId, secretAccessKey})
// 生成六位随机验证码
let smsCode = Math.random().toString().slice(-6);
console.log("smsCode:", smsCode);

module.exports = async ()=>{
    const {Code} = await smsClient.sendSMS({
        PhoneNumbers:'1767866262',
        SignName: signName, //签名名称 前面提到要准备的
        TemplateCode: templateCode, //模版CODE  前面提到要准备的
        TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
    })
    //  ok
    return Code
}