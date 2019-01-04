const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
        modules: true,
        sourceMap: true,
        localIdentName: '[local]__[hash:base64:5]',
        //minimize: true
    }
}

const CSSLoader = {
    loader: 'css-loader',
    options: {
        modules: false,
        sourceMap: true,
        //minimize: true
    }
}


module.exports = {
    entry: ['@babel/polyfill', './src'],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: ['style-loader', CSSLoader, 'sass-loader']
            },
            {
                test: /\.module\.scss$/,
                use: [
                    'style-loader',
                    CSSModuleLoader,
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                  },
                ],
            }
        ]
    },
    plugins: [htmlPlugin]
};