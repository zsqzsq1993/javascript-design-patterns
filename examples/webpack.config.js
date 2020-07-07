const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

module.exports = {
    mode: 'development',

    entry: fs.readdirSync(__dirname).reduce((entries, file) => {
        const fullpath = path.resolve(__dirname, file)
        const entry = path.resolve(fullpath, 'app.js')
        if (fs.statSync(fullpath).isDirectory() && fs.existsSync(entry)) {
            entries[file] = entry
        }
        return entries
    },{}),

    output: {
        path: path.resolve(__dirname, '__build__'),
        filename: '[name].js',
        publicPath: '/__build__/'
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
