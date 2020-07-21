function normal() {
    class Beverage {

        constructor() {
            this.message = 'you have to realize it in child'

            this._init()
        }

        _boilWater() {
            console.log('boil water.')
        }

        _addWater() {
            throw new Error(this.message)
        }

        _pourIn() {
            throw new Error(this.message)
        }

        _addAddition() {
            throw new Error(this.message)
        }

        _init() {
            this._boilWater()
            this._addWater()
            this._pourIn()
            this._addAddition()
        }
    }

    class Coffee extends Beverage {
        _addWater() {
            console.log('add water into coffee')
        }

        _pourIn() {
            console.log('pour coffee into cup')
        }

        _addAddition() {
            console.log('add suger and milk')
        }
    }

    class Tea extends Beverage {
        _addWater() {
            console.log('add water into tea')
        }

        _pourIn() {
            console.log('pour tea into cup')
        }

        _addAddition() {
            console.log('add lemon')
        }
    }

    const coffee = new Coffee()
    setTimeout(() => {
        const tea = new Tea()
    }, 1000)
}

