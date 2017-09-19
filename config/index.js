/**
 * @desc App Config
 * @author Jooger <zzy1198258955@163.com>
 * @date 19 Sep 2017
 */

// const isProd = process.env.NODE_ENV === 'production'
const baseService = {
  url: '/',
  method: 'get',
  baseURL: '/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  },
  timeout: 120000,
  responseType: 'json'
}

export default {
  common: {
    code: {
      FAILED: -1,
      SUCCESS: 0,
      UNAUTHORIZED: 401
    }
  },
  client: {
    service: Object.assign({}, baseService, {
      baseURL: '/api',
      proxy: {
        host: '127.0.0.1',
        port: process.env.PORT || 3000
      }
    })
  },
  server: {
    service: Object.assign({}, baseService, {
      baseURL: 'https://api.github.com/'
    }),
    github: {
      owner: 'jo0ger',
      repo: 'git-hook-test',
      clientId: 'b4983366c4c7549a09f1',
      clientSecret: '76fd8c26a21659d7eb925af0ed3498eabed49277'
    }
  }
}
