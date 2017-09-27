/**
 * @desc App Config
 * @author Jooger <zzy1198258955@163.com>
 * @date 27 Sep 2017
 */

'use strict'

const isProd = process.env.NODE_ENV === 'production'

export default {
  service: {
    url: '/',
    method: 'get',
    baseURL: isProd ? 'http://api.jooger.me/api' : 'http://127.0.0.1:3001/api',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json'
    },
    timeout: 120000,
    responseType: 'json'
  }
}