
// 给函数封一层异常捕获
const dealCatch = (fn) => {
  return (...args) => {
    try {
      fn(...args);
    } catch (e) {
      console.log(logSymbols.error, 'Error: ', e.message);
      console.log(logSymbols.error, 'trace stack: ', e.stack);
    }
  }
};

const getVersion = () => require('../package.json').version;

module.exports = {
  dealCatch,
  getVersion
};
