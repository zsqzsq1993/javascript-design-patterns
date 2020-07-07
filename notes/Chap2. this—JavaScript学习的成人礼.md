

# this — Javascript学习的成人礼

有人说this是JS学习的成人礼。掌握并运用它，是成为一名优秀JS程序员的关键一步。JS中的this是关于函数的，它指向一个对象。它根据函数的执行环境而非声明环境进行绑定，表示“执行该函数时的对象”。

## this的指向

this指向的情况往往分为以下几种情况：

* 作为对象的方法调用
* 作为普通方法调用
* 作为构造函数调用
* 链式函数中的this
* apply, call, bind函数中对this的使用

### 作为对象调用

作为对象方法被调用时，指向该对象

```javascript
const obj = {
  name: 'Tom',
  sayName() {
    console.log(this === obj)
    console.log(this.name)
  }
}

obj.sayName()
// true
// 'Tom'
```

### 作为普通函数调用

作为普通函数调用时，指向全局对象，这个全局对象在浏览器中是window

```javascript
window.name = 'Tom'
const obj = {
  name: 'Jack',
  sayName() {
    console.log(this === obj)
    console.log(this.name)
  }
}
const sayName = obj.sayName
sayName()
// 'Tom'
```

若在对象方法的内部，有一个普通函数，该普通函数内部的this，也会指向window对象。这里可以理解为几乎每个函数都会创造自己的this，sayAge中新创建的this把sayName中的this屏蔽掉了。

```javascript
window.age = 99
const obj = {
  name: 'Jack',
  age: 18,
  sayName() {
    console.log(this.name)
    const sayAge = function () {
      console.log(this.age)
    }
    sayAge()
  }
}
obj.sayName()
// 'Jack'
// 99
```

### 函数的链式调用

上面👆所说的“几乎”是因为存在特例。函数的链式调用不会创建自己的this，它只会沿作用域链来继承this。因为它的这个特性，内部普通函数链式调用时，可以很好继承外部函数创造的this。

```javascript
window.age = 99
const obj = {
  name: 'Jack',
  age: 18,
  sayName() {
    console.log(this.name)
    const sayAge = () => {
      console.log(this.age)
    }
    sayAge()
  }
}
obj.sayName()
// 'Jack'
// 18
```

但是，链式调用的函数如果在其作用域链中一直都查找不到this指向的话，this最终又指向了window。

```javascript
const btn1 = document.getElementById('button1')
const btn2 = document.getElementById('button2')
btn1.onclick = function () {
	console.log(btn1 === this) // true
}
btn2.onclick = () => {
	console.log(window === this) //true
}
```

总之，链式调用函数的this需要向上继承。

### 作为构造函数调用

作为构造函数调用时，一般指向构造函数创造的实例对象。除非，构造函数显式地返回了一个对象，this将会指向显式返回的对象。

```javascript
function Person(name) {
  this.name = name
}
function Person1(name) {
  this.name = name
  return {
    name: 'hello'
  }
}
const person = new Person('Jack')
const person1 = new Person1('Tom')
console.log(person.name) //'Jack'
console.log(person1.name)//'hello'
```

## call & apply & bind

这三个函数都通过变更其他函数内部的this指向，来使这些其他函数变得更具灵活性。它们都在JS函数式编程中，起到了重要的作用。

### call & apply 区别

`Function.prototype.call`和`Function.prototype.apply`最早在ES3中被定义。

两个函数的第一个参数都是传入一个对象，用于指定调用这两个方法的函数内部this指向。

apply第二个参数为数组或类数组，用于传入调用apply函数的参数。

call后面的参数也同样用于传入参数，但却是一个个传入的。

简而言之，两个函数作用一模一样，执行了某个函数，但改变了函数执行时this的指向。apply和call传参方式不同。

### call & apply 作用

call和apply最大的作用是“借巢下蛋”。比如一些类数组调用数组才能调用的方法。

```javascript
function addTogether() {
  let total = 0
  try {
    arguments.forEach(item => {
      total += item
    })
  } catch (e) {
    [].forEach.call(arguments, item => {
      total += item
    })
  }
  console.log(total)
}

addTogether(1,2,3) // 6
```

arguments是Arguments类型的实例。它跟数组很像，是类数组。但`arguments instanceof Array`会得到false。因此它无法继承`Function.prototype`上的方法。想要调用这些方法，便可以通过apply或call。当然在ES6中，也可以如下这样实现：

```javascript
function addTogether(...args) {
  let total = 0
  args.forEach(item => {
    total += item
  })
  
  console.log(total)
}

addTogether(1,2,3) // 6
```

### call&apply为何可以借巢下蛋

以`Array.prototype.push`源码为例：

```javascript
function ArrayPush() {
  let n = TO_UNIT32(this.length)
  let m = %_ArgumentsLength()
  for(let i=0;i < m;i++) {
    this[i+n] = %_Arguments(i)
  }
  this.length = n + m
  return this.length
}
```

因此如果有一个whatever，想要借用这个函数，只需要满足：

* whatever本身可实现属性的读写 （基本类型都做不到）
* whatever本身有length属性，且可以读写 （Function类型做不到，其length属性只可读）

满足以上条件只需要再

* 让call& apply将`Array.prototype.push`中的this指向whatever

便可以完成借用。当然这一切也都需要感谢JS是门灵活的动态语言。

### bind

`Function.prototype.bind`在ES5中实现。bind的作用是，对某个函数的this进行永久绑定，并返回绑定好的的新函数。无论怎样调用新函数，this都指向绑定好的对象。就算对新函数使用call或者apply也无法进行“解绑”。

```javascript
window.name = 'Jane'

function sayName() {
	console.log(this.name)
}

const person = {
	name: 'Tom'
}

const sayTomName = sayName.bind(person)

sayTomName() // 'Tom'

sayTomName.call(null) // 'Tom'
```

#### bind的简单版实现

```javascript
Function.prototype.mybind = function (context) {
	const self = this
	return function () {
		self.apply(context, arguments)
	}
}

window.name = 'Jane'

function sayName() {
	console.log(this.name)
}

const person = {
	name: 'Tom'
}

const sayTomName = sayName.mybind(person)

sayTomName() // 'Tom'

sayTomName.call(window) // 'Tom'
```

bind除了传入第一个参数来指定对象外，还能为绑定好的函数预存一些参数。

#### bind的完整版实现

```javascript
Function.prototype.mybind = function () {
  const self = this
  const context = [].shift.call(arguments)
  const pre_args = [].slice.call(arguments)
  return function () {
    self.apply(context, [].concat.apply(pre_args, [].slice.call(arguments)))
  }
}

const obj = {
  name: 'Tom'
}

function test(...args) {
  console.log(this.name)
  console.log(args)
}

const testTom = test.mybind(obj,1,2)
testTom(3,4) 
// 'Tom'
// [1,2,3,4]
```



