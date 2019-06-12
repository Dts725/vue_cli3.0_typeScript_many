// 下面这行代码
// 拿到命令行里参数，比如执行（npm run b projectA）,这个时候projectName就等于projectA
// 有了这个变量，就可以根据这个名字来读取projectConfig里面的配置了
let projectName = process.argv[2]
// 下面两行代码 获取projectName后把保存起来，写入到project.js里，方便其它js文件里引入使用
let fs = require('fs')
fs.writeFileSync('./config/project.js', `exports.name = '${projectName}'`)
// 下面两行代码继续执行命令（npm run build），执行默认命令开始进行打包
let exec = require('child_process').execSync;
exec('npm run build', { stdio: 'inherit' });