# Project Setup Cheatsheet with comments

## package.json

```json
{
	"name": "project-setup",
	"version": "1.0.0",
	"description": "Basic setup with comments",
	// entry point
	"main": "index.js",
	// private so that it doesn't get published
	"private": "true",
	// serve assets relative to the location of index.html
	// if not defined, wrong urls will be generated in files on build
	"homepage": ".",
	"scripts": {
		// --config flag to use a specified config file
		"build": "webpack --config webpack.prod.js",
		// serve - use webpack-dev-server
		"start": "webpack serve --config webpack.dev.js",
		"test": "jest",
		// build and deploy to gh-pages
		"deploy": "gh-pages -d build"
	},
	"author": "Elena Kashtanova",
	"license": "ISC",
	"devDependencies": {
		// @babel/core and @babel/preset-env are required for using Babel
		"@babel/core": "^7.13.8",
		"@babel/preset-env": "^7.13.8",
		// preset with plugins necessary for running with React
		"@babel/preset-react": "^7.12.13",
		// @testing-library/jest-dom library provides a set of custom jest matchers
		"@testing-library/jest-dom": "^5.11.9",
		// a library for testing react components
		// works with DOM nodes, not rendered instances
		// replacement for Enzyme
		"@testing-library/react": "^11.2.5",
		// a recommended library for simulating events
		"@testing-library/user-event": "^12.7.3",
		// for testing
		"babel-jest": "^26.6.3",
		// for webpack
		"babel-loader": "^8.2.2",
		// clean up old build files
		"clean-webpack-plugin": "^3.0.0",
		// Loaders are transformations that are applied to the source code of a module
		// They allow you to pre-process files as you import or “load” them
		"css-loader": "^5.1.0",
		"css-minimizer-webpack-plugin": "^1.2.0",
		"eslint": "^7.21.0",
		// airbnb style guide config for eslint
		// Installed with eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks,
		// and eslint-plugin-jsx-a11y
		"eslint-config-airbnb": "^18.2.1",
		// disable conflicting rules
		"eslint-config-prettier": "^8.1.0",
		"eslint-plugin-import": "^2.22.1",
		// plugins for recommended testing rules
		"eslint-plugin-jest": "^24.1.5",
		"eslint-plugin-jest-dom": "^3.6.5",
		"eslint-plugin-jsx-a11y": "^6.4.1",
		"eslint-plugin-prettier": "^3.3.1",
		"eslint-plugin-react": "^7.22.0",
		"eslint-plugin-react-hooks": "^4.2.0",
		"eslint-plugin-testing-library": "^3.10.1",
		// let webpack know that eslint will be used in build process
		"eslint-webpack-plugin": "^2.5.2",
		// allows use custom html template
		"html-webpack-plugin": "^5.2.0",
		"jest": "^26.6.3",
		// extracts css into separate files
		"mini-css-extract-plugin": "^1.3.9",
		"prettier": "^2.2.1",
		// inject css into the dom (for dev mode)
		"style-loader": "^2.0.0",
		// minifies JS. No need to install when used with webpack 5 but ESLint throws an error
		"terser-webpack-plugin": "^5.1.1",
		"webpack": "^5.24.2",
		"webpack-cli": "^4.5.0",
		// use dev-server for demos while working
		"webpack-dev-server": "^3.11.2",
		// merge separate webpack config files
		"webpack-merge": "^5.7.3"
	},
	"dependencies": {
		"gh-pages": "^3.1.0",
		"react": "^17.0.1",
		"react-app-polyfill": "^2.0.0",
		"react-dom": "^17.0.1"
	},
	// targer browsers
	"browserslist": {
		"production": [">0.2%", "not dead", "not op_mini all"],
		"development": [
			"last 1 chrome version",
			"last 1 firefox version",
			"last 1 safari version",
			"ie 11"
		]
	},
	"jest": {
		// configure jest-dom after jest is installed
		"setupFilesAfterEnv": ["@testing-library/jest-dom/extend-expect"],
		// extensions used in modules
		"moduleFileExtensions": ["js", "jsx"],
		// user mocks for imported assets
		"moduleNameMapper": {
			"\\.css$": "<rootDir>/__mocks__/styleMock.js",
			"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
		}
	}
}
```

## babel.config.js

```javascript
module.exports = {
	// presets contain common bundles of plugins
	presets: [
		// bundles of plugins to transpile ES6 features and React features
		'@babel/preset-env',
		[
			// @babel/preset-react is also required for testing
			'@babel/preset-react',
			{
				// import of React is not required for functional components
				runtime: 'automatic',
			},
		],
	],
};
```

## Testing - Jest + react-testing-library

### \_\_mocks\_\_ folder

The folder in root directory where mock files for styles and assets are stored.

