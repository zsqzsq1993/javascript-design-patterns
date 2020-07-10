function varFor() {
    for(var i=0, len=5; i < len; i++) {
        setTimeout(function () {
            console.log(i)
        })
    }
}

function varForClosure() {
    for(var i=0, len=5; i < len; i++) {
        (function (i) {
            setTimeout(function () {
                console.log(i)
            })
        })(i)
    }
}

function letFor() {
    for(let i=0, len=5; i < len; i++) {
        setTimeout(function () {
            console.log(i)
        })
    }
}

function multiplicator() {
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
}

function multiplicator2() {
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
}

function command() {
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
}

function command2() {
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
}

function isFunc() {
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
}

function AOP() {
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

    console.log(func(2.1, 3.4)) // 60
}

function add() {
    const currying = function (fn) {
        const args = []
        return function () {
            if (arguments.length) {
                [].push.apply(args, arguments)
                // return arguments.callee
            } else {
                return fn.apply(this, args)
            }
        }
    }

    let cost = (function () {
        let total = 0
        return function () {
            for(let i=0, len=arguments.length; i < len; i++) {
                total += arguments[i]
            }
            return total
        }
    })()

    cost = currying(cost)

    console.log(
        cost(100), // undefined
        cost(100, 200), // undefined
        cost(300), // undefined
        cost() // 700
    )
}

function uncurryingPush() {
    Function.prototype.uncurrying = function () {
        const origin = this
        return function () {
            const obj = [].shift.call(arguments)
            return origin.apply(obj, arguments)
        }
    }

    Function.prototype.uncurrying2 = function () {
        const origin = this
        return function () {
            return Function.prototype.call.apply(origin, arguments)
        }
    }

    const obj = {
        "0": "h",
        "1": "e",
        "2": "l",
        "3": "l",
        "4": "o",
        length: 5
    }

    for(let key of ['push', 'shift', 'forEach']) {
        Array[key] = Array.prototype[key].uncurrying2()
    }

    Array.push(obj, "l")
    Array.shift(obj)
    Array.forEach(obj, (val, key) => {
        console.log(val) // ellol
    })

    console.log(obj.length)// 5
}

function throttleForMousemove() {
    function throttle(fn, interval) {
        if (!fn) {
            throw new Error('You have to insert a function')
        }
        const default_interval = 500
        let firstTimer = true
        let timer = null
        return function () {
            const self = this
            const args = arguments
            if (firstTimer) {
                firstTimer = false
                return fn.apply(this, arguments)
            }
            if (timer) {
                return false
            }
            timer = setTimeout(() => {
                const val = fn.apply(self, args)
                clearTimeout(timer)
                timer = null
                return val
            }, interval || default_interval)
        }
    }

    const func = (function () {
        let count = 0
        return function (event) {
            console.log(event.type)
        }
    })()

    document.onmousemove = throttle(func, 2000)
}
throttleForMousemove()
