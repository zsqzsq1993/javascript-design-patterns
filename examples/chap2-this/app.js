function inObj() {
    const obj = {
        name: 'Tom',
        sayName() {
            console.log(this === obj)
            console.log(this.name)
        }
    }
    obj.sayName()
}

function asCommonFunc1() {
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
}

function asCommonFunc2() {
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
}

function chainable() {
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
}

function chainableOnOuterFunc() {
    const btn1 = document.getElementById('button1')
    const btn2 = document.getElementById('button2')
    btn1.onclick = function () {
        console.log(btn1 === this)
    }
    btn2.onclick = () => {
        console.log(window === this)
    }
}

function asConstructFunc() {
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
    console.log(person.name)
    console.log(person1.name)
}

function applyAndcall() {
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
    addTogether(1,2,3)
}

function exampleOfBind() {
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
}

function simpleBind() {
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

}

function fullBind() {
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
}

fullBind()
