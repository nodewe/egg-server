const {Controller} = require('egg');
//验证码的库
const svgCaptcha = require('svg-captcha');
//工具类相关
//邮箱验证码
// const nodemailer = require('./nodemailer')

//阿里云短信验证码
const AliSMS = require('./all.sms')

// 腾讯云短信验证码
const tencentSMS = require('./tencent.sms')

module.exports = class UtilController extends Controller{
   //图形验证码的实现
  async captcha() {
    const captcha = svgCaptcha.createMathExpr({
        width:115,
        height:48,
        noise:5,
        background:'#c6c8c6'
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.body =  {
        code:200,
        captchaEnabled:true,
        data:captcha.data,
        msg:'操作成功'
    }
  }

  //邮箱验证码的实现
  async emailVerify(){
  //   const send = {
  //     // 发件人
  //     from: '<你自己的163邮箱@163.com>',
  //     // 主题
  //     subject: '接受凭证',//邮箱主题
  //     // 收件人
  //     to:email,//前台传过来的邮箱
  //     // 邮件内容，html格式
  //     text: '用'+code+'作为你的验证码'//发送验证码
  // }
  //   await  nodemailer(send)
   
  }

  //短信验证码
  async smsVerify(){
      // await AliSMS()

      // await tencentSMS()
  }
}