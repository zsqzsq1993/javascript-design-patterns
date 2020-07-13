function basicSingletonES5() {
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
}

function basicSingletonES6() {
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
}

function basicSingletonClosure() {
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
}

function testBasicSingleton(Singleton) {
    const obj1 = Singleton.getInstance('Jack')
    const obj2 = Singleton.getInstance('Tom')
    console.log(obj1 === obj2) // true
    console.log(Singleton.instance === obj1)// true
    obj1.sayName() // Jack
    obj2.sayName() // Jack
    console.log(obj1.instance) // undefined
    console.log(obj2.instance) // undefined
}

function moreGeneralSingleton() {
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
}

function myThink() {
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
}

function proxy() {
    class CreateElement {
        constructor(html, text) {
            this.html = html
            this.text = text
            this.init()
        }

        init() {
            const div = document.createElement('div')
            div.innerText = this.html
            document.body.appendChild(div)
        }
    }

    const ProxySingleton = function (fn) {
        let instance = null
        return function (...args) {
            if (!instance) {
                instance = new fn(...args)
            }
            return instance
        }
    }

    const ProxyCreateElement = ProxySingleton(CreateElement)

    const obj1 = new ProxyCreateElement('hello', 'world')
    const obj2 = new ProxyCreateElement('hi', 'ocean')
    console.log(obj1 === obj2)
    console.log(obj1.html, obj2.text)
}

function createNameSpace() {
    const myApp = {}

    myApp.constructor.prototype.namespace = function (name) {
        let current = myApp
        const args = name.split('.')
        for (let arg of args) {
            if (!current[arg]) {
                current[arg] = {}
            }
            current = current[arg]
        }
    }

    myApp.namespace('age')
    myApp.namespace('name.first')
    myApp.namespace('name.last')
    console.log(myApp)
}

function lazySingleton() {
    const createElement = function (data) {
        const div = document.createElement('div')
        div.innerText = data
        document.body.appendChild(div)
        return div
    }

    const proxySingleton = function (fn) {
        let instance = null
        return function (data) {
            return instance || (instance = fn(data))
        }
    }

    const proxyCreateElement = proxySingleton(createElement)

    let div1, div2

    document.onclick = function () {
        div1 = proxyCreateElement('hi')
        div2 = proxyCreateElement('hello')
    }

    document.ondblclick = function () {
        console.log(div1 === div2)
    }
}

lazySingleton()
