var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	mode :"development",//模式设置
	devtool : "eval-source-map",//调试工具配置 根据不同需求来处理 这个东西影响打包速度 使调试更容易
	entry : __dirname + "/app/index.js",//__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
	output: {
		path : __dirname +"/dist",//path.resolve(__dirname, 'dist'),自动去创建个dist文件目录
		filename: "bundle.js"//定义输出的文件名也可自动生成哈希 [name]占位符
	},
	module : {
		rules :[
			{
				test:/\.css$/,//匹配loader的后缀的正则
				use : [
					{
						loader :"style-loader"
					},{
						loader :"css-loader"
					}
				]
			}
		]
	},
	//开发服务器配置  //"server": "webpack-dev-server --open"
	devServer : {
		//host:"127.0.0.1",
		contentBase : "./public",//文件提供本地服务器目录
		port :"8089",
		inline :true,//自动更新
		historyApiFallback :true
	},
	plugins : [
		new htmlWebpackPlugin({template : __dirname + "/app/index.temp.html"})
	]
}
