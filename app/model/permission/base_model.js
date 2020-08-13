'use strict';

const moment = require('moment');

const BaseModel = {
  createdAt: 'create_time',
  updatedAt: 'update_time',
  deletedAt: 'delete_time',
  timestamps: true,
  paranoid: true,
  getterMethods: {
    create_time() {
      return moment(this.getDataValue('create_time')).unix();
    },
    update_time() {
      return moment(this.getDataValue('update_time')).unix();
    },
  },
};

module.exports = { BaseModel };
