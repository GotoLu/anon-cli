// 默认的远程仓库地址
const DEFAULT_REMOTE_ADDR = 'https://github.com:GotoLu/webpackLearningDemo#master';
// 远程仓库地址校验规则
const REMOTE_ADDR_REGEX = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/;

module.exports = {
  DEFAULT_REMOTE_ADDR,
  REMOTE_ADDR_REGEX
}
