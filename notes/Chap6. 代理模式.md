# 代理模式

代理模式是针对对象的方法或是函数而言的。当请求对象的方法或调用函数时，我们不希望这些方法被直接执行，而是希望它们在特定的时机或是经过过滤、筛选再被执行时，这种情况使用代理模式再方便不过了。代理模式为源方法提供了一个代理方法，其有相同的对外接口。内部是不透明的，我们可以根据自己的需要来选择使用代理方法还是原方法。

比如发起一个请求：

```javascript
const result = get(data)
```

我们可能希望对data进行过滤，或是在合适时机才返回result，为了不污染原get方法，可以新写一个代理方法：

```javascript
const result = proxyGet(data)
```

## 虚拟代理

虚拟代理是用代理对象来完成开销较大的运算，等运算结束后，再请求原对象。这样不影响原对象的主要功能。常见的例子是图片的预加载。图片加载是一个时间开销较大的动作，可以将下载图片的任务交给虚拟代理来进行，当图片被加载好后，再交给真正的对象。原对象在图片加载完成之前，使用一个临时图片作为填充。

```javascript
const myImage = (function () {
  const img = document.createElement('img')
  document.body.appendChild(img)
  return {
    setSrc(src) {
      img.src = src
    }
  }
})()

const proxyMyImage = (function () {
    const image = new Image()
    image.onload = function () {
        myImage.setSrc(this.src)
    }
    return {
        setSrc(src) {
            myImage.setSrc('/easyloading.png')
            image.src = src
        }
    }
})()

proxyMyImage.setSrc('/hardloading.png')
```

当然，也可以把预加载和设置图片两个任务杂糅在对象的同一个方法中。但这样子就违反了单一职责的原则，两个任务直接会是强耦合的关系。当一个任务发生崩溃时，很可能会影响到另一个任务。想要更新或拓展某个任务时，也很难修改代码。使用虚拟代理的方式，降低了任务的耦合度，使设计更加聚合、强韧。

## 缓存代理

之前在写乘法函数时使用了缓存。其实缓存也运用了代理的思想。在进行乘法之前，先判断是否进行过相同的运算，判断的逻辑就可以写在代理方法内。

```javascript
function mul() {
  return [].reduce.call(arguments, (total, next) => {
    total *= next
    return total
  })
}

function add() {
  return [].reduce.call(arguments, (total, next) => {
    total += next
    return total
  })
}

const proxyFactory = function (fn) {
  const cache = []
  return function () {
    const argString = [].join.call(arguments, ',')
    if (cache[argString]) {
      console.log('use cache')
      return cache[argString]
    } else {
      return cache[argString] = fn.apply(this, arguments)
    }
  }
}

const proxyMul = proxyFactory(mul)
const proxyAdd = proxyFactory(add)
console.log(proxyMul(1,2,3))
console.log(proxyMul(1,2,3))
console.log(proxyAdd(1,2,3))
console.log(proxyAdd(1,2,3))
```

