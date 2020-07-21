// (function () {
//     const strategies = {
//         /**
//          *
//          * @param t - comsumed time
//          * @param b - origin position
//          * @param c - target position - origin position
//          * @param d - total time
//          * return position
//          */
//         linear(t,b,c,d) {
//             return c*t/d + b
//         },
//
//         easeIn(t,b,c,d) {
//             return c*(t/=d)*t+b
//         },
//
//         strongEaseIn(t,b,c,d) {
//             return c*(t/=d)*t*t*t*t + b
//         },
//
//         strongEaseOut(t,b,c,d) {
//             return c*((t=t/d-1)*t*t*t*t+1) + b
//         },
//
//         sinEaseIn(t,b,c,d) {
//             return c*(t/=d)*t*t + b
//         },
//
//         sinEaseOut(t,b,c,d) {
//             return c*((t=t/d-1)*t*t+1) + b
//         }
//     }
//
//     class Animate {
//
//         constructor(dom, interval) {
//             this.dom = dom
//             this.startTime = 0
//             this.startPos = 0
//             this.endPos = 0
//             this.duration = 0
//             this.easing = null
//             this.propertyName = null
//             this.interval = interval || 19
//         }
//
//         start(propertyName, endPos, easing, duration) {
//             this.startTime = +new Date()
//             this.propertyName = propertyName
//             this.duration = duration
//             this.startPos = this.dom.getBoundingClientRect()[propertyName]
//             this.endPos = Number(this.startPos) + Number(endPos)
//             this.easing = strategies[easing]
//             const self = this
//             return new Promise(resolve => {
//                 const timer = setInterval(() => {
//                     if (!self._step()) {
//                         clearInterval(timer)
//                         resolve(self)
//                     }
//                 }, this.interval)
//             })
//         }
//
//         _step() {
//             const t = +new Date()
//             if (t > this.startTime + this.duration) {
//                 this._update(this.endPos)
//                 return false
//             } else {
//                 const pos = this.easing(
//                     t - this.startTime,
//                     this.startPos,
//                     this.endPos - this.startPos,
//                     this.duration
//                 )
//                 this._update(pos)
//                 return true
//             }
//         }
//
//         _update(pos) {
//             this.dom.style[this.propertyName] = `${pos}px`
//         }
//     }
//     const ball = document.getElementsByClassName('ball')[0]
//     const content = document.getElementsByClassName('input-content')[0]
//     const btn = document.getElementsByClassName('btn')[0]
//
//     function setCommand(btn, command, content) {
//         btn.onclick = () => {
//             const distance = content.value
//             command.execute(distance)
//         }
//     }
//
//     function MoveCommand(receiver) {
//         return {
//             execute(distance) {
//                 receiver.start('left', distance, 'strongEaseIn', 1000)
//             }
//         }
//     }
//
//     const animatedBall = new Animate(ball)
//     const command = MoveCommand(animatedBall)
//     setCommand(btn, command, content)
// })()

(function () {
    const cache = []

    const btn = document.getElementsByClassName('btn')[0]

    const body = {
        left() {
            console.log('going left...')
        },

        right() {
            console.log('going right...')
        },

        up() {
            console.log('going up...')
        },

        down() {
            console.log('going down...')
        }
    }

    const MakeCommand = function (receiver, action) {
        if (receiver[action]) {
            return function () {
                receiver[action]()
            }
        }
    }

    const commandMap = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
    }

    document.onkeydown = (event) => {
        const command = MakeCommand(body, commandMap[event.key])
        if (command) {
            command()
            cache.push(command)
        }

        if (event.key === 'Enter') {
            let timer;
            while(cache.length) {
                const command = cache.shift()
                timer = setTimeout(() => {
                    command()
                }, 500)
            }
        }
    }
})()
