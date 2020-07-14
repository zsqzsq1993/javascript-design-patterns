const event = (function () {
    const namespaceCache = {}
    const defaults = 'defaults'

    const _create = function (namespace) {
        namespace = namespace || defaults
        if (namespaceCache[namespace]) {
            return namespaceCache[namespace]
        } else {
            const cache = {}
            const offlineCache = {}

            const _listen = function (key, fn) {
                if (typeof offlineCache[key] !== 'undefined') {
                    fn(offlineCache[key])
                } else {
                    if (!cache[key]) {
                        cache[key] = []
                    }
                    cache[key].push(fn)
                }
            }

            const _trigger = function (key, data) {
                if (cache[key] && cache[key].length) {
                    while(cache[key].length) {
                        const fn = cache[key].shift()
                        fn(data)
                    }
                }
                offlineCache[key] = data
            }

            const _remove = function (key, fn) {
                if (cache[key] && cache[key].length) {
                    if (typeof fn === 'undefined') {
                        cache[key] && (cache[key].length = 0)
                        return true
                    }
                    let index;
                    _each(cache[key], (idx, fn1) => {
                        if (fn1 === fn) {
                            index = idx
                            return true
                        }
                    })
                    if (index) {
                        cache[key].splice(index, 1)
                        return true
                    } else {
                        return false
                    }
                }
            }

            const _each = function (array, fn) {
                for (let i in array) {
                    const val = array[i]
                    if (fn(i, val)) {
                        break
                    }
                }
            }

            return namespaceCache[namespace] = {
                listen: _listen,
                trigger: _trigger,
                remove: _remove
            }
        }
    }

    return {
        create: _create,

        listen() {
            const object = _create()
            object.listen.apply(this, arguments)
        },

        trigger() {
            const object = _create()
            object.trigger.apply(this, arguments)
        },

        remove() {
            const object = _create()
            object.remove.apply(this, arguments)
        }
    }
})()

const btn = document.getElementById('btn')

function test1() {
    event.listen('click', (a) => {
        console.log(a)
    })

    btn.onclick = () => {
        event.trigger('click', 1)
    }
}

function test2() {
    event.trigger('click', 1)

    event.listen('click', data => {
        console.log(data)
    })
}

function test3() {
    event.create('name1').listen('click', data => {
        console.log(data)
    })

    event.create('name2').listen('click', data => {
        console.log(data)
    })

    event.create('name1').trigger('click', 'name1')

    event.create('name2').trigger('click', 'name2')

}

