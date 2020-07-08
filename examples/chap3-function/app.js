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

command2()
