# JavaScript函数式编程

JS是一门面向对象的语言，但它仍有许多函数式编程语言的特性。其中闭包和高阶函数又是JS函数式编程永远绕不开的话题。

## 闭包

### 我对闭包的理解

闭包到底是什么？是函数？是作用域？是活动对象？还是生命周期？我认为以上都不是。闭包之所以抽象是因为它无法用上述单个概念进行解释。闭包应该是一种结构，一种保存（封闭）了本应被销毁的局部变量的结构。

与闭包紧密相关的是变量的作用域以及变量的生命周期。

变量的作用域是指，除了全局变量外，其他变量都属于块级作用域内的局部变量。块内可以向块外“窥探”以取得块外作用域中变量的引用。块外却无法获知块内变量的信息。作用域链是单向的。

变量的生命周期是指，当某执行块儿执行完成后，块内的局部变量会被及时销毁。如函数调用完成后，函数内部的变量马上会被销毁。

以下是打破这一原则闭包的常见形式：

```javascript
function outer(val1) {
  const val2 = 2
  return function(val3) {
    return val1 + val2 + val3
  }
}

const inner = outer(1)
inner(3)
```

`const inner = outer(1)`当outer函数执行完后，内部的val1和val2本应该被及时销毁。但是，outer函数却返回了一个匿名函数，这个匿名函数中又引用了val1和val2。这个匿名函数形成了一个闭包结构，使本应被销毁的局部变量得以保存。直到显式地消除引用`inner = null`，闭包结构才会随着匿名函数一道被垃圾回收。

### 闭包的经典案例

在ES6之前，不存在let和const的定义。一切变量都是用var进行声明的。setTimeout是异步函数，而异步函数总是在同步函数都执行完后再执行的。因此等i递增到5后，注册的5个异步函数才开始执行，输出五个5。

```javascript
for(var i=0, len=5; i < len; i++) {
  setTimeout(function () {
    console.log(i)
  })
}
```

下面的例子会输出0，1，2，3，4。不同点在于setTimeout外包裹了一层立即执行的函数，而正是这层函数形成的闭包结构封闭了变量，使得打印结果不同。i递增后以参数的身份被传入函数。函数执行完成后，index变量没有立即被销毁，因为setTimeout这个异步函数仍保存有对它的引用。当i递增至5后，注册的5个异步函数才开始执行，打印的是开始分别封闭好的index。

```javascript
for(var i=0, len=5; i < len; i++) {
  (function (index) {
    setTimeout(function () {
      console.log(index)
    })
  })(i)
}
```

当然，在ES6中用let进行声明，可以自动生成块级作用域，形成闭包结构，免去了`(function(){})()`的麻烦。

```javascript
for(let i=0, len=5; i < len; i++) {
  setTimeout(function () {
    console.log(i)
  })
}
```

### 闭包的作用

#### 1. 封装变量

利用闭包结构，封闭一些不需要暴露在全局中的变量，避免污染。以下是个带缓存机制的multiplicator。

```javascript
const cache = {}

function cal() {
  const args = [].join.call(arguments, ',')
  if (cache[args]) {
    console.log('use cache')
    return cache[args]
  } else {
    return cache[args] = [].reduce.call(arguments, (total,num) => {
      total *= num
      return total
    })
  }
}
console.log(cal(1,2,3))
console.log(cal(1,2,3))
```

利用闭包可以避免cache对全局的污染。除此之外，真正计算乘积的代码部分也是不变的。基于封装不变的原则，也可以利用闭包，对其进行封装。

```javascript
const cal = (function () {
  const cache = {}
  const mul = function () {
    return [].reduce.call(arguments, (total,num) => {
      total *= num
      return total
    })
  }
  return function () {
    const args = [].join.call(arguments, ',')
    if (cache[args]) {
      console.log('use cache')
      return cache[args]
    } else {
      return cache[args] = mul.apply(null, arguments)
    }
  }
})()

console.log(cal(1,2,3))
console.log(cal(1,2,3))
```

#### 2. 命令模式

命令模式是指，将请求封装成对象，从而分离请求发起者与请求接收者之间的耦合关系。

