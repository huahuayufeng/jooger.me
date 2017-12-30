/**
 * @desc 文章数据
 * @author Jooger <iamjooger@gmail.com>
 * @date 27 Dec 2017
 */

'use strict'

import { api } from '@/services'

const FETCH_LIST_REQUEST = 'FETCH_LIST_REQUEST'
const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE'
const FETCH_HOT_REQUEST = 'FETCH_HOT_REQUEST'
const FETCH_HOT_SUCCESS = 'FETCH_HOT_SUCCESS'
const FETCH_HOT_FAILURE = 'FETCH_HOT_FAILURE'
const FETCH_DETAIL_REQUEST = 'FETCH_DETAIL_REQUEST'
const FETCH_DETAIL_SUCCESS = 'FETCH_DETAIL_SUCCESS'
const FETCH_DETAIL_FAILURE = 'FETCH_DETAIL_FAILURE'
const CLEAR_DETAIL = 'CLEAR_DETAIL'
const FETCH_LIKES_SUCCESS = 'FETCH_LIKES_SUCCESS'
const LIKE_REQUEST = 'LIKE_REQUEST'
const LIKE_SUCCESS = 'LIKE_SUCCESS'
const LIKE_FAILURE = 'LIKE_FAILURE'
const COMMENT_SUCCESS = 'COMMENT_SUCCESS'

export const state = () => ({
  list: {
    fetching: false,
    data: [],
    pagination: {}
  },
  detail: {
    fetching: false,
    liking: false,
    data: null
  },
  hot: {
    fetching: false,
    data: []
  }
})

export const getters = {
  list: state => state.list.data,
  listFetching: state => state.list.fetching,
  pagination: state => state.list.pagination,
  detail: state => state.detail.data,
  detailFetching: state => state.detail.fetching,
  detailLiking: state => state.detail.liking,
  hot: state => state.hot.data,
  hotFetching: state => state.hot.fetching
}

export const mutations = {
  [FETCH_LIST_REQUEST]: state => (state.list.fetching = true),
  [FETCH_LIST_FAILURE]: state => (state.list.fetching = false),
  [FETCH_LIST_SUCCESS]: (state, { list, pagination }) => {
    state.list.fetching = false
    state.list.data = list
    state.list.pagination = pagination
  },
  [FETCH_HOT_REQUEST]: state => (state.hot.fetching = true),
  [FETCH_HOT_FAILURE]: state => (state.hot.fetching = false),
  [FETCH_HOT_SUCCESS]: (state, { list }) => {
    state.hot.fetching = false
    state.hot.data = list
  },
  [FETCH_DETAIL_REQUEST]: state => (state.detail.fetching = true),
  [FETCH_DETAIL_FAILURE]: state => (state.detail.fetching = false),
  [FETCH_DETAIL_SUCCESS]: (state, data) => {
    state.detail.fetching = false
    state.detail.data = data
  },
  [CLEAR_DETAIL]: state => {
    state.detail.fetching = false
    state.detail.liking = false
    state.detail.data = null
    state.detail.likes = []
    state.detail.isLiked = false
  },
  [FETCH_LIKES_SUCCESS]: (state, { list, isLiked }) => {
    state.detail.likes = list
    state.detail.isLiked = isLiked
  },
  [LIKE_REQUEST]: state => (state.detail.liking = true),
  [LIKE_FAILURE]: state => (state.detail.liking = false),
  [LIKE_SUCCESS]: (state, data) => {
    state.detail.liking = false
    state.detail.data.meta.ups++
    const article = state.list.data.find(item => item._id === state.detail.data._id)
    article && article.meta.ups++
  },
  [COMMENT_SUCCESS]: state => {
    state.detail.data.meta.comments++
    const index = state.list.data.findIndex(item => item._id === state.detail.data._id)
    if (index > -1) {
      const item = state.list.data[index]
      state.list.data.splice(index, 1, {
        ...item,
        meta: {
          ...item.meta,
          comments: item.meta.comments + 1
        }
      })
    }
  }
}

export const actions = {
  async fetchList ({ commit, state }, params = {}) {
    if (state.list.fetching) {
      return
    }
    commit(FETCH_LIST_REQUEST)
    const { success, data } = await api.article.fetchList({ params }).catch(err => ((commit(FETCH_LIST_FAILURE, err), {})))
    if (success) {
      commit(FETCH_LIST_SUCCESS, data)
    } else {
      commit(FETCH_LIST_FAILURE)
    }
    return success
  },
  async fetchHotList ({ commit, state }, params = {}) {
    if (state.hot.fetching) {
      return
    }
    commit(FETCH_HOT_REQUEST)
    const { success, data } = await api.article.hot({ params }).catch(err => ((commit(FETCH_HOT_FAILURE, err), {})))
    if (success) {
      commit(FETCH_HOT_SUCCESS, data)
    } else {
      commit(FETCH_HOT_FAILURE)
    }
    return success
  },
  async fetchDetail ({ commit, state }, id) {
    if (state.detail.fetching) {
      return
    }
    commit(FETCH_DETAIL_REQUEST)
    const { success, data } = await api.article.fetchDetail(id)().catch(err => ((commit(FETCH_DETAIL_FAILURE, err), {})))
    if (success) {
      commit(FETCH_DETAIL_SUCCESS, data)
    } else {
      commit(FETCH_DETAIL_FAILURE)
    }
    return success
  },
  async like ({ commit, dispatch, state }, id) {
    if (state.detail.liking) {
      return
    }
    commit(LIKE_REQUEST)
    const { success, data } = await api.article.like(id)().catch(err => ((commit(LIKE_FAILURE, err), {})))
    if (success) {
      commit(LIKE_SUCCESS, data)
      dispatch('app/updateHistory', { articleId: id }, { root: true })
    } else {
      commit(LIKE_FAILURE)
    }
    return success
  }
}
