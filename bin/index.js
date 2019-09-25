#! /usr/bin/env node
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const download = require('download-git-repo'); // 下载远程模板
const inquirer = require('inquirer'); // 和用户交互
const handlebars = require('handlebars'); // 模板引擎
const ora = require('ora');
const logSymbols = require('log-symbols');
const program = require('commander');
const chalk = require('chalk');

const CONSTANTS = require('../config/constans');
const util = require('../utils');

// 取得包版本号
const _v = util.getVersion();
// 与用户交互的列表
const genInteractiveList = defaultObj => [{
  type: 'input',
  name: 'projName', // answer中的key
  message: '请输出项目名称: ',
  default: defaultObj.projName
}, {
  type: 'confirm',
  name: 'useRemote',
  message: '是否使用远程模板',
  default: true // 默认使用远程模板
}, {
  type: 'input',
  name: 'remoteUrl',
  message: '请输入远程模板地址',
  default: CONSTANTS.DEFAULT_REMOTE_ADDR,
  when: answers => answers.useRemote
}];

// 处理用户交互数据
const dealAnswers = (answers) => {
  // 项目名称
  const projName = answers.projName;
  const projExists = fs.pathExistsSync(projName);
  // 判断该目录下是否存在相同名称的项目
  if (projExists) {
    console.log(logSymbols.error, chalk.red(`存在同名项目${projName}！`));
    return;
  }
  let { useRemote, remoteUrl } = answers;
  // 是否使用远程模板
  if (useRemote && remoteUrl) {
    // 远程仓库地址校验
    const match = CONSTANTS.REMOTE_ADDR_REGEX.exec(remoteUrl);
    if (!match) {
      console.log(logSymbols.error, chalk.red('远程仓库地址格式不对！'));
      return;
    }
    // 定义提示文案，左侧有个小logo在转
    const spinner = ora(`正在下载远程模板...`);
    // 开始展示
    spinner.start();
    // 防止download出现异常spinner无法关闭
    try {
      // 下载远程模板
      download(remoteUrl, projName, { clone: true }, err => {
        if (err) {
          spinner.fail();
          console.log(logSymbols.error, chalk.red(err));
          return;
        }
        // 提示文案小logo变成✅
        spinner.succeed();
        console.log(logSymbols.success, chalk.green('远程模板已下载完成'));
      });
    } catch (e) {
      console.log(logSymbols.error, 'Error: ', e.message);
      console.log(logSymbols.error, 'trace stack: ', e.stack);
      spinner.fail();
    }
  } else {
    // 获取templates在全局下的路径
    let tem = path.join(__dirname, '../templates');
    const spinner = ora(`正在复制本地模板[${tem}]...`);
    // 拿到命令行输入的参数
    let newPath = projName;
    function generator(dest) {
      // 最核心，拷贝到目标文件夹中
      return fs.copyAsync(tem, dest, {clobber: true})
        .then(() => {
          spinner.succeed();
          console.log(logSymbols.success, chalk.green('本地模板已完成复制'));
        })
        .catch(err => {
          spinner.fail();
          console.log(logSymbols.error, chalk.red(`cd ${err}`));
        })
    }
    spinner.start();
    generator(newPath);
  }
};

const init = () => {
  program
    .version(_v, '-v, --version', 'output current version')
    .usage('init name')
    .command('init <projName>') // 定义初始化命令
    .description('init project')
    .action((projName) => { // 执行命令后的回调
      // 开始和用户交互
      inquirer.prompt(genInteractiveList({ projName })).then(util.dealCatch(dealAnswers));
    });
  program.parse(process.argv);
}

// 初始化入口
init();
