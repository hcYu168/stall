'use strict';

module.exports = {
  properties: {
    username: {
      type: 'string',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [ 'username', 'password' ],
  $async: true, // 同步校验错误
  additionalProperties: true, // 是否可以传多余的值
  errorMessage: {
    required: {
      username: '缺少username',
      password: '缺少password',
    },
    properties: {
      username: 'username类型为string；值不能为空',
      password: 'password类型为string；值不能为空',
    },
  },
};
