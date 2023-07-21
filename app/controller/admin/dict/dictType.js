const {
  Controller,
} = require('egg');
const { buildTree } = require('../../../utils/util');

// 字典模块
class DictController extends Controller {
  // 添加 字典类型
  async addDictType() {
    const body = this.ctx.request.body;
    body.create_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    const res = await this.app.mysql.insert('sys_dict_type',body)
    if(res.affectedRows>0){
      return this.ctx.body = {
        code: 200,
        msg: 'success',
      };
    }
    // this.ctx.status = 500;
    return this.ctx.body = {
      code: 500,
      msg: '新增失败',
    };
  }

  // 修改字典类型
  async putDictType() {
    const body = this.ctx.request.body;
    body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    const res = await this.app.mysql.update('sys_dict_type',body,{
      where:{
        id:body.id
      }
    })
    if(res.affectedRows>0){
      return this.ctx.body = {
        code: 200,
        msg: 'success',
      };
    }
    // this.ctx.status = 500;
    return this.ctx.body = {
      code: 500,
      msg: '修改失败',
    };
  }

  // 删除字典
  async delDictType() {
    const body = this.ctx.request.body;
    const res = await this.app.mysql.query(
      'delete from sys_dict_type where FIND_IN_SET(id,?)',
      [body.join(',')]
    )
    if(res.affectedRows>0){
      return this.ctx.body = {
        code: 200,
        msg: 'success',
      };
    }
    // this.ctx.status = 500;
    return this.ctx.body = {
      code: 500,
      msg: '删除失败',
    };
  }

  // 获取字典类型分页
  async getDictTypeList() {
    const query = this.ctx.request.query;
    let pageSize = query.pageSize || 10;
    let pageNum = query.pageNum || 1;
    // 
    const keywords = query.keywords || '';
    // 分页参数
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let sql1 = `select * from sys_dict_type u where CONCAT(u.name,u.code) REGEXP(?)  limit ?,?`;
    let sql2 = `select COUNT(id) from sys_dict_type u where CONCAT(u.name,u.code) REGEXP(?)`;

  
    try {
      const dictTypeList = await this.app.mysql.query(
        sql1,
        [ keywords, pageNum * pageSize - pageSize, pageSize ]
      );

      const dictTypeCount = await this.app.mysql.query(
        sql2,
        [ keywords ]
      );
      // console.log(dictTypeCount,'dictTypeCount');
      return this.ctx.body = {
        code: 200,
        message: 'success',
        data: {
          list: dictTypeList,
          total: dictTypeCount[0]['COUNT(id)'],
        },
      };
    } catch (e) {
      console.log(e, '字典类型分页');
    }
    return this.ctx.body = {
      code: 500,
      message: '失败',
    };
  }


  // 获取字典类型详情
  async getDictTypeInfo() {
    const query = this.ctx.request.query;
    const form = await this.app.mysql.get('sys_dict_type',{
      id:query.id
    })
    if(!form){
      return this.ctx.body = {
        code:500,
        msg:'获取失败',
      }
    }
    delete form.create_time
    delete form.update_time
    return this.ctx.body = {
      code:200,
      msg:'success',
      data:form
    }

  }

}

module.exports = DictController;
