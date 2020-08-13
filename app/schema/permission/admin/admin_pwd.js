'use strict';

module.exports = {
  properties: {
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [ 'password' ],
  $async: true, // 同步校验错误
  additionalProperties: true, // 是否可以传多余的值
  errorMessage: {
    required: {
      password: '缺少password',
    },
    properties: {
      password: 'password类型为string；值不能为空',
    },
  },
};
