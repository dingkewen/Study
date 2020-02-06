let path = require("path");
let webpack = require("webpack");
let htmlPlugin = require("html-webpack-plugin");

module.exports = {
		entry: "./js/main.js",
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "./dist")
		},
		module: {
			rules: [{
					exclude: "/node_modules/",
					test: /\.(css|less)$/,
					use: ["style-loader", "less-loader", {
						loader: "css-loader",
						options: {
							// minimize : true
						}
					}]
				}, {
					exclude: "/node_modules/",
					test: /\.(png|jpe?g|gif|svg)$/i,
					use: ['file-loader', {
							loader: 'image-webpack-loader',
							options: {
								bypassOnDebug: true, // webpack@1.x
								disable: true, // webpack@2.x and newer
							},
							}
						]
					}
					]
			},
			resolve: {
				// root:""
				extensions: ['.js', '.json', '.less', 'vue'],
				alias: {
					src: path.resolve(__dirname, "js")
				}
			},
			devServer: {
				// contentBase: path.join(__dirname, "dist"),
				compress: true,
				port: 9000,
				hot: true
			},
			watchOptions: {
				poll: 1000,
				aggregateTimeout: 500,
				ignored: /node_modules/,
			},
			plugins: [
				new htmlPlugin({
					template: "./index.html",
					filename: "index.html"
				})
			]
		}
