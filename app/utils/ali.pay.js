const AlipaySdk = require('alipay-sdk').default; // 引入 SDK
// alipay.trade.page.pay 返回的内容为 Form 表单
const AlipayFormData = require('alipay-sdk/lib/form').default;
const alipaySdk =  new  AlipaySdk({
  appId: '2021000117615613', // 开放平台上创建应用时生成的 appId
  signType: 'RSA2', // 签名算法,默认 RSA2
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAspl4t/OIOQK4xfJ/WAQX+jeXCZ3KQsAVLVeL2m2ukza9OA1wtbGzjT6Zqn1zpGKWPgCxHcs/UZvcsBWjxaG6oAV7ULPyAjowt74kb5/5293GkN2bein3TAsrkg3PvCd4JwKjBACsIwbHBIx6E0B0+H6z2XsIeJkd2oTCHIlx59djAMzisF9+JxQgjPn6SnA5pttgyL+O4bYezwP3qnzPa60wiN1qEBbUE8SgJSyaT1PAAwlOdBkxx3ZlJ3tC0ppAowrmIYTgOWE13PI+AYQkRoecKCWekknxaHo4NCDx2LYi2wk0XzTC6J9aiOt49iEynP8k8SAGAl0ykbImR7CxBwIDAQAB', // 支付宝公钥，需要对结果验签时候必填
  privateKey: 'MIIEpAIBAAKCAQEAlKemLqcQzhNpGgTzjQo8x5XikzFD9ggYPko5klgNYXCZVsEK9mXCbmX8a1VAMJDscDPLCLCWhW080rNhDStBFc0bXasEC7yEu1gBwf9aVqszpTrneIbUjtKYWoT0UpWtR2P17vwlf8nsQhjWUPp29VOAZZABXqRr6zTi/ZJYkwjvCpkG+R4HZYKvTwYn5/i93zHP4HBEfzrq6aqlwJmNdOQIq1GfFa613zbRDMdzmeUiNTLM88rzuFUMMAIjcn3TQU8aj+LMC78GlgbObXGYz1DpIVMuhq9TCp9jH64K+0cG/9+phsD+rbUqT5g/i1tCXJF7cMxH5RovFyi1F7zaIQIDAQABAoIBAEimanwwX/Em4V26/8B1OWEdan8fO6SZLif7JInWCKwPWJFihNYIw24q36MhJd7WZQcs+NRFYTrSOUCMNCk4c3WRKQetFawatQ/OIgXKoz7qKrJcyFVKJ8WpPJY4liNqTSYvvzjN+BGtAI8JDmzDC7I33e9E4rZ7StbHoQvmIu2wVoVJWKmzx0rvNy5PD33suxOWa7f7mM9PBsJJ6McIprv0Z4Gcv95YvmjgL8J++AGyrx4qeB2BeXSAEg5k9Nx2Kje/Ff+nXnfgrnceN/fT93eUH8w301BBin72pR3+vIYPohPpZj3SB5KcKE9F8t/OZdssUHXzLW6LRcjQW13+bQECgYEA4Cbb90dfC0qW6b9QwAGIN0EN3rCo5a8/6xw5thQTCnlHx7r59Xm8dK5NdauGvxVz/n4mB7qE3eVXsG8Y0WL1DRV4S9fNdKERWI0W63/p6PdejXOJVkDl/R15p+eJvQTZRqAKPkasoObqmx4ETg+SrGTEebYcFRcGnNG5wkIpjxECgYEAqca3x0uotYHnUZ9K5V7dWON9VKc8av5/5vl3yRXZvfj4vf5NwXNm82qlfk2DR+HpZmZZrrVVJuOP/TQaWJhtDstM1qyH6J6AlPquNZKUuoyqjFYF4+CfkUbLA00FIvqr7xqIXAvcV4l9LJNZ6ioD9W3L6BxAMWJur6jvIICIuhECgYEAw2zdxn+xO7TyUiT8kApF6naLUyYOewIJ5j+biUWDPFR04ov/tadHSStWWUsMlbhsgusU2RQjFxsHEsophxSRtbCMSwOBGzf6WYvY+cVx+C0DgKvEhzDZ045JLLxPeD6r+Ek75QPVKgtpa4gGFNC6/hZ0vfCqFzEWEM9A9z6b4SECgYAmQSeB2ZNvKpEjvB/VJRX9BG1mGLStayEIu2d5QNoqSyJJNTbyAv3MlVgq6G5PUSEVOLS2gBdqxtXX+NiC4/2W2so6iO+qw6Q3bXC5k4i9rBp1uqBjI2bxBiGSYdVpd1AsdS8KhoWkl89DrwQQll0D/TR33X29Yu+L1yXijfPA8QKBgQDdbLO7ZOWOgB9zb80+N+OOJxgC5g4gum2dg/WvMO0riwH06/8C4QRdbOsHu8NiCALXzB1BUQyWnRPS4+QGY/gaZ7jhrL8bUkD5RFM7/cxKLhJTqjLoMcLoG4egYovJQGwAEBKu5LDBP+hnlqoDUGLhhJkPM9vVA92mPM00jqdaxQ==', // 应用私钥字符串
});


async function aliPay(params) {
    const formData = new AlipayFormData();
    formData.setMethod('get');
    // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
    formData.addField('notifyUrl', 'https://www.xuexiluxian.cn'); // 支付成功回调地址，必须为可以直接访问的地址，不能带参数

    formData.addField('bizContent', {
        outTradeNo: orderId, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
        productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
        totalAmount: '0.01', // 订单总金额，单位为元，精确到小数点后两位
        subject: '商品', // 订单标题
        body: '商品详情', // 订单描述

    });
     // 如果需要支付后跳转到商户界面，可以增加属性"returnUrl"
    formData.addField('returnUrl', 'https://opendocs.alipay.com');//加在这里才有效果,不是加在bizContent 里面


    const result =  await alipaySdk.exec(  // result 为可以跳转到支付链接的 url
    'alipay.trade.page.pay', // 统一收单下单并支付页面接口
    {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
    { formData: formData },
    );

    return result;
}


module.exports = aliPay;