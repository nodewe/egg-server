const {
  Controller,
} = require('egg');
const { convertKeysToSnakeCase, convertKeysToCamelCase, DayJS } = require('../../../utils/util');

// 字典模块
class DictController extends Controller {
  // 添加 字典
  async addDict() {
    const body = this.ctx.request.body;
  
    body = convertKeysToSnakeCase(body)
    body.create_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    const res = await this.app.mysql.insert('sys_dict',body)
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

  // 修改字典
  async putDict() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
    const res = await this.app.mysql.update('sys_dict',body,{
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
  async delDict() {
    const body = this.ctx.request.body;
    const res = await this.app.mysql.query(
      'delete from sys_dict where FIND_IN_SET(id,?)',
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

  // 获取字典分页列表
  async getDictList() {
    const query = this.ctx.request.query;
    let pageSize = query.pageSize || 10;
    let pageNum = query.pageNum || 1;
    // 
    const name = query.name || '[\s\S]*';
    const typeCode = query.typeCode || '';
    // 分页参数
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let sql1 = `select * from sys_dict u where CONCAT(u.name) REGEXP(?) and u.type_code=? limit ?,?`,
    sql2 = `select COUNT(id) from sys_dict u where CONCAT(u.name) REGEXP(?) and u.type_code=?`,
    sql1Params = [name,typeCode, pageNum * pageSize - pageSize, pageSize],
    sql2Params = [ name,typeCode ]
    // 如果没有typeCode
    if(!typeCode){
      sql1 = `select * from sys_dict u where CONCAT(u.name) REGEXP(?) limit ?,?`;
      sql2 = `select COUNT(id) from sys_dict u where CONCAT(u.name) REGEXP(?)`;
      sql1Params = [name, pageNum * pageSize - pageSize, pageSize],
      sql2Params = [ name ]
    }
    try {
      const dictList = await this.app.mysql.query(
        sql1,
        sql1Params
      );

      const dictCount = await this.app.mysql.query(
        sql2,
        sql2Params
      );
      return this.ctx.body = {
        code: 200,
        message: 'success',
        data: {
          list: dictList,
          total: dictCount[0]['COUNT(id)'],
        },
      };
    } catch (e) {
      console.log(e, '字典分页');
    }
    return this.ctx.body = {
      code: 500,
      message: '查询失败',
    };
  }




  //获取字典详情
  async getDictInfo(){
    const query = this.ctx.request.query;
    let form = await this.app.mysql.get('sys_dict',{
      id:query.id
    })
    if(!form){
      return this.ctx.body = {
        code:500,
        msg:'获取失败',
      }
    }
    form = convertKeysToCamelCase(form)
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
