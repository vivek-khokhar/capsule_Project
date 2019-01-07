const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    modules: true,
    sourceMap: true,
    localIdentName: "[local]__[hash:base64:5]"
    //minimize: true
  }
};

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const autoprefixer_ref = new webpack.LoaderOptionsPlugin({
    options: {
        postcss: [
            autoprefixer()
        ]
    }
})

const CSSLoader = {
  loader: "css-loader",
  options: {
    modules: false,
    sourceMap: true
    //minimize: true
  }
};

const modernizr = require("modernizr");

module.exports = {
  entry: ["@babel/polyfill", "./src", "./src/styles/styles.scss"],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ["style-loader", CSSLoader, "sass-loader"]
      },
      {
        test: /\.module\.scss$/,
        use: ["style-loader", CSSModuleLoader, "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },
      {
        loader: "webpack-modernizr-loader",
        options: {
          // Full list of supported options can be found in [config-all.json](https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json).
          options: ["setClasses"],
          "feature-detects": [
            "test/css/flexbox",
            "test/es6/promises",
            "test/css/cssgrid",
            "test/css/all",
            "test/css/animations",
            "test/css/appearance",
            "test/css/backdropfilter",
            "test/css/backgroundblendmode",
            "test/css/backgroundcliptext",
            "test/css/backgroundposition-shorthand",
            "test/css/backgroundposition-xy",
            "test/css/backgroundrepeat",
            "test/css/backgroundsize",
            "test/css/backgroundsizecover",
            "test/css/borderimage",
            "test/css/borderradius",
            "test/css/boxdecorationbreak",
            "test/css/boxshadow",
            "test/css/boxsizing",
            "test/css/calc",
            "test/css/checked",
            "test/css/chunit",
            "test/css/columns",
            "test/css/cssgrid",
            "test/css/cubicbezierrange",
            "test/css/customproperties",
            "test/css/displayrunin",
            "test/css/displaytable",
            "test/css/ellipsis",
            "test/css/escape",
            "test/css/exunit",
            "test/css/filters",
            "test/css/flexbox",
            "test/css/flexboxlegacy",
            "test/css/flexboxtweener",
            "test/css/flexwrap",
            "test/css/fontdisplay",
            "test/css/fontface",
            "test/css/generatedcontent",
            "test/css/gradients",
            "test/css/hairline",
            "test/css/hsla",
            "test/css/hyphens",
            "test/css/invalid",
            "test/css/lastchild",
            "test/css/mask",
            "test/css/mediaqueries",
            "test/css/multiplebgs",
            "test/css/nthchild",
            "test/css/objectfit",
            "test/css/opacity",
            "test/css/overflow-scrolling",
            "test/css/pointerevents",
            "test/css/positionsticky",
            "test/css/pseudoanimations",
            "test/css/pseudotransitions",
            "test/css/reflections",
            "test/css/regions",
            "test/css/remunit",
            "test/css/resize",
            "test/css/rgba",
            "test/css/scrollbars",
            "test/css/scrollsnappoints",
            "test/css/shapes",
            "test/css/siblinggeneral",
            "test/css/subpixelfont",
            "test/css/supports",
            "test/css/target",
            "test/css/textalignlast",
            "test/css/textdecoration",
            "test/css/textshadow",
            "test/css/transforms",
            "test/css/transformslevel2",
            "test/css/transforms3d",
            "test/css/transformstylepreserve3d",
            "test/css/transitions",
            "test/css/userselect",
            "test/css/valid",
            "test/css/variablefonts",
            "test/css/vhunit",
            "test/css/vmaxunit",
            "test/css/vminunit",
            "test/css/vwunit",
            "test/css/will-change",
            "test/css/wrapflow",

            "test/css/array",
            "test/css/date",
            "test/css/function",
            "test/css/object",
            "test/css/specification",
            "test/css/strictmode",
            "test/css/string",
            "test/css/syntax",
            "test/css/undefined",
            "test/css/array",
            "test/css/collections",
            "test/css/contains",
            "test/css/generators",
            "test/css/math",
            "test/css/number",
            "test/css/object",
            "test/css/promises",
            "test/css/string",
            ,
          ]
        },
        test: /empty-alias-file\.js$/
      }
    ]
  },
  plugins: [htmlPlugin, autoprefixer_ref]
};
