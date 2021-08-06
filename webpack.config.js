// node的内置模块 path 获取路径用的
const path = require('path')
// 识别html文件 通过plugin插件实现
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Vue Loader 的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports={
  // 入口文件
  // entry:"文件路径",
  entry:"./src/main.js",
  // 输出文件
  output:{
    // 输出的文件夹名称
    // filename:"设置文件的输出路径",
    filename:"bundle.js", // 这里以bundle.js为例
    // 设置输出的文件夹路径
    // dirname 文件根目录 绝对路径
    // 因为webpack中规定我们的路径一定是绝对路径
    path:path.resolve(__dirname,"dist")
  },
  // 设置对应开发或生产
  mode:"development",

  // 配置loader
  module:{
    // 某个格式的文件进行处理
    // 一个rules(规则)就是一个loader
    rules:[
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test:/\.css$/, // 匹配所有.css结尾文件 \.转义字符，转成.
        use:[
          // 解析顺序是从下到上的解析顺序
          // 将js内容插入道style标签中
          "style-loader",
          // 将css文件转化为js
          "css-loader",
        ]
        // 安装loader
        // cnpm install style-loader css-loader --save-dev
      },
      {
        test:/\.(sass|scss)$/,
        use:['style-loader','css-loader','sass-loader']
      },
      // 处理图片中的loader
      { test: /\.(png|svg|jpg|gif)$/,
        use: [
          // ...
          {
            loader: 'url-loader', //是指定使用的loader和loader的配置参数
            options: {
              limit:500,  //是把小于500B的文件打成Base64的格式，写入JS
              name: 'images/[name]_[hash:7].[ext]',
            }
          }
        ]},
      // 安装对应的loader
      // cnpm install html-loader url-loader file-loader --save-dev
      // 然后执行webpack命令
    ]
    // 设置好了webpack.config.js后，在命令行中只需要输入webpack就可以实现打包功能了
  },
  // 配置plugin
  plugins:[
    new HtmlWebpackPlugin({
      // template:'html文件的路径'
      template:'index.html'
    }),
    // Vue Loader 的插件
    new VueLoaderPlugin(),
    // 安装html-webpack-plugin插件
    // cnpm install html-webpack-plugin --save-dev
  ],
  devServer:{
    contentBase:path.resolve(__dirname,'dist'),
    // 启动zip  10m => 5m
    compress:true,

    // host: "0.0.0.0",

    // 端口热更新
    //  port：端口号
    port:3000,
    // 自动打开
    open:true
    // 先全局安装这个 webpack-dev-server 插件
    // cnpm install webpack-dev-server -g
    // 然后通过webpack serve去拉起这个热更新
  }
}
