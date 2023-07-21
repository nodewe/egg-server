const {
  Controller,
} = require('egg');
const { buildTree, convertKeysToSnakeCase, convertKeysToCamelCase,DayJS } = require('../../../utils/util');

// 菜单模块
class MenuController extends Controller {
  // 添加 菜单
  async addMenu() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    const conn = await this.app.mysql.beginTransaction()
    const types = {
      'CATALOG':1,
      'MENU':2,
      'EXTLINK':3,
      'BUTTON':4,
    };

    try {
      body.type = types[body.type]
      // 说明是顶级菜单
      if(body.parent_id==0){
        body.tree_path = '0'
      }else{
        const menuParent = await conn.get('sys_menu',{
          id:body.parent_id
        });
        const tree_path =  menuParent.tree_path+','+body.parent_id
        body.tree_path = tree_path
      }
      body.create_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
       body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
      const res = await conn.insert('sys_menu',body);
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
      console.log(e,'添加菜单');
    }
  
    // this.ctx.status = 500;
    return this.ctx.body = {
      code: 500,
      msg: '添加失败',
    };
  }

  // 修改菜单信息
  async putMenu() {
    let body = this.ctx.request.body;
    body = convertKeysToSnakeCase(body)
    const types = {
      'CATALOG':1,
      'MENU':2,
      'EXTLINK':3,
      'BUTTON':4,
    };
    const conn = await this.app.mysql.beginTransaction()
    try {
      body.type = types[body.type]
      // 说明是顶级菜单
      if(body.parent_id==0){
        body.tree_path = '0'
      }else{
        const menuParent = await conn.get('sys_menu',{
          id:body.parent_id
        });
        const tree_path =  menuParent.tree_path+','+body.parent_id
        body.tree_path = tree_path
      }
      body.update_time = DayJS().format('YYYY-MM-DD HH:mm:ss')
      delete body.create_time;
      const res = await conn.update('sys_menu',body,{
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
      console.log(e,'修改菜单');
    }
  
  
    return this.ctx.body = {
      code:500,
      msg: '修改失败',
    };
  }

  // 删除菜单
  async delMenu() {
    const body = this.ctx.request.body;
    const res = await this.app.mysql.query(
      'delete from sys_menu where FIND_IN_SET(id,?)',
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

  // 获取菜单路由列表
  async getMenuRouteList() {
    try {
      const roleIds = this.ctx.state.userInfo.roleIds;
      //角色的code 集合
      const roles = this.ctx.state.userInfo.roles;
      // 根节点
      let menuList = await this.app.mysql.query(
        'select * from sys_menu where sys_menu.perm IS NULL AND id IN (select menu_id from sys_role_menu where FIND_IN_SET(role_id,?))',
        [roleIds.join(',')]
      );
      //当前角色能访问的 菜单筛选出来
      menuList = buildTree({
        list: menuList,
        parentFunc(item) {
          return {
            sort: item.sort,
            component: item.component ? item.component : undefined,
            path: item.path ? item.path : undefined,
            redirect: item.redirect ? item.redirect : undefined,
            meta: {
              title: item.name,
              hidden: item.visible != 1,
              icon: item.icon,
              keepAlive: true,
              roles,
            },
          };
        },
        childFunc(item) {
          return {
            sort: item.sort,
            component: item.component ? item.component : undefined,
            path: item.path ? item.path : undefined,
            // redirect:item.redirect,
            name: item.path ? item.path.slice(0, 1)
              .toUpperCase() + item.path.slice(1)
              .toLowerCase() : undefined,
            meta: {
              title: item.name,
              hidden: item.visible != 1,
              icon: item.icon,
              keepAlive: true,
              roles,
            },
          };
        },
      });


      // await conn.commit()
      return this.ctx.body = {
        code: 200,
        msg: 'success',
        data: menuList,
      };
    } catch (e) {
      //    await conn.rollback()
      console.log(e);
    }
    // return this.ctx.body = {
    //     code: 200,
    //     msg: 'success',
    //     data: 'getMenuRouteList'
    // }
  }

  // 获取菜单树形列表
  async getMenuTreeList() {
    const query = this.ctx.request.query;
    let keywords = query.keywords || '';
    //                          目录  菜单      外链   按钮
    const types = [ '', 'CATALOG', 'MENU', 'EXTLINK', 'BUTTON' ];
    let menuList = await this.app.mysql.query(
      `select * from sys_menu where name REGEXP(?)`,
      [keywords]
    );
    // console.log(menuList,'list');
    menuList = buildTree({
      list: menuList,
      parentFunc(item) {
        item.type = types[item.type];
        return item;
      },
      childFunc(item) {
        item.type = types[item.type];
        return item;
      },
    });
    return this.ctx.body = {
      code: 200,
      msg: 'success',
      data: menuList,
    };
  }

  // 获取菜单选项
  async getMenuOption() {
    let menuList = await this.app.mysql.select('sys_menu');
    if (menuList.length) {
      menuList = buildTree({
        list: menuList,
        parentFunc(item) {
          return {
            value: item.id,
            label: item.name,
          };
        },
        childFunc(item) {
          return {
            value: item.id,
            label: item.name,
          };
        },
      });
    }
    return this.ctx.body = {
      code: 200,
      msg: 'success',
      data: menuList,
    };
  }
  //获取菜单详情
  async getMenuInfo(){
    const query = this.ctx.request.query;
    const types = [ '', 'CATALOG', 'MENU', 'EXTLINK', 'BUTTON' ];
    let menuItem = await this.app.mysql.get('sys_menu',{
      id:query.id
    });

    if(menuItem){
      menuItem.type = types[menuItem.type];
       menuItem = convertKeysToCamelCase(menuItem)
      return this.ctx.body = {
        code:200,
        msg:'success',
        data:menuItem
      }
    }

    
    return this.ctx.body = {
      code:500,
      msg:'获取失败'
    }
  }

}

module.exports = MenuController;
