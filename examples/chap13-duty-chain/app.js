const
    OREDER_200 = 1,
    OREDER_500 = 2,
    NEXT = 'nextprocessor'

const discount200 = (orderType, pay, stock) => {
    if (orderType === OREDER_200 && pay) {
        console.log('give you back 20')
    } else{
        return NEXT
    }
}

const discount500 = (orderType, pay, stock) => {
    if (orderType === OREDER_500 && pay) {
        console.log('give you back 50')
    } else{
        return NEXT
    }
}

const noraml = (orderType, pay, stock) => {
    if (!pay) {
        console.log('you have to pay')
    } else if (stock > 0) {
        console.log('normal purchase')
    } else {
        console.log('out of stock')
    }
}

function example1() {
    class Processor {
        constructor(fn) {
            this.fn = fn
            this.nextprocessor = null
        }

        setNextProcessor(processor) {
            this.nextprocessor = processor
        }

        request() {
            const ret = this.fn.apply(this, arguments)
            if (ret === NEXT) {
                return this.nextprocessor.request.apply(this.nextprocessor, arguments)
            } else {
                return ret
            }
        }
    }

    const processorNormal = new Processor(noraml)
    const processor500 = new Processor(discount500)
    const processor200 = new Processor(discount200)

    processor500.setNextProcessor(processor200)
    processor200.setNextProcessor(processorNormal)

    processor500.request(1, true, 2)
    processor500.request(2, true, 3)
    processor500.request(3, true, 0)
}
 // AOP
function example2() {
    Function.prototype.after = function (fn) {
        const self = this
        return function () {
            const ret = self.apply(this, arguments)
            if (ret === NEXT) {
                return fn.apply(this, arguments)
            } else {
                return ret
            }
        }
    }

    const order = discount500.after(discount200).after(noraml)

    order(1, true, 2)
    order(2, true, 3)
    order(3, true, 0)
}

example2()
