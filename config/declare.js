var fs = require('fs');

let io = {
    io(params) {

        // 读取配置
        let li = fs.readFileSync('./tsconfig.json', String);
        li = JSON.parse(li);
        let arr = ['src/components/**/*.vue']
        arr.push(`src/projects/${params}/**/*.ts`)
        arr.push(`src/projects/${params}/**/*.tsx`)
        arr.push(`tests/projects/${params}/**/*.vue`)
        arr.push(`tests/projects/${params}/**/*.ts`)
        li.include = arr;
        // 写入修改后的配置
        let str = JSON.stringify(li);
        fs.writeFileSync('./tsconfig.json', str);
    }
}

module.exports = io;