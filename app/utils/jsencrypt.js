const nodeRsa = require('node-rsa');

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDfMPuFDzHXYJqQniQYWoEcjHa
eUuDl2KAQItsZuwGEhuLG42cZXb+jcwhCd+zzxcJR2kOTHuS7HQ83gvdsEYJ4IuF
U75Oomarv+RUu+3wGEsm/jutPLr2xDXOALwe9trVqTDCeuLn0h4UFeXI/qmxIF1x
4rdRhrqzX5BhMHsEywIDAQAB
-----END PUBLIC KEY-----`

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCDfMPuFDzHXYJqQniQYWoEcjHaeUuDl2KAQItsZuwGEhuLG42c
ZXb+jcwhCd+zzxcJR2kOTHuS7HQ83gvdsEYJ4IuFU75Oomarv+RUu+3wGEsm/jut
PLr2xDXOALwe9trVqTDCeuLn0h4UFeXI/qmxIF1x4rdRhrqzX5BhMHsEywIDAQAB
AoGACjTCBJXfjd4NRHA6aYKWNxgiFII7wVAb3jakW9q1UVdQegC+gjhB/0pEYQAi
NBPMBvVbCzgWk3X1I9BcfW20UewRSvA/n0ClMCABVhu+TmaDy6oY02odqKs1UEpp
xh2kkRWVJ5bRduFZPaeiheQyDLlsF9ZOepKeCJ0gf8vMBgkCQQD6s9HVJaE8fF4l
ARUdtp03p45mPUsNruq7Q0e6LqziJ9/2rbOFzNgrzFHAuiDESvcwQyF2ICWERoDP
ryM/mO5lAkEAhkQMl3qO41oI5w44REP/jKNI/GqbAL61lZrVmbxFXzHxHDs8pztQ
+uiUvr35UJDnW2dMIGIvuo9pTo2bU/sbbwJBAJth1jzgXMWrY4JV4GuRInI7JJQT
izAI6K117r/ja/2jrzkpwam9I4JJ2aW09tgSipBcGyImnHoWZIHUT+l79M0CQCu0
ePjSDzMYeq9jpJMsI0JPYJGxzfTnH0qslP0vGNHM+vQ6oBq7pzeVf927Dy3XjUfm
jxQ3gdvTlO7aD4a9xYcCQQD3W48/sgMurBAbTwQMD5OfM6u3et+A1BpmZRCbP9/3
Qav85MJFtIgKcPKBkp4QJMgY/W9P6T7bzQHeUnKDNUvG
-----END RSA PRIVATE KEY-----`

//加密解密
module.exports = {
  /**
   * @description 加密
   * @param {String} txt 
   * @returns 
   */
  encrypt(txt) {
    const encryptor = new nodeRsa(publicKey)
    encryptor.setOptions({ encryptionScheme: 'pkcs1' })
    return encryptor.encrypt(txt, 'utf8') // 对数据进行加密
  },

   /**
   * @description 解密
   * @param {String} txt 
   * @returns 
   */
  decrypt(txt) {
    const encryptor = new nodeRsa(privateKey);
    encryptor.setOptions({ encryptionScheme: 'pkcs1' });// 设置私钥
    return encryptor.decrypt(txt, 'utf8') // 对数据进行解密
  }
}

