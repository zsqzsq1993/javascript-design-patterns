(function () {
    const form = document.getElementById('register')
    form.onsubmit = function () {
        const message = validateSubmit()
        if (message) {
            alert(message)
        }
    }

    const strategies = {
        isEmpty(val, message) {
            if (val === '') {
                return message
            }
        },

        minLength(val, len, message) {
            if (val.length < len) {
                return message
            }
        },

        maxLength(val, len, message) {
            if(val.length > len) {
                return message
            }
        },

        isTel(val, message) {
            if (!/^1[3|5|8][0-9]{9}$/.test(val)) {
                return message
            }
        }
    }

    class Validator {
        constructor() {
            this.cache = []
        }

        add(dom, rules) {
            for (let rule of rules) {
                let strategyAry = rule.strategy.split((':'))
                let message = rule.message
                const strategy = strategyAry.shift()
                strategyAry.unshift(dom.value)
                strategyAry.push(message)
                this.cache.push(function () {
                    return strategies[strategy].apply(dom, strategyAry)
                })
            }
        }

        start() {
            while(this.cache) {
                const func = this.cache.shift()
                const message = func()
                if (message) {
                    return message
                }
            }
        }
    }

    function validateSubmit() {
        const usr = document.getElementById('username')
        const pass = document.getElementById('password')
        const tel = document.getElementById('telephone')
        const validator = new Validator()
        validator.add(usr, [
            {
                strategy: 'isEmpty',
                message: 'Your input is empty.'
            },
            {
                strategy: 'minLength:6',
                message: 'Your input is less than minimum requirements.'
            }
        ])
        validator.add(pass, [{
            strategy: 'minLength:6',
            message: 'Your input is less than minimum requirements.'
        }])
        validator.add(tel, [{
            strategy: 'isTel',
            message: 'It\'s not telephone format.'
        }])

        const message = validator.start()
        return message
    }
})()
