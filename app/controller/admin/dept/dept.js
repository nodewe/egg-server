const {
  Controller,
} = require('egg');
const { buildTree, convertKeysToSnakeCase, convertKeysToCamelCase, DayJS } = require('../../../utils/util');

// 部门表
class DeptController extends Controller {
  // 添加 部门
  async addDept() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    const conn = await this.app.mysql.beginTransaction()
    try {
      // 说明是顶级菜单
      if(body.parent_id==0){
        body.tree_path = '0'
      }else{
        const deptParent = await conn.get('sys_dept',{
          id:body.parent_id
        });
        const tree_path =  deptParent.tree_path + ',' +body.parent_id;
        body.tree_path = tree_path
      }
      body.create_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
      body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
      const res = await conn.insert('sys_dept',body);
      if(res.affectedRows>0){
        await conn.commit()
        return this.ctx.body = {
          code: 200,
          msg: 'success',
          data:res.insertId
        };
      }
    } catch (e) {
      await conn.rollback()
    }
  
    // this.ctx.status = 500;
    return this.ctx.body = {
      code: 500,
      msg: '添加失败',
    };
  }

  // 修改部门
  async putDept() {
    let body = this.ctx.request.body;
    
    body = convertKeysToSnakeCase(body)
    const conn = await this.app.mysql.beginTransaction()
    try {
      // 说明是顶级菜单
      if(body.parent_id==0){
        body.tree_path = '0'
      }else{
        const deptParent = await conn.get('sys_dept',{
          id:body.parent_id
        });
        const tree_path =  deptParent.tree_path + ',' +body.parent_id;
        body.tree_path = tree_path
      }
      body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
      const res = await conn.update('sys_dept',body,{
        where:{
          id:body.id
        }
      })
      if(res.affectedRows>0){
        await conn.commit()
        return this.ctx.body = {
          code: 200,
          msg: 'success',
          data:res.insertId
        };
      }
    } catch (e) {
      await conn.rollback()
    }
  
  
    return this.ctx.body = {
      code:500,
      msg: '修改失败',
    };
  }

  // 删除部门
  async delDept() {
    const body = this.ctx.request.body;
    const res = await this.app.mysql.query(
      'delete from sys_dept where FIND_IN_SET(id,?)',
      [body.join(',')]
    )
    if(res.affectedRows>0){
      return this.ctx.body = {
        code: 200,
        msg: 'success',
      };
    };

    return this.ctx.body = {
      code: 500,
      msg: '删除失败',
    };
  }

  // 获取部门的列表
  async getDeptRouteList() {
    try {
      // 根节点
      let deptList = await this.app.mysql.query(
        'select * from sys_dept where sys_m.perm IS NULL'
      );
      deptList = buildTree({
        list:deptList,
        parentFunc:item=>{
          return {
            value: item.id,
            label: item.name,
          };
        },
        childFunc:item=>{
          return {
            value: item.id,
            label: item.name,
          };
        }
      })
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: deptList,
      };
    } catch (e) {
      console.log(e);
    }
    return this.ctx.body = {
        code: 500,
        msg: '查询失败',
    }
  }

  // 获取部门树形列表
  async getDeptTreeList() {
    const query = this.ctx.request.query;
    let keywords = query.keywords || ''
    console.log(keywords,'key');
    let deptList = await this.app.mysql.query(
      `select * from sys_dept where name REGEXP(?)`,
      [keywords]
    );
    // console.log(deptList,'deptList');
    deptList = buildTree({
      list: deptList,
      parentFunc: item => item,
      childFunc: item => item
    });
    return this.ctx.body = {
      code: 200,
      msg: 'success',
      data: deptList,
    };
  }

  // 获取部门 下拉列表
  async getDeptOptions() {
    // const
    try {
      const deptList = await this.app.mysql.select('sys_dept');

      const deptTreeList = buildTree({
        list:deptList,
        parentFunc:item=>{
          return {
            label:item.name,
            value:item.id
          }
        },
        childFunc:item=>{
          return {
            label:item.name,
            value:item.id
          }
        }
      })

      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: deptTreeList,
      };
    } catch (e) {

    }
    return this.ctx.body = {
      code: 500,
      msg: 'error',
    };
  }
  
  //获取菜单详情
  async getMenuInfo(){
    const query = this.ctx.request.query;
    let dept = await this.app.mysql.get('sys_dept',{
      id:query.id
    })
   
    if(dept){
      dept = convertKeysToCamelCase(dept)
      delete dept.create_time
      delete dept.update_time
      delete dept.create_by
      delete dept.update_by;
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data:dept
      };
    }
    return this.ctx.body = {
      code: 500,
      msg: 'error',
    };
  }
}

module.exports = DeptController;
