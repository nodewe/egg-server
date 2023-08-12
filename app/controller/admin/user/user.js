const {
  Controller,
} = require('egg');

const jwt = require('jsonwebtoken');
const { encrypt } = require('../../../utils/jsencrypt');
const formatToHump = value => {
  return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase());
};

// 用户模块
class UserController extends Controller {
  // 登录
  async login() {
    const body = this.ctx.request.body;
    const {
      app,
    } = this;
    //是否是win端标记
    const isWin = this.ctx.request.headers.iswin
    const captcha = this.ctx.session.captcha;
    //如果不是window端
    if(!isWin){
         // 验证码不相等相等
      if(body.verifyCode !=captcha){
        return this.ctx.body = {
          code: 500,
          msg: '验证码错误',
        };
      }
    }
 
 
      // 如果 数据库中密码和用户名相等就返accessToken
      try {
        //如果开启了加密模式
        // if(this.app.config.password.enabled){
        //   body.password = encrypt(body.password)
        // }
        const ret = await this.app.mysql.query(
          'select id,username,password from sys_user where username=? and password=?',
          [ body.username, body.password ]
        );
        console.log(ret, 'ret');
        if (!ret.length) {
          return this.ctx.body = {
            code: 500,
            msg: '用户名或密码错误',
          };
        }
        // 用户信息加密成token
        const token = jwt.sign({
            id: ret[0].id,
          },
          app.config.jwt.security, {
            expiresIn: '24h',
          }
        );
        return this.ctx.body = {
          code: 200,
          msg: 'success',
          data: {
            accessToken: token,
          },
        };
      } catch (e) {
        console.log('登录报错', e);
        return this.ctx.body = {
          code: 500,
          msg: e,
        };
      }


    
   
  }

  // 添加用户
  async addUser() {
    const body = this.ctx.request.body;
    const conn = await this.app.mysql.beginTransaction();
    // 先插入添加用户
    // 将角色插入到角色和用户的关联表中
    const roleId = body.roleIds;
    body.dept_id = body.deptId;
    delete body.deptId;

    delete body.roleIds;
    try {
        //  //如果开启了加密模式
        //  if(this.app.config.password.enabled){
        //   body.password = encrypt('123456')
        // }
      const addUser = await conn.insert('sys_user', body);
      // 插入成功
      if (addUser.affectedRows > 0) {
        // addUser.insertId
        const insertList = roleId.map(ele => [ ele, addUser.insertId ]);
        const res = await conn.query(
          'INSERT INTO sys_user_role (role_id,user_id) values ?',
          [ insertList ]
        );
        if (res.affectedRows == insertList.length) {
          await conn.commit();
          // 说明插入成功
          return this.ctx.body = {
            code: 200,
            message: 'success',
          };
        }
        return this.ctx.body = {
          code: 500,
          message: '添加失败',
        };

      }
      return this.ctx.body = {
        code: 500,
        message: '添加失败',
      };


    } catch (e) {
      console.log('添加用户', e);
      await conn.rollback();
    }

  }

  // 删除用户
  async delUser() {
    const body = this.ctx.request.body;
    try {
      const res = await this.app.mysql.query(
        'DELETE FROM sys_user where FIND_IN_SET(id,?)',
        [ body.join(',') ]
      );
      if (res.affectedRows == body.length) {
        return this.ctx.body = {
          code: 200,
          message: 'success',
        };
      }
    } catch (e) {
      console.log(e, '删除失败');
    }
    return this.ctx.body = {
      code: 200,
      message: '删除失败',
    };
  }

