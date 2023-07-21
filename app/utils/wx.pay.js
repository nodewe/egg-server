//微信小程序支付

const wxPay = require('wechatpay-node-v3');


const pay = new wxPay({
    // APPID
    appid:'',
    // 商户id
    mchid:"",
    //公钥
    publicKey:"",
    //私钥
    privateKey:""
})


/**
 * 订单总金额
 * @param {Number} total 总金额
 * @returns 
 */
async function payAction(total) {
    const params = {
        //订单描述
        description:"订单描述",
        //订单号
        out_trade_no:Date.now(),
        //必填 而且是一个https协议的公网地址 就是支付成功后调用的通知接口 
        notify_url:"",
        //金额
        amount:{
            total //单位是分
        },
        payer:{
            openid:''
        },
        scene_info:{
            payer_client_ip:'ip',//支付者的ip,这个可以不用理会  
        }
    };

    const res = await pay.transactions_jsapi(params)
    return res
}

module.exports = payAction