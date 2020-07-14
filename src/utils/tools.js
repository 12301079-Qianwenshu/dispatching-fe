/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-27 14:13:32
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-03 11:08:37
 */
export const deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let result = obj instanceof Array ? [] : {};
    for (let key in obj) {
        result[key] = deepCopy(obj[key]);
    }

    return result;
}

export const convertQueryString = (params) => {
    if (!params) {
        return '';
    }
    var query = '';
    for (let key in params) {
        if (params[key] || params[key] === 0) {
            if (query.indexOf('?') === -1) {
                query = query + `?${key}=${params[key]}`;
            } else {
                query = query + `&${key}=${params[key]}`;
            }
        }
    }
    return query;
}

export const mergeApi = (api = {}, ...prefix) => {
    for (let key in api) {
        if (typeof api[key] === 'object') {
            mergeApi(api[key], ...prefix);
        } else {
            prefix.forEach((item) => api[key] = `${item}${api[key]}`);
        }
    }

    return api;
}

const traversingChildren = (list, func, parent) => {
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (parent != null) {
            item.parent = parent;
        } else {
            item.parent = null
        }
        func(item, item.parent, i);
        if (item.children && item.children.length) {
            traversingChildren(item.children, func, item.key);
        }
    }
}

export const addKeysForTree = (data) => {
    for (let i = 0; i < data.length; i++) {
        traversingChildren([data[i]], (item, parent, index) => {
            if (parent != null) {
                item.key = `${parent}-${index}`
            } else {
                item.key = `${i}`
            }
        })
    }
}

export const uniqueArray = (arr) => {
    return Array.from(new Set(arr))
}

// 判断数据类型
export const dataType = (text) => {
    let typeStr = Object.prototype.toString.call(text)
    let type = typeStr.substring(8, typeStr.length - 1)
    return type
  }

