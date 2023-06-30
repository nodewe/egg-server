
const {Controller} = require('egg');
const axios = require('axios')
/**
 * @description code 换 openid 
 * @param {Object} params 请求参数
 * @return {Promise} 
 * @example 
 * 返回参数
 * {
 * 会话密钥
 *  session_key:'',
 * 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回
 *  unionid:"",
 * 错误信息
 *  errmsg:"",
 * 用户唯一标识
 *  openid:"",
 * 错误码
 *  errcode:""
 * } 
 */
const wxMiniAuth = async (params)=>{
    return (await axios({
        url:'https://api.weixin.qq.com/sns/jscode2session',
        params
    }))
}

//移动端鉴权模块
module.exports = class MobileController extends Controller{
    // 微信小程序登录
    async wxLogin(){
        const params = {
            //小程序 appId
            appid:'',
            //小程序 appSecret
            secret:'',
            //登录时获取的 code，可通过wx.login获取
            js_code:"",
            //授权类型，此处只需填写 authorization_code
            grant_type:"authorization_code"
        };
        try {
           const ret = await wxMiniAuth(params);
           //判断有没有openid 有就给token 没有的话就只能注册一个
        } catch (e) {
            console.log(e,'eee');
        }
     
    }
    // 微信公众号验证
    async wxVerify(){

    }

    // 网页微信登录
    async wxWebLogin(){

    }

    // app 微信授权登录
    async wxAppLogin(){

    }
}