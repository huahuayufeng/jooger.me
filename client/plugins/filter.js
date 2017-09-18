/**
 * @desc Vue filters
 * @author Jooger <zzy1198258955@163.com>
 * @date 18 Sep 2017
 */

import Vue from 'vue'
import { fmtDate, fmtDateFromNow } from '~/utils'

/**
 * filter 获取根据规定格式获取time到当前时刻的时间
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
const getDateFromNow = (time = new Date()) => fmtDateFromNow(new Date() - new Date(time))

const filters = {
  fmtDate,
  getDateFromNow
}

Object.keys(filters).forEach(v => Vue.filter(v, filters[v]))
