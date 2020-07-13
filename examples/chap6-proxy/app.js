function loadingImage() {
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
}

function proxyCal() {
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
}

proxyCal()
