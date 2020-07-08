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

    const currying = function (fn) {
        const args = []
        return function () {
            if (arguments.length) {
                [].concat.apply(args, arguments)
            } else {
                fn.apply(this, fn)
            }
        }
    }
}

