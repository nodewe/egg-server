

// 用户相关的路由
const userRouter = require('../routers/admin/user');


// 菜单路由
const menuRouter = require('../routers/admin/menu');

// 部门表
const deptRouter = require('../routers/admin/dept');
// 角色
const roleRouter = require('../routers/admin/role');

//字典路由
const dictRouter = require('../routers/admin/dict')
//字典类型
const dictTypeRouter = require('../routers/admin/dictType');


module.exports = app=>{
    userRouter(app);

  
    menuRouter(app);
    
    deptRouter(app);
    
    roleRouter(app);
    
    dictRouter(app);
    
    dictTypeRouter(app);
}
