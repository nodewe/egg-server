const {
  Controller,
} = require('egg');
const { convertKeysToSnakeCase } = require('../../utils/util');

// 角色模块
class RoleController extends Controller {
  // 添加 角色
  async addRole() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    const res = await this.app.mysql.insert('sys_role', body);
    if (res.affectedRows > 0) {
      // this.ctx.status = 500;
      return this.ctx.body = {
        code: 200,
        msg: '添加成功',
      };
    }

  }

  // 修改角色信息
  async putRole() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    const res = await this.app.mysql.update('sys_role', body, {
      where: {
        id: body.id,
      },
    });
    if (res.affectedRows > 0) {
      return this.ctx.body = {
        code: 200,
        msg: '修改成功',
      };
    }
  }

  // 修改角色菜单权限
  async putRoleMenu() {
    const body = this.ctx.request.body;
    const conn = await this.app.mysql.beginTransaction();
    // 先删除roleId 对应的菜单 在添加
    try {

      const res = await conn.delete('sys_role_menu', {
        role_id: body.roleId,
      });

      if (!body.menuIds.length) {
        await conn.commit();
        return this.ctx.body = {
          code: 200,
          msg: '修改成功',
        };
      }
      // 添加插入
      const insertList = body.menuIds.map(ele => [ body.roleId, ele ]);
      const ret = await conn.query(
        'INSERT INTO sys_role_menu (role_id,menu_id) values ?',
        [ insertList ]
      );
      // console.log(ret, insertList.length);
      if (ret.affectedRows == insertList.length) {
        await conn.commit();
        return this.ctx.body = {
          code: 200,
          msg: '修改成功',
        };
      }
    } catch (e) {
      console.log('修改角色权限 ', e);
    }

    return this.ctx.body = {
      code: 500,
      msg: '修改失败',
    };
  }

  // 删除角色
  async delRole() {
    const body = this.ctx.request.body;
    const res = await this.app.mysql.query(
      `delete from sys_role where FIND_IN_SET(id,?)`,
      [body.join(',')]
    )
    if(res.affectedRows==body.length){
      return this.ctx.body = {
        code: 200,
        msg: 'success',
      };
    }
    return this.ctx.body = {
      code: 200,
      msg: '删除失败',
    };
  }

  // 获取角色树形列表
  async getRoleTreeList() {
    const body = this.ctx.request.query;
    return this.ctx.body = {
      code: 200,
      msg: 'success',
      data: 'getRoleTreeList',
    };
  }

  // 获取所有角色分页
  async getRoleList() {
    const query = this.ctx.request.query;
    let pageSize = query.pageSize;
    let pageNum = query.pageNum;
    // 角色名字
    const keywords = query.keywords || '';
    // 分页参数
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);

    try {
      const roleList = await this.app.mysql.query(
        'select * from sys_role r where CONCAT(r.name) REGEXP(?) limit ?,?',
        [ keywords, pageNum*pageSize-pageSize, pageSize ]
      );

      const roleCount = await this.app.mysql.query(
        'select COUNT(id) from sys_role r where CONCAT(r.name) REGEXP(?)',
        [ keywords ]
      );
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: {
          list: roleList,
          total: roleCount[0]['COUNT(id)'],
        },
      };
    } catch (e) {
      console.log(e, '角色分页');
    }
    return this.ctx.body = {
      code: 500,
      msg: '获取失败',
    };
  }

  // 获取所有角色  参数形式
  async getRoleOptions() {
    try {
      const roleList = await this.app.mysql.select('sys_role');
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: roleList.map(ele => ({
          value: ele.id,
          label: ele.name,
        })),
      };
    } catch (e) {

    }
  }

  // 获取角色的菜单id集合
  async getMenuIdByRoleId() {
    const query = this.ctx.request.query;
    const menuId = await this.app.mysql.select('sys_role_menu', {
      where: {
        role_id: query.roleId,
      },
    });
    return this.ctx.body = {
      code: 200,
      msg: 'success',
      data: menuId.map(ele => ele.menu_id),
    };
  }

}

module.exports = RoleController;
