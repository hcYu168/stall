'use strict';

module.exports = {
  properties: {
    username: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
      minLength: 1,
    },
    phone: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    role_id: {
      type: 'integer',
      minimum: 1,
    },
    status: {
      type: 'integer',
      enum: [ 1, 2 ],
    },
  },
  required: [ 'username', 'name', 'avatar', 'role_id', 'status' ],
  $async: true, // 同步校验错误
  additionalProperties: true, // 是否可以传多余的值
  errorMessage: {
    required: {
      username: '缺少username',
      name: '缺少name',
      avatar: '缺少avatar',
      role_id: '缺少role_id',
      status: '缺少status',
    },
    properties: {
      username: 'username类型为string；值不能为空',
      name: 'name类型为string；值不能为空',
      avatar: 'avatar类型为string；值不能为空',
      phone: 'phone类型为string',
      email: 'email类型为string',
      role_id: 'role_id类型为integer，并且大于0',
      status: 'status类型为integer；值只能为1、2',
    },
  },
};
