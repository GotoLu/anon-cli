#! /usr/bin/env node
let Promise = require('bluebird')
let fs = Promise.promisifyAll(require('fs-extra'))

let program = require('commander')
let chalk = require('chalk')
// 取得包版本号
let _v = require('../package.json').version;

program
.version(_v)
.usage('anon-cli name')
.parse(process.argv)

// 获取templates在全局下的路径
let tem = __dirname.replace('\\bin', '') + '\\templates';
// 拿到命令行输入的参数
let newPath = program.args[0];
function generator(dest) {
  // 最核心，拷贝到目标文件夹中
  return fs.copyAsync(tem, dest, {clobber: true})
    .then(() => {
      console.log(`success!\n`)
    })
    .catch(err => console.log(chalk.red(`cd ${err}`)))
}

generator(newPath);