function normalUpload() {
    const startUpLoad = (function () {
        let uid = 0
        return function (fileType, files) {
            class UpLoad {
                constructor(fileType, file, id) {
                    this.id = id
                    this.fileType = fileType
                    this.fileSize = file.size
                    this.fileName = file.name
                    this.dom = null
                    this._init()
                }

                _init() {
                    this.dom = document.createElement('div')
                    this.dom.innerHTML =
                        `<span>id: ${this.id}</span> ` +
                        `<span>fileType: ${this.fileType}</span>` +
                        `<span>filenName: ${this.fileName} </span>` +
                        `<span>fileSize: ${this.fileSize} </span>` +
                        `<button>delete me</button>`
                    const btn = this.dom.querySelector('button')
                    btn.onclick = () => {
                        this._delFile()
                    }
                    document.body.appendChild(this.dom)
                }

                _delFile() {
                    if (this.fileSize < 3000) {
                        this.dom.parentNode.removeChild(this.dom)
                    } else {
                        if (confirm('Are you sure to delete?')) {
                            this.dom.parentNode.removeChild(this.dom)
                        }
                    }
                }
            }

            files.forEach(file => {
                const obj = new UpLoad(fileType, file, uid++)
            })
        }
    })()

    startUpLoad('flash', [
        {
            name: '1.flash',
            size: 4000
        },
        {
            name: '2.flash',
            size: 1500
        }
    ])

    startUpLoad('plugin', [
        {
            name: '1.plg',
            size: 4000
        },
        {
            name: '2.plg',
            size: 1500
        }
    ])
}

function flyweightUpload() {
    let uid = 0

    class Upload {
        constructor(fileType) {
            this.fileType = fileType
        }

        _delFile() {
            if (this.fileSize < 3000) {
                this.dom.parentNode.removeChild(this.dom)
            } else {
                if (confirm('Are you sure to delete?')) {
                    this.dom.parentNode.removeChild(this.dom)
                }
            }
        }
    }

    const createFlyWeightObj = (function () {
        const cache = {}
        return function (fileType) {
            if (cache[fileType]) {
                return cache[fileType]
            } else {
                return cache[fileType] = new Upload(fileType)
            }
        }
    })()

    const uploadManager = (function () {
        const cache = {}
        return {
            add(fileType, file, id) {
                const dom = document.createElement('div')
                dom.innerHTML =
                    `<span>id: ${id}</span> ` +
                    `<span>fileType: ${fileType}</span>` +
                    `<span>filenName: ${file.fileName} </span>` +
                    `<span>fileSize: ${file.fileSize} </span>` +
                    `<button>delete me</button>`
                dom.querySelector('button').onclick = () => {
                    const flyweightObj = createFlyWeightObj(fileType)
                    this.setExternal(id, flyweightObj)
                    flyweightObj._delFile()
                }
                document.body.appendChild(dom)
                cache[id] = {
                    dom,
                    fileType,
                    fileName: file.fileName,
                    fileSize: file.fileSize
                }
            },

            setExternal(id, obj) {
                for (let i in cache[id]) {
                    obj[i] = cache[id][i]
                }
            }
        }
    })()

    function startUp(type, files) {
        files.forEach(file => {
            uploadManager.add(type, file, uid++)
        })
    }

    startUp('flash', [
        {
            name: '1.flash',
            size: 4000
        },
        {
            name: '2.flash',
            size: 1500
        }
    ])

    startUp('plugin', [
        {
            name: '1.plg',
            size: 4000
        },
        {
            name: '2.plg',
            size: 1500
        }
    ])
}

function objectPool() {
    const objectPoolFactory = (fn) => {
        const objs = []

        const create = (src) => {
            let dom = null;
            if (objs.length) {
                dom = objs.shift()
            } else {
                dom = fn.call(this, src)
            }
            dom.src = src
        }

        const recover = (obj) => {
            objs.push(obj)
        }

        return {
            create,
            recover
        }
    }

    const framePoolFactory = objectPoolFactory((src) => {
        const dom = document.createElement('iframe')
        document.body.appendChild(dom)

        dom.onload = () => {
            framePoolFactory.recover(dom)
            dom.onload = null
        }

        return dom
    })

    const dom1 = framePoolFactory.create('https://qq.com')
    const dom2 = framePoolFactory.create('http://4399.com')
    setTimeout(() => {
        const dom3 = framePoolFactory.create('https://baidu.com')
    }, 5000)
}

objectPool()
