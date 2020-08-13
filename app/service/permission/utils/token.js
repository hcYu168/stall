'use strict';

const Service = require('egg').Service;

const moment = require('moment');

class TokenService extends Service {
  /**
   * 验证并获取redis保存数据
   * @param {String} token 登录凭证
   * @return {Object} redis保存的数据
   */
  async validate(token) {
    const { app, ctx } = this;
    // 校验token
    const decoded = await this.verifyToken(token);
    if (!decoded) ctx.throwBizError(4105, '授权过期');

    // 获取token缓存信息
    const infoStr = await app.redis.get('default').hget(decoded.prefix, decoded.id);
    if (!infoStr) ctx.throwBizError(4105, '授权过期');
    // 反序列化json
    const info = JSON.parse(infoStr);
    if (info.expired_at <= moment().unix()) ctx.throwBizError(4105, '授权过期');
    return info;
  }

  /**
   * 验证登录凭证是否有效
   * @param {String} token 登录凭证
   * @return {Object} 通过token换取的含有id的对象
   */
  async verifyToken(token) {
    const { app, ctx } = this;
    try {
      return await app.jwt.verify(token, app.config.keys);
    } catch (err) {
      ctx.throwBizError(4105, '授权过期');
    }
  }

  /**
   * 获取token
   * @param {Int} id 获取用户id
   * @param {String} redisPrefix redis前缀键名
   */
  async getToken(id, redisPrefix) {
    const { app, config } = this;
    const prefix = config.redisCache[redisPrefix + 'Prefix'];
    const expireTime = config.redisCache.expireTime;
    const expired_at = moment().add(expireTime, 's').unix();
    const baseInfo = {
      id,
      prefix,
      expired_at,
    };
    const token = await app.jwt.sign(baseInfo, app.config.keys);
    Object.assign(baseInfo, { token });
    await app.redis.get('default').hset(prefix, baseInfo.id, JSON.stringify(baseInfo));
    return token;
  }
}
module.exports = TokenService;
