const webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var ExtractCss = new ExtractTextPlugin({
    filename: './app/styles/[name].css'
});

var ExtractSass = new ExtractTextPlugin({
    filename: './app/styles/[name].css'
});

// Development mode or production mode?
var devbuild = false;
var args = process.argv;
for (var i = 0; i < args.length; i++) {
    var param = String(args[i]);
    if (param.search('webpack-dev-server') > -1) {
        devbuild = true;
    }
}

// Announce the build type
var app_base_url = '';
if (devbuild) {
    console.log('Development Build...');
    // Web app served from this base URL in localhost
    app_base_url = '/';
} else {
    console.log('Production Build...');
    // Web app served from this base URL in staging/production
    app_base_url = '/'
}

// Declare plugins we use, they vary between development and
// production builds
var plugins = [
    // Ignore moment locales
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Split bundles
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor-[chunkhash].bundle.js',
        minChunks: function(module) {
            return module.context &&
                    module.context.indexOf('node_modules') !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'angular',
        filename: 'angular-[chunkhash].bundle.js',
        minChunks: function(module) {
            return module.context && module.context.indexOf('angular') !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        filename: 'manifest-[chunkhash].bundle.js'
    }),
    // Create index.html
    new HtmlWebpackPlugin({
        template: 'app/index.template.html',
        inject: 'body',
        favicon: 'app/assets/img/favicon.png',
        // Base tag configuration.  For local development environments
        // we assume the site is hosted on /, for staging and production
        // the app is served from /
        base_url: app_base_url
    }),
    // Resolve some tricky names
    new webpack.ProvidePlugin({
        'moment': 'moment',
        'humanizeDuration': 'humanize-duration'
    }),
    new webpack.DefinePlugin({
        // Add a global constant "NO_CACHE" which is just a timestamp
        // We don't currently use this, but it's there if we need it.
        NO_CACHE: JSON.stringify(Date.now()),
        // Set global constant used elsewhere in the app
        DEBUG_BUILD: devbuild,
        // The various hosts and API endpoints
        STAGING_HOST: JSON.stringify(''),
        STAGING_API: JSON.stringify(''),
        LOCAL_API: JSON.stringify('http://localhost:8000')
    }),
    ExtractCss,
    ExtractSass
]
if (!devbuild) {
    // Production plugins
    plugins.push(
        // clean dist directory
        new CleanWebpackPlugin(['dist'], {
            verbose: true,
            dry: false
        }),
        // uglify
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            },
            output: {
                comments: false
            },
            sourceMap: false,
            debug: false,
            minimize: true,
            mangle: true
        })
    )
}

// Generate source map for development builds
var sourcemap = '';
if (devbuild) {
    sourcemap = 'source-map';
}

module.exports = {
    entry: {
        app: './app/app.js'
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: (path.resolve(__dirname, './dist'))
    },
    plugins: plugins,
    devtool: sourcemap,
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
        {
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jscs-loader',
            options: {
                emitErrors: true,
                failOnHint: true
            }
        }, {
            test: /\.css$/,
            // use: ['style-loader', 'css-loader'],
            use: ExtractCss.extract({
                use: [{
                    loader: 'css-loader'
                }]
            })
        }, {
            test: /\.scss$/,
            use: ExtractSass.extract({
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }]
            })
        }, {
            test: /\.html$/,
            exclude: /index\.template\.html$/,
            loader: 'ngtemplate-loader?relativeTo=' + (path.resolve(
                    __dirname, './app')) + '/!html-loader?root=' +
                path.resolve(__dirname, './app/assets')
        }, {
            test: /\.gif$/,
            loader: 'file-loader'
        },{
            test: /(\.eot$|\.woff$|\.woff2$|\.svg$|\.ttf$)/,
            use: 'url-loader'
        }, {
            test: /\.png$/,
            loader: 'file-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'ng-annotate-loader'
        },]
    }
}
