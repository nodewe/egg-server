/**
 * @description 相关文档
 * https://www.npmjs.com/package/qcloudsms_js
 */


var QcloudSms = require("qcloudsms_js");

// 短信应用SDK AppID
var appid = 1400009099; // SDK AppID是1400开头

// 短信应用SDK AppKey
var appkey = "9ff91d87c2cd7cd0ea762f141975d1df37481d48700d70ac37470aefc60f9bad";

// 需要发送短信的手机号码
var phoneNumbers = ["21212313123", "12345678902", "12345678903"];

// 短信模板ID，需要在短信应用中申请
var templateId = 7839; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

// 签名
var smsSign = "腾讯云"; // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

// 实例化QcloudSms
var qcloudsms = QcloudSms(appid, appkey);


var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
var ssender = qcloudsms.SmsSingleSender();

function singleSendMsg(params) {
    return new Promise((resolve, reject) => {
        ssender.send(
            smsType,
            86,
            phoneNumbers[0],

            "【腾讯云】您的验证码是: 5678",
            "",
            "",
            (err, res, resData) => {
                if (err) {
                    return reject(err)
                }
                resolve({
                    res,
                    resData
                })
            }
        );
    })
}


//指定的模板发短信

function templateSendMsg() {
    return new Promise((rs, rj) => {
        var params = ["5678"];
        ssender.sendWithParam(
            86, 
            phoneNumbers[0], 
            templateId,
            params, 
            SmsSign, 
            "", 
            "", 
            (err, res, resData) => {
                if (err) {
                    return rj(err)
                }
                rs({
                    res,
                    resData
                })
            }
            );
    })
}
module.exports = {
    singleSendMsg,
    templateSendMsg
}