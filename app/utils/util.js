const DayJS = require('dayjs');
require('dayjs/locale/zh-cn');
DayJS.locale('zh-cn')


/**
 *@description 将扁平化的数据转化为 tree类型
 * @param list.list
 * @param list {Array} 数据源
 * @param parentFunc {Function}  父节点的的数据筛选
 * @param childFunc {Function}  后代节点的筛选
 * @param primaryKey {String}  主键字段 默认 id字段
 * @param parentKey {String}  父级id 默认 父级id
 * @param list.parentFunc
 * @param list.childFunc
 * @param list.primaryKey
 * @param list.parentKey
 * @return {Array}  tree 类型数组
 */
function buildTree({ list, parentFunc, childFunc, primaryKey = 'id', parentKey = 'parent_id' }) {
  const getNode = id => {
    const nodes = [];
    for (const listElement of list) {
      if (listElement[parentKey] == id) {
        const menuItem = childFunc(listElement);
        menuItem.children = getNode(listElement[primaryKey]);

        nodes.push(menuItem);
      }
    }
    if (nodes.length === 0) return;
    return nodes;
  };

  const nodes = [];
  //筛查出数据源中tree_path 的length 最小的数 作为判断根节点的依据
  const min = Math.min(...list.map(ele=>ele.tree_path.split(',').length))
  // 先处理顶级根节点
  for (const listElement of list) {
    if(listElement.tree_path.split(',').length==min){
      const item = parentFunc(listElement);
      item.children = getNode(listElement[primaryKey]);
      nodes.push(item);
    }
    
  }
  return nodes;
}

function convertToCamelCase(key) {
  return key.replace(/_([a-z])/g, function(match, p1) {
    return p1.toUpperCase();
  });
}
/**
 * @description 对象中的key下划线转驼峰
 * @param {Object} obj 需要转的对象
 * @returns 
 */
function convertKeysToCamelCase(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(convertKeysToCamelCase);
    } else {
      const newObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = convertToCamelCase(key);
          newObj[newKey] = convertKeysToCamelCase(obj[key]);
        }
      }
      return newObj;
    }
  }
  return obj;
}



function convertToSnakeCase(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}
/**
 * @description 对象中的key驼峰转下划线
 * @param {Object} obj  需要转换的对象
 * @returns {Object}
 */
function convertKeysToSnakeCase(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(convertKeysToSnakeCase);
    } else {
      const newObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = convertToSnakeCase(key);
          newObj[newKey] = convertKeysToSnakeCase(obj[key]);
        }
      }
      return newObj;
    }
  }
  return obj;
}

module.exports = {
  buildTree,
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
  DayJS
};
