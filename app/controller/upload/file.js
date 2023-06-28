const {
    Controller,
} = require('egg');
const {
    convertKeysToSnakeCase, DayJS
} = require('../../utils/util');

let fs = require('mz/fs');
const AliOss = require('./ali.oss.config');
const TencentCos = require('./tencent.oss.config');

// 上传文件
class UploadController extends Controller {
    //  上传到阿里云oss
    async uploadAliOSS() {
        const {
            ctx
        } = this;
        const file = ctx.request.files[0];
        let result;
        try {

            result = await AliOss.putObject(file.filename, file.filepath)
        } finally {
            // 需要删除临时文件
            await fs.unlink(file.filepath);
        }
        ctx.body = {
            url: result.url,
            // 获取所有的字段值
            data: result,
        };
    }

    //上传到腾讯云
    async uploadTencentCos() {
        const {
            ctx
        } = this;
        const file = ctx.request.files[0];
        let result;
        try {
            result = await TencentCos.putObjec(file.filename, file.filepath)
        } finally {
            // 需要删除临时文件
            await fs.unlink(file.filepath);
        }
        return ctx.body = {
            url: result.url,
            // 获取所有的字段值
            data: result,
        };
    }

    //上传本地服务器存储
    async uploadServerStorage(){
        const { ctx } = this
        // 1 获取我们上传文件。 是一个数组，只有一个文件情况下，默认为数组中的下标0。
        let file = ctx.request.files[0]
        try {
            // 3 读取文件内容
            let f = fs.readFileSync(file.filepath)
       
            // 8 将图片内容写入到文件夹下
            fs.writeFileSync(this.config.UPLOAD_DIR, f)
          } finally {
            // 清除临时文件
            ctx.cleanupRequestFiles();
          }    
          return ctx.body = {
            code:200,
            msg:'success',
            data:''
        }
    }
   
}

module.exports = UploadController;