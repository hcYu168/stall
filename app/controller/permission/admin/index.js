'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async loginRequired() {
    this.ctx.body = { code: 200, data: 'loginRequired' };
  }
  async groupRequired() {
    this.ctx.body = { code: 200, data: 'groupRequired' };
  }
}

module.exports = IndexController;
