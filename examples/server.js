const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config.js')
const middleware = require('webpack-dev-middleware')

const compiler = webpack(config)
const app = express()
const port = process.env.PORT || 8082
app.use(middleware(compiler, {
    publicPath: '/__build__/',
    stats: {
        color: true,
        chunk: false
    }
}))

app.use(express.static(__dirname))
app.listen(port, () => {
    console.log('Service at http://localhost:8082')
})
