'use strict';
module.exports = {
    // 递归式获取所需属性，不改变原对象
    getAttributes(source, path) {
      if (!path) {
      return source;
      }
      // console.log('source', source);
      const target = {};
      this.ctx.helper.getAttributesHelper(target, source, path);
      //  console.log('target', target);
      return target;
    },

    getAttributesHelper(target, source, path) {
      if (Array.isArray(source)) {
        for (let i = 0; i < source.length; i++) {
          target.push({});
          //  console.log('source1', source[i]);
          this.ctx.helper.getAttributesHelper(target[i], source[i], path);
        }
      } else if (source instanceof Object) {
        if (Array.isArray(path)) {
          for (const each of path) {
            //    console.log('source2', each);
            this.ctx.helper.getAttributesHelper(target, source, each);
          }
        } else if (path instanceof Object) {
          // console.log('2222222222222222');
          for (const attr in path) {
            if (Array.isArray(source[attr])) {
              target[attr] = [];
            } else if (source[attr] instanceof Object) {
              target[attr] = {};
            }
            this.ctx.helper.getAttributesHelper(target[attr], source[attr], path[attr]);
          }
        } else if (typeof path === 'string') {
          //   console.log('444444' ,path);
          //   console.log('333333', source[path]);
          target[path] = source[path];
        } else {
          // TODO use egg log
          // TODO throw error
          console.log('error');
        }
      } else {
        // TODO use egg log
        // TODO throw error
        console.log('error');
      }
    },

    getAttribute(target, source){
      let detailes = {};
      if(Array.isArray(source)){
        for(let i of source){
          detailes[i] = target[i];
        }
      }
      return detailes;
    }
};