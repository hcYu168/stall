'use strict';

module.exports = {
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    info: {
      type: 'string',
    },
  },
  required: [ 'name' ],
  $async: true, // 同步校验错误
  additionalProperties: true, // 是否可以传多余的值
  errorMessage: {
    required: {
      name: '缺少name',
    },
    properties: {
      name: 'name类型为string；值不能为空',
    },
  },
};
