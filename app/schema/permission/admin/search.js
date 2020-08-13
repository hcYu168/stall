'use strict';

module.exports = {
  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },
    sort: {
      type: 'integer',
      minimum: 0,
    },
  },
  required: [ 'title', 'sort' ],
  $async: true, // 同步校验错误
  additionalProperties: true, // 是否可以传多余的值
  errorMessage: {
    required: {
      title: '缺少title',
      sort: '缺少sort',
    },
    properties: {
      title: 'title类型为string；值不能为空',
      sort: 'sort类型为integer，并且大于0',
    },
  },
};