styleMock.js

```javascript
module.exports = {};
```

fileMock.js

```javascript
module.exports = 'test-file-stub';
```

## Webpack Config

### webpack.common.js

```javascript
// plugin for working correctly with ESLint
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
	// where webpack looks to start building the bundle. Same for prod and dev
	entry: './src/index.js',
	plugins: [new ESLintPlugin()],
	module: {
		rules: [
			{
				// use babel-loader to transpile js/jsx files while excluding node_modules
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				// asset/resource emits a separate file and exports the URL
				// Previously achievable by using file-loader
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					// export into images folder
					filename: 'images/[name]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					// export into fonts/
					filename: 'fonts/[name]',
				},
			},
		],
	},
	resolve: {
		// include jsx in resolved extensions
		extensions: ['*', '.js', '.jsx'],
	},
};
```

### webpack.prod.js

```javascript
const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

// merge common file with the current config
module.exports = merge(common, {
	// the app is built in production mode
	// providing the mode configuration option tells webpack to use its built-in optimizations accordingly
	mode: 'production',
	// A full SourceMap is emitted as a separate file
	// It adds a reference comment to the bundle so development tools know where to find it.
	devtool: 'source-map',
	output: {
		// outputs files using entry name and generated hash
		filename: '[name].[contenthash].js',
		// output to build folder
		path: path.resolve(__dirname, 'build'),
		// empty string - paths resolved relative to HTML page
		publicPath: '',
	},
	optimization: {
		minimizer: [
			new CssMinimizerWebpackPlugin(),
			// plugin for minifying JS. No need to install - comes with webpack 5
			new TerserPlugin(),
			// use a minified custom html template
			new HtmlWebpackPlugin({
				template: './src/index.html',
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true,
				},
			}),
		],
	},
	plugins: [
		// plugin for cleaning build folder
		new CleanWebpackPlugin(),
		// create a CSS file per JS file which contains CSS
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					// css-loader interprets @import and url() like import/require() and will resolve them
					'css-loader',
				],
			},
		],
	},
});
```

### webpack.dev.js

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	// providing the mode configuration option tells webpack to use its built-in optimizations accordingly
	mode: 'development',
	// each module is executed with eval()
	// doesn't have column mappings, it only maps line numbers
	devtool: 'eval-cheap-source-map',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		// serve command opens the app in a new tab
		open: true,
	},
	plugins: [
		// use custom html template
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				// style-loader adds exports of a module as style to DO
				use: ['style-loader', 'css-loader'],
			},
		],
	},
});
```

## .eslintrc.json

Using JSON format allows safely use Prettier with enabled singleQuote rule.

```json
{
	// environment provides predefined global variables
	"env": {
		"browser": true,
		"es2021": true,
		// non-undef error if node isn't true
		"node": true,
		// set "jest" to true to recognize test() and it()
		"jest": true
	},
	"extends": [
		// plugins that extend base eslint configuration
		// 'eslint-config-' in plugin names may be omitted
		// eslint:recommended enables a subset of core rules that report common problems
		"eslint:recommended",
		// add airbnb style guide rules
		"airbnb",
		// recommended testing configurations
		"plugin:jest/recommended",
		"plugin:jest-dom/recommended",
		"plugin:testing-library/recommended",
		// add react specific rules
		"plugin:react/recommended",
		// prettier plugin is defined last and overrides conflicting rules
		// specifying plugin:prettier/recommended is equivalent to specifying prettier in 'extends'
		// and 'plugins' and putting 'prettier/prettier': ['error'] in the rules
		"plugin:prettier/recommended"
	],
	"parserOptions": {
		// ecmaFeatures - an object indicating which additional language features
		"ecmaFeatures": {
			// enable jsx
			"jsx": true
		},
		// use the latest version of ECMAScript syntax
		"ecmaVersion": 12,
		// enable use of modules
		"sourceType": "module"
	},
	// plugins can expose additional rules for use in ESLint by exporting a 'rules' object
	// no need to import plugins if a recommended config is used without changes
	"plugins": [
		// eslint-plugin- prefix can be omitted for non-scoped packages
		"react"
	],
	"rules": {
		// react import in function components isn't required
		"react/react-in-jsx-scope": "off",
		// allow jsx in .js files
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		// allow import of devDependencies - if not set, errors in webpack config files occur
		"import/no-extraneous-dependencies": [
			"error",
			{ "devDependencies": true }
		],
		// prettier rules can be defined here as well as in a separate config files
		"prettier/prettier": [
			"error",
			{
				// "endOfLine": "auto" - no errors on different OS
				"endOfLine": "auto",
				"useTabs": true,
				"tabWidth": 4,
				"singleQuote": true,
				"trailingComma": "all"
			}
		]
	}
}
```
