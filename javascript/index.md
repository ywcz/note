---
title: 你好阿，大潮吧
lang: zh-CN
prev: './throw'
next: false
---


# JavaScript

## 装饰器模式

```js
"use strict";
function getData(x) {
    //耗时操作
    return x;
}
function cacheGetData(func) {
    let map = new Map();
    return function (x) {
        if (map.has(x)) {
            return map.get(x) + "缓存";
        }
        let res = func(x);
        map.set(x, res);
        return res + "非缓存";
    }
}
let newGetData = cacheGetData(getData);
console.log(newGetData(1));
console.log(newGetData(1));
console.log(newGetData(1));
console.log(newGetData(1));
console.log(newGetData(2));

//====================================
let obj = {
    base: 100,
    getData(x){
        //耗时操作
        return x * this.base;
    }
}

//如果想用上面的cacheGetData函数装饰obj中的getData就不行了会抛出异常
obj.getData = cacheGetData(obj.getData);
console.log(obj.getData(1));
console.log(obj.getData(1));
console.log(obj.getData(1));
console.log(obj.getData(1));
console.log(obj.getData(2));
//TypeError: Cannot read properties of undefined (reading 'base') 


//================================================
//修改cacheGetData函数中的一行代码
let res = func(x); => let res = func.call(this, x);
//上述报错的地方正常运行
```