```javascript
const tv = {
  open() {
    console.log('tv is opened.')
  },
  close() {
    console.log('tv is closed.')
  }
}

class OpenTvCommand{
  constructor(receiver) {
    this.receiver = receiver
  }

  execute() {
    this.receiver.open()
  }

  undo() {
    this.receiver.close()
  }
}

function setCommand(command) {
  const openBtn = document.getElementById('open')
  const closeBtn = document.getElementById('close')
  openBtn.addEventListener('click', () => {
    command.execute()
  })
  closeBtn.addEventListener('click', () => {
    command.undo()
  })
}

setCommand(new OpenTvCommand(tv))
```

在这里tv是指令的接收者，openBtn&closeBtn是指令的发起者。指令通过OpenTvCommand类型的实例进行传递，指令的接收与发起者完成解耦。tv这个指令的接收者是预定义的，也可以通过闭包来实现。闭包版本如下：

```javascript
const tv = {
  open() {
    console.log('tv is opened.')
  },
  close() {
    console.log('tv is closed.')
  }
}

const command = (function (receiver) {
  const execute = function () {
    receiver.open()
  }
  const undo = function () {
    receiver.close()
  }
  return {
    execute,
    undo
  }
})(tv)

function setCommand(command) {
  const openBtn = document.getElementById('open')
  const closeBtn = document.getElementById('close')
  openBtn.addEventListener('click', () => {
    command.execute()
  })
  closeBtn.addEventListener('click', () => {
    command.undo()
  })
}

setCommand(command)
```

## 高阶函数

### 什么是高阶函数

满足以下特性之一的，被称为高阶函数（High-order function）：

* 接收一个或者多个函数作为参数
* 输出一个函数

接收函数作为参数的情况一般有：作为回调函数（callback）传入、作为sort函数的比较函数传入等情况。闭包的结构一般都需要一个函数作为输出。以下是一个利用闭包，为一个对象批量注册数据类型判断函数的例子。

```javascript
const type = (function () {
  const Type = {}
  for(let type of ['Array', 'Number', 'String']) {
    Type[`is${type}`] = function (obj) {
      return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
  }
  return Type
})()

console.log(
  type.isArray([1,2,3]),
  type.isNumber(123),
  type.isString('123')
)
```

### 高阶函数实现AOP

AOP（面向切面编程）是指将跟核心业务逻辑无关的功能抽离出来。再通过动态织入的方式将其插入核心业务逻辑的模块中。这样做的好处是，核心业务逻辑模块（以及抽离出来的模块）都有较高的纯净度和聚合度，便于维护。这样编织的库，拓展性也更好。

下面是一个简单的高阶函数实现AOP的例子。函数会在处理核心乘法逻辑之前，自动去除参数的小树部分，在返回乘积后自动进行10倍放大。

```javascript
Function.prototype.before = function (fn) {
  const self = this
  return function () {
    let args = fn.apply(this, arguments)
    return self.apply(this, args)
  }
}

Function.prototype.after = function (fn) {
  const self = this
  return function () {
    const ret = self.apply(this, arguments)
    return fn.call(this, ret)
  }
}

let func = function (a, b) {
  return a*b
}

func = func.before((a,b) => {
  a = Math.floor(a)
  b = Math.floor(b)
  return [a, b]
}).after(ret => {
  return ret*10
})

console.log(func(2.1, 3.4)) 
```

### 高阶函数实现函数柯里化

柯里化（currying）又称为部分求值。多次调用函数，函数在接收参数后并不会马上求值，而是将参数在函数形成的闭包中保存起来。待最后一次调用，对前面保存的参数一次性求值。下方的函数用于对费用进行累加。每调用一次cost，便会进行一次求值。

```javascript
const cost = (function () {
  let total = 0
  return function () {
    for(let i=0, len=arguments.length; i < len; i++) {
      total += arguments[i]
    }
    return total
  }
})()

console.log(
  cost(100), // 100
  cost(100, 200), // 400
  cost(300) // 700
)
```

我们可以通过currying这个通用函数来对函数进行柯里化：



