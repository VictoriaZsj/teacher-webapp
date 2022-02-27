const packageJson = require('./package.json');
const webpack = require('webpack');
const path = require('path');
const appConfig = require('./src/config');
const apiMocker = require('mocker-api');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  // 项目部署的子路径，如应用被部署在 https://p-test.zmlearn.com/my-app，则设置为 /my-app
  publicPath: appConfig.publicPath,

  // 生产构建时禁用
  // lintOnSave: process.env.NODE_ENV !== 'production',
  lintOnSave: false,

  // 是否使用包含运行时编译器的 Vue 构建版本
  // 设置为 true 后就可以在 Vue 组件中使用 template 选项，但是这会让应用额外增加 10kb 左右
  // runtimeCompiler: false,
  // 打包去掉map文件
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true ,
  configureWebpack: {
    entry : "./zm-platform/main.js" ,
    optimization: {
      splitChunks: {
        // all async initial
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          commons: {
            test: /node_modules\\.*\.js/,
            name: 'global',
            chunks: 'all',
          },
          commonCss: {
            test: /src\\assets\\css\\.*\.scss/,
            name: 'global',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
            // 删除console debugger 删除警告
            compress: {
              drop_console: true, // console
              pure_funcs: ['console.log', 'console.dir', 'console.error'], // 移除console
            },
          },
        }),
      ],
    },
    plugins: [
      // 埋点相关配置
      new webpack.DefinePlugin({
        'process.env': {
          APPVERSION: JSON.stringify(packageJson.version),
        },
      }),
      new ManifestPlugin(),
      // 本地打包开启gzip压缩，有助于提高性能
      new CompressionPlugin({
        /* [file]被替换为原始资产文件名。
           [path]替换为原始资产的路径。
           [dir]替换为原始资产的目录。
           [name]被替换为原始资产的文件名。
           [ext]替换为原始资产的扩展名。
           [query]被查询替换。
        */
        filename: '[path].gz[query]',
        // 压缩算法
        algorithm: 'gzip',
        // 匹配文件
        test: /\.js$|\.css$|\.html$/,
        // 压缩超过此大小的文件,以字节为单位
        threshold: 10240,
        // 压缩过后体积减少到80%以下的文件会被压缩
        // minRatio: 0.8,
        // 删除原始文件只保留压缩后的文件
        deleteOriginalAssets: false,
      }),
    ],
    resolve: {
      alias: {
        '@src': path.resolve('src'),
        '@assets': path.resolve('src/assets'),
        '@components': path.resolve('src/components'),
        '@pages': path.resolve('src/pages'),
        '@utils': path.resolve('src/utils'),
        '@config': path.resolve('src/config'),
        '@mixins': path.resolve('src/mixins'),
        '@api': path.resolve('src/api'),
        '@store': path.resolve('src/store'),
        '@router': path.resolve('src/router'),
        '@dicts': path.resolve('src/dicts'),
        '@helper': path.resolve('src/helper'),
        '@directives': path.resolve('src/directives'),
        '@filters': path.resolve('src/filters'),
        'vue$': process.env.NODE_ENV !== 'development'
          ?'vue/dist/vue.common.js'
          :'vue/dist/vue.esm.js',
        'config': path.resolve('src/config'),
        '@': path.resolve('src'),
        'zm-images':path.resolve('src/images'),
        'api': path.resolve('zm-platform/api'),
        'routes': path.resolve('zm-platform/routes'),
        'env': path.resolve('./env')
      },
    },
  },
  devServer: {
    // port: 8080,
    host: 'b.zmlearn.com',
    https: true,
    before(app) {
      apiMocker(app, path.resolve('./mock/index.js'));
    },
    proxy: {
      '/api': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
      '/v1': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
      '/feed': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
      '/dict': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
      '/login': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
      '/logout': {
        target: 'https://p-test.zmlearn.com',
        changeOrigin: true,
      },
    },
  },
};