  // 修改
  async putUser() {
    const body = this.ctx.request.body;
    body.dept_id = body.deptId;
    delete body.deptId;

    const conn = await this.app.mysql.beginTransaction();
    try {
      // 先删除 sys_user_role 表对应的角色
      await conn.delete('sys_user_role', {
        user_id: body.id
      });
      // 在插入 新的角色id
      const res = await conn.query(
        `insert into sys_user_role (user_id,role_id) values ?`,
        [ body.roleIds.map(ele => [ body.id, ele ]) ]
      );
      if (res.affectedRows > 0) {
        delete body.roleIds;
        const ret = await conn.update('sys_user', body, {
          where: {
            id: body.id
          }
        });
        if (ret.affectedRows > 0) {
          await conn.commit();
          return this.ctx.body = {
            code: 200,
            message: 'success',
          };
        }
      }
      //更新用户信息
    } catch (e) {
      await conn.rollback();
    }
    return this.ctx.body = {
      code: 500,
      message: '修改失败',
    };
  }

  // 分页查询
  async list() {
    const query = this.ctx.request.query;
    let pageSize = query.pageSize || 10;
    let pageNum = query.pageNum || 1;
    // 关键字 查询 用户名 昵称 手机号
    const keywords = query.keywords || '[\s\S]*';
    const deptId = query.deptId || '';
    // 分页参数
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let sql1 = `select * from sys_user u where CONCAT(u.username,u.nickname,u.mobile) REGEXP(?) AND dept_id = ${deptId} limit ?,?`;
    let sql2 = `select COUNT(id) from sys_user u where CONCAT(u.username,u.nickname,u.mobile) REGEXP(?) and dept_id = ${deptId}`;

    if(!deptId){
      sql1 = `select * from sys_user u where CONCAT(u.username,u.nickname,u.mobile) REGEXP(?) limit ?,?`;
      sql2 = `select COUNT(id) from sys_user u where CONCAT(u.username,u.nickname,u.mobile) REGEXP(?)`;
    }
    try {
      const userList = await this.app.mysql.query(
        sql1,
        [ keywords, pageNum * pageSize - pageSize, pageSize ]
      );

      const userCount = await this.app.mysql.query(
        sql2,
        [ keywords ]
      );
      return this.ctx.body = {
        code: 200,
        message: 'success',
        data: {
          list: userList,
          total: userCount[0]['COUNT(id)'],
        },
      };
    } catch (e) {
      console.log(e, '用户分页');
    }
    return this.ctx.body = {
      code: 200,
      message: 'success',
      data: 'list',
    };
  }

  //重置用户密码
  async resetPassword(){
    const query = this.ctx.request.query;
    // if(this.app.config.password.enabled){
    //   query.password = encrypt(query.password)
    // }
    const res = await this.app.mysql.query(
      `UPDATE FROM sys_user SET password = ? WHERE id = ?`,
      [query.password,query.id]
    )
    if(res.affectedRows>0){
      return this.ctx.body = {
        code:200,
        msg:'success'
      }
    }
    return this.ctx.body = {
      code:500,
      msg:'重置失败'
    }
  }

  // 当前登录用户信息
  async getMeInfo() {
    // const body = this.ctx.request.query;
    // console.log(t);
    return this.ctx.body = {
      code: 200,
      message: 'success',
      data: this.ctx.state.userInfo,
    };
  }

  // 根据id获取用户信息
  async getUserInfoById() {
    const query = this.ctx.request.query;
    console.log(query, 'query');
    if (!query.userId) {
      return this.ctx.body = {
        code: 500,
        msg: '用户id不能为空',
      };
    }

    try {
      // 用户信息
      const userInfo = await this.app.mysql.query(
        'SELECT id,avatar,dept_id,email,gender,mobile,nickname,status,username FROM sys_user where id = ?',
        [ query.userId ]
      );
      if (!userInfo.length) {
        return this.ctx.body = {
          code: 500,
          msg: '查无此人',
        };
      }
      // 角色
      const roleIds = await this.app.mysql.query(
        'SELECT role_id FROM sys_user_role where user_id = ?',
        [ query.userId ]
      );
      userInfo[0].roleIds = roleIds.map(ele => ele.role_id);
      userInfo[0].deptId = userInfo[0].dept_id;
      delete userInfo[0].dept_id;
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: userInfo[0],
      };
    } catch (e) {
      console.log(e, '根据用户id查询信息');
    }
  }
}

module.exports = UserController;
