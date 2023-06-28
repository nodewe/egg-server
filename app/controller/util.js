const {Controller} = require('egg');
//验证码的库
const svgCaptcha = require('svg-captcha');
//工具类相关
module.exports = class UtilController extends Controller{
       //验证码的实现
  async captcha() {
    // console.log(1111)
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
}