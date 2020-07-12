

# 单例模式

单例模式的定义是：保证一个类只有一个实例，并存在能访问到它的一个全局访问点。单例模式运用广泛，主要用于创建全局登陆窗口、全局缓存对象等全局变量。单例模式的大体思想是：在创造单例的类或函数中永久封闭一个指向该单例的引用，若引用不存在，创建单例并对引用赋值；若引用存在，直接取出引用指向的单例对象。

## 仿面向对象语言中的单例

传统的面向对象语言，如Java、C++，对象都是由类实例化而来的。JavaScript是一门无类（class-free）的语言，类的概念是基于原型链包装而成的，它可以摆脱类单独生成对象。因此，生搬单例模式根本毫无意义。但本着强化思维的角度，还是先写写如何利用JS的类来仿Java等语言生成单例。

### 使用静态方法

就像我之前提到的单例模式的核心思路是在创造单例的构造函数或函数中封闭一个“引用”。若使用静态方法创建单例，这个引用可以储存在构造函数这个对象中，也可以储存在闭包结构中。

**储存在构造函数对象中**：

```javascript
function Singleton(name) {
  this.name = name
}

Singleton.prototype.sayName = function () {
  console.log(this.name)
}

Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}

testBasicSingleton(Singleton)
```

`Singleton.getInstance`函数中的`this`指向`Singleton`这个构造函数，在JS中，函数也为对象。因此单例的引用就被储存为构造函数对象的一个属性。

**储存在构造函数对象中+ES6**：

```javascript
class Singleton {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }

  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }
}

testBasicSingleton(Singleton)
```

**储存在闭包结构中**：

```javascript
const Singleton = function (name) {
    this.name = name
}
Singleton.prototype.sayName = function () {
    console.log(this.name)
}
Singleton.getInstance = (function () {
    let instance = null
    return function (name) {
        if (!instance) {
            instance = new Singleton(name)
        }
        return instance
    }
})()

testBasicSingleton(Singleton)
```

**测试函数**：

```javascript
function testBasicSingleton(Singleton) {
    const obj1 = Singleton.getInstance('Jack')
    const obj2 = Singleton.getInstance('Tom')
    console.log(obj1 === obj2) // true
    obj1.sayName() // Jack
    obj2.sayName() // Jack
    console.log(obj1.instance) // undefined
    console.log(obj2.instance) // undefined
}
```

### 更通用的方式

使用静态方法创建并不是最通用方式，我们需要提前知道用该方法来创建。而创建对象更通用的方式还是使用关键字`new`。若使用这种方式，有两点需要注意：一是instance引用储存的位置，二是构造函数的返回值。

instance引用的储存位置可以让构造函数返回一个新的构造函数，把引用储存在闭包结构中，也可以把引用作为构造函数对象的属性储存。

构造函数是可以有返回值的，若返回一个对象，利用`new`关键字生成的对象就是返回的该对象。

**返回新的构造函数：**

```javascript
const CreateElement = (function () {
  let instance = null
  const RetConstructor = function (html) {
    if (!instance) {
      this.html = html
      this.init()
      instance = this
    }
    return instance
  }
  RetConstructor.prototype.init = function () {
    const div = document.createElement('div')
    div.innerText = this.html
    document.body.appendChild(div)
  }
  return RetConstructor
})()

const div1 = new CreateElement('div1')
const div2 = new CreateElement('div2')
console.log(div1 === div2)
console.log(div1.html)
console.log(div2.html)
```

**instance作为构造函数对象的属性储存：**

```javascript
class CreateElement{
  constructor(html) {
    if (!CreateElement.instance) {
      this.html = html
      this.init()
      CreateElement.instance = this
    }
    return CreateElement.instance
  }
  init() {
    const div = document.createElement('div')
    div.innerText = this.html
    document.body.appendChild(div)
  }
}

const div1 = new CreateElement('div1')
const div2 = new CreateElement('div2')
console.log(div1 === div2)
console.log(div1.html)
console.log(div2.html)
```

### 坚持单一职责原则

上面更通用的方式中