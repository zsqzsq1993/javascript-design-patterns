const strategies = {
    /**
     *
     * @param t - comsumed time
     * @param b - origin position
     * @param c - target position - origin position
     * @param d - total time
     * return position
     */
    linear(t,b,c,d) {
        return c*t/d + b
    },

    easeIn(t,b,c,d) {
        return c*(t/=d)*t+b
    },

    strongEaseIn(t,b,c,d) {
        return c*(t/=d)*t*t*t*t + b
    },

    strongEaseOut(t,b,c,d) {
        return c*((t=t/d-1)*t*t*t*t+1) + b
    },

    sinEaseIn(t,b,c,d) {
        return c*(t/=d)*t*t + b
    },

    sinEaseOut(t,b,c,d) {
        return c*((t=t/d-1)*t*t+1) + b
    }
}

class Animate {
    constructor(dom, interval) {
        this.dom = dom
        this.startTime = 0
        this.startPos = 0
        this.endPos = 0
        this.duration = 0
        this.easing = null
        this.propertyName = null
        this.interval = interval || 19
    }

    start(propertyName, endPos, easing, duration) {
        this.startTime = +new Date()
        this.propertyName = propertyName
        this.duration = duration
        this.endPos = endPos
        this.startPos = this.dom.getBoundingClientRect()[propertyName]
        this.easing = strategies[easing]
        const self = this
        return new Promise(resolve => {
            const timer = setInterval(() => {
                if (!self._step()) {
                    clearInterval(timer)
                    resolve(self)
                }
            }, this.interval)
        })
    }

    _step() {
        const t = +new Date()
        if (t > this.startTime + this.duration) {
            this._update(this.endPos)
            return false
        } else {
            const pos = this.easing(
                t - this.startTime,
                this.startPos,
                this.endPos - this.startPos,
                this.duration
            )
            this._update(pos)
            return true
        }
    }

    _update(pos) {
        this.dom.style[this.propertyName] = `${pos}px`
    }
}

(function () {
    const div = document.getElementsByClassName('hello')[0]
    const animate = new Animate(div)
    animate.start('left',400, 'strongEaseIn', 2000)
        .then(self => {
            return self.start('top', 200, 'linear', 1000)
        }).then(self => {
            return self.start('left', 200, 'strongEaseOut', 500)
        }).then(self => {
            return self.start('top', 0, 'sinEaseIn', 800)
    })
})()
