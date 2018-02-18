var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var _ = require('underscore');
var copyFiles = [
    {
        from: './node_modules/angular-material/angular-material.min.css',
        to: 'css/angular-material.min.css'
    },
    {
        from: './node_modules/socket.io-client/dist/socket.io.js',
        to: 'js/socket.io.js'
    },
    {
        from: './node_modules/socket.io-client/dist/socket.io.js.map',
        to: 'js/socket.io.js.map'
    },
    {
        from: './web3.min.js',
        to: 'js/web3.min.js'
    },
    {
        from: './web/templates/index.html',
        to: 'index.html'
    },
    {
        from: './web/views',
        to: 'views'
    },
    {
        from: './web/assets',
        to: 'assets'
    }
];
var config = {
    entry: {
        app: path.resolve(__dirname, './web/js/index.js'),
        vendors: [
            'angular',
            'angular-route',
            'angular-animate',
            'angular-aria',
            'angular-messages',
            'angular-material',
            'angular-sanitize',
            'angular-material-icons'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/bundle.js'
    },
    resolve: {
        alias: {
            code: path.resolve(__dirname, './web/js')
        }
    },
    module: {
        noParse: []
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'js/vendors.js' }),
        new CopyWebpackPlugin(copyFiles)
    ],
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: true,
        port: 8000
    }
};
var deps = [
    './node_modules/angular/angular.min.js',
    './node_modules/angular-route/angular-route.min.js',
    './node_modules/angular-animate/angular-animate.min.js',
    './node_modules/angular-aria/angular-aria.min.js',
    './node_modules/angular-messages/angular-messages.min.js',
    './node_modules/angular-material/angular-material.min.js',
    './node_modules/angular-sanitize/angular-sanitize.min.js',
    './node_modules/angular-material-icons/angular-material-icons.min.js'
];
_.each(deps, function (i) {
    var pt = path.resolve(__dirname, i);
    config.resolve.alias[i.split(path.sep)[1]] = pt;
    config.module.noParse.push(pt);
});
module.exports = config;