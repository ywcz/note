# 学个锤子的Vue

## ref是个啥？
创建一个包含响应式数据的引用对象。
- 语法：`const a = ref(initValue)`
- initValue可以是基本类型也可以是对象类型。
  - 基本类型的数据的响应式依然是通过`Object.defineProperty()`的`get`与`set`完成的
  - 对象类型的数据的则是使用了`reactive`函数

## reactive又是个啥？
创建一个对象类型的响应式数据。
- 语法：`const 代理对象 = reactive(源对象)`
- 数据是基于 JavaScript Proxy（代理） 实现响应式的。
