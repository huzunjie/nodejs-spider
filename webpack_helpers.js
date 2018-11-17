const _fs = require("fs");
const _path = require('path');

const utils = {

  //  查找编译入口文件，用以生成entry配置
  getEntry(path, _depth=0){
    const entrys = {};
    if(_fs.existsSync(path)){
      const isFile = _fs.statSync(path).isFile();
      if(isFile){
        const fileInfo = _path.parse(path);
        // tpls 目录下 .js 后缀的文件当做webpack编译入口，jsx 和react组件建议放在子目录里
        if(fileInfo.ext === '.js'){
          const controller = fileInfo.dir.split(_path.sep).slice(-1)[0];
          const entry_name = fileInfo.name;
          entrys[controller+'_'+entry_name] = path;
        }
      }else{
        // 遍历所有文件和子目录，深度限制在 tpls 子目录这一层
        if(_depth < 2){
          _fs.readdirSync(path).map(fname=>{
            const _entrys = utils.getEntry(_path.join(path, fname), _depth+1);
            Object.assign(entrys, _entrys);
          });
        }
      }
    }
    return entrys;
  },

  // 获取当前进程命令行参数转为JSON
  getProcessArgs(){
    const process_args = {};
    let _key = null;
    process.argv.forEach(str=>{
      if(/^--(.*)$/.test(str)){
        _key = RegExp.$1;
      }else if(_key){
        process_args[_key] = str;
        _key = null;
      }
    });
    return process_args;
  }

};

module.exports = utils;
