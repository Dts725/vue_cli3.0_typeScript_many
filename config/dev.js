let wr_json = require("./declare.js")
// 拿到命令行传入参数
let projectName = process.argv[2]
let fs = require('fs')

// 修改tsconfig.json
wr_json.io(projectName);


// 修改文件
fs.writeFileSync('./config/project.js', `exports.name = '${projectName}'`)

let exec = require('child_process').execSync;
exec('npm run serve', {
    stdio: 'inherit'
});