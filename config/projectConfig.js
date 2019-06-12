/**
 * Created by guoguanrong on 2019/3/19.
 */

const projectName = require('./project')

const config = {
  //项目A
  projectA: {
    pages: {
      index: {
        entry: 'src/projects/projectA/main.ts',
        template: 'public/index.html',
        filename: 'index.html',
      }
    },
    folder: 'projectA'
  },
// 项目B
  projectB: {
    pages: {
      index: {
        entry: 'src/projects/projectB/main.ts',
        template: 'public/index.html',
        filename: 'index.html',
      }
    },
    folder: 'projectB',
  },

}

const configObj = config[projectName.name]
module.exports = configObj