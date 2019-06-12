/**
 * Created by guoguanrong on 2019/3/19
 * 项目配置详情
 */
const path = require('path')
const conf = require('./config/projectConfig')
module.exports = {
    pages: conf.pages,
    lintOnSave: false,
    // 设置代理，防止本地跨域
    devServer: {
        port: 8080, // 端口号
        // host: 'localhost',
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        // proxy: 'http://localhost:8080'
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译


    // chainWebpack: config => {
    //     const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    //     types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    // },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },

    // 防止 vue 引入swiper4,在有些手机Dom7会有问题
    transpileDependencies: ['swiper', 'dom7'],
    // 编译输出设置 - 支持多项目共用一个域名
    publicPath: './',
    assetsDir: '', // 输出的js、css等文件所在的文件夹
    outputDir: conf.folder || '', // 输出的总文件夹名字 - 域名中的其他项目文件夹

}