let program = require('commander')

const version = require('./package').version; // 获取package中的版本号
program
    .version(version, '-v, --version', 'output current version') // 版本号
    .usage('init name') // 使用说明
    .command('init <projName>') // 定义初始化命令
    .description('init project') // description 也可以作为command的第二个参数传入
    .option('-r, --remote', 'use remote templates') // 传入的选项，第二个参数是描述(最好是在command后面定义，使用方法[命令] init proj -r xxx)
    .action((projName, options) => { // 执行命令后的回调
        console.log(projName);
        console.log(options.remote);
    })
program.parse(process.argv) // 最后必须加上参数的解析(不能链式调用，且必须放在最后)，不然命令无法使用
