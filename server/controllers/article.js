/**
 * @desc Article controller
 * @author Jooger <zzy1198258955@163.com>
 * @date 19 Sep 2017
 */

import config from '../../config'
import { fetcher, handleRequest, handleSuccess, handleError, marked } from '../utils'

const mdImageReg = /^!\[((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/

const articleCtrl = { list: {}, item: {}, like: {} }

const { owner, repo, clientId, clientSecret } = config.common.github

articleCtrl.list.GET = async (ctx, next) => {
  const { page = 1, per_page = 12, search = '', labels = '' } = ctx.query
  let res = null
  if (search) {
    const q = `${search} type:issue is:public state:open in:title,body author:${owner} repo:${owner}/${repo}`
    res = await fetcher.get('/search/issues', {
      params: {
        q,
        sort: 'created',
        order: 'asc',
        client_id: clientId,
        client_secret: clientSecret,
        page,
        per_page
      }
    }).catch(err => handleError({ ctx, err }))

    if (res && res.data) {
      const link = res.headers.link || ''
      let prev = link.includes('rel="prev"')
      let next = link.includes('rel="next"')
      const articles = res.data.items ? res.data.items.map(item => {
        item.body = articleParser(item.body)
        return item
      }) : []
      handleSuccess({
        ctx,
        data: {
          list: articles,
          pagination: { prev, next, page: Number(page), per_page },
          total: res.data.total_count
        }
      })
    }
  } else {
    const params = {
      filter: 'created',
      state: 'open',
      sort: 'created',
      direction: 'desc',
      client_id: clientId,
      client_secret: clientSecret,
      page,
      per_page
    }
    if (labels) {
      params.labels = labels
    }
    res = await fetcher.get(`/repos/${owner}/${repo}/issues`, { params })
      .catch(err => handleError({ ctx, err }))
    if (res && res.data) {
      const link = res.headers.link || ''
      let prev = link.includes('rel="prev"')
      let next = link.includes('rel="next"')
      const articles = res.data.map(item => {
        item.body = articleParser(item.body)
        return item
      })
      // ctx.response.set('Accept', 'application/vnd.github.squirrel-girl-preview')
      handleSuccess({
        ctx,
        data: {
          list: articles,
          pagination: { prev, next, page: Number(page), per_page }
        }
      })
    }
  }

  if (!res) {
    handleError({ ctx })
  }
}

articleCtrl.item.GET = async (ctx, next) => {
  const number = ctx.params.number
  const res = await fetcher.get(`/repos/${owner}/${repo}/issues/${number}`, {
    headers: {
      Accept: 'application/vnd.github.squirrel-girl-preview'
    },
    params: {
      client_id: clientId,
      client_secret: clientSecret
    }
  }).catch(err => handleError({ ctx, err }))
  if (res && res.data) {
    const detail = res.data
    detail.body = articleParser(detail.body)
    handleSuccess({
      ctx,
      data: detail
    })
  } else {
    handleError({ ctx })
  }
}

articleCtrl.like.GET = async (ctx, next) => {
  const number = ctx.params.number
  const res = await fetcher.get(`/repos/${owner}/${repo}/issues/${number}/reactions`, {
    headers: {
      Accept: 'application/vnd.github.squirrel-girl-preview'
    },
    params: {
      content: 'heart',
      per_page: 99999,
      client_id: clientId,
      client_secret: clientSecret
    }
  }).catch(err => handleError({ ctx, err }))

  if (res && res.data) {
    handleSuccess({
      ctx,
      data: {
        list: res.data,
        isLiked: !!res.data.find(item => item.user.login === owner)
      }
    })
  } else {
    handleError({ ctx })
  }
}

articleCtrl.like.POST = async (ctx, next) => {
  const number = ctx.params.number
  const res = await fetcher.post(
    `/repos/${owner}/${repo}/issues/${number}/reactions`,
    {
      content: 'heart',
      client_id: clientId,
      client_secret: clientSecret
    },
    {
      headers: {
        Accept: 'application/vnd.github.squirrel-girl-preview'
      },
      params: {
        client_id: clientId,
        client_secret: clientSecret
      }
    }
  ).catch(err => handleError({ ctx, err }))

  if (res && res.data) {
    handleSuccess({ ctx })
  } else {
    handleError({ ctx })
  }
}

function articleParser (content) {
  const data = {}
  const splits = content.split('\r\n')
  const thumb = splits[0]
  let cap = mdImageReg.exec(thumb)
  if (cap) {
    data.thumb = cap[2]
  }
  data.content = marked(content)
  return data
}

export default {
  list: async (ctx, next) => {
    await handleRequest({ ctx, next, type: articleCtrl.list })
  },
  item: async (ctx, next) => {
    await handleRequest({ ctx, next, type: articleCtrl.item })
  },
  like: async (ctx, next) => {
    await handleRequest({ ctx, next, type: articleCtrl.like })
  }
}
