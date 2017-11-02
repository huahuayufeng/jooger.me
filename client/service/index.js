/**
 * @desc Api service
 * @author Jooger <zzy1198258955@163.com>
 * @date 8 Sep 2017
 */

import axios from 'axios'
import config from '../config'
import { CommonMessage } from '@/components/Common'

const logMsg = (msg = '') => {
  if (msg) {
    CommonMessage(msg)
  }
}

export const fetcher = axios.create(config.service)

const codeMap = {
  FAILED: -1,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  PARAMS_ERROR: 10001
}

fetcher.interceptors.request.use(config => config, err => Promise.reject(err))

fetcher.interceptors.response.use(async response => {
  if (!response || !response.data) {
    return logMsg('服务器异常')
  }
  switch (response.data.code) {
    case codeMap.UNAUTHORIZED:
    case codeMap.FAILED:
    case codeMap.FORBIDDEN:
    case codeMap.SERVER_ERROR:
    case codeMap.PARAMS_ERROR:
      logMsg(response.data.message)
      break
    case codeMap.SUCCESS:
      if (response.config.method.toLocaleUpperCase() !== 'GET') {
        logMsg(response.data.message)
      }
      break
    default:
      break
  }
  // 如果是GET请求，为了配合PageLoading，这里延迟500毫秒
  if (response.config.method === 'get') {
    await new Promise((resolve) => setTimeout(() => resolve(), 500))
  }
  return response.data
}, error => {
  const status = error.response ? error.response.status : error.code
  const message = error.message ? error.message : `请求错误${status ? `，code:${status}` : ''}`
  logMsg(message)
  return error.response || {
    code: codeMap.FAILED,
    message
  }
})

const wrap = (url, type = 'get') => (config = {}) => fetcher.request({ ...config, method: type, url })

export default {
  article: {
    fetchList: wrap('/articles'),
    fetchDetail: id => wrap(`/articles/${id}`),
    fetchLikes: id => wrap(`/articles/${id}/like`),
    like: id => wrap(`/articles/${id}/like`, 'post')
  },
  user: {
    fetchMe: wrap('/users/me'),
    fetchDetail: id => wrap(`/users/${id}`)
  },
  option: {
    fetchData: wrap('/options')
  },
  music: {
    fetchList: wrap('/music/songs'),
    fetchDetail: id => wrap(`/music/songs/${id}`),
    fetchUrl: id => wrap(`/music/songs/${id}/url`),
    fetchLyric: id => wrap(`/music/songs/${id}/lyric`)
  },
  auth: {
    githubLogin: wrap('/auth/github/login'),
    getInfo: wrap('/auth/info')
  },
  moment: {
    fetchList: wrap('/moments')
  },
  comment: {
    fetchList: wrap('/comments'),
    fetchDetail: id => wrap(`/comments/${id}`),
    create: wrap('/comments', 'post'),
    like: id => wrap(`/comments/${id}/like`, 'post')
  }
}
