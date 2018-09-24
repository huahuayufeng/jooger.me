import { GA_TRACK_ID } from '@/config'
import { noop } from '@/utils'

function gtag (...args: any[]) {
  window.dataLayer.push(arguments)
}

export default ({ app }) => {
  if (process.env.NODE_ENV === 'production' && process.client) {
    // Google tag分析脚本
    const script = document.createElement('script')
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACK_ID
    script.async = !0
    const s = document.getElementsByTagName('script')[0]
    if (s.parentNode) s.parentNode.insertBefore(script, s)

    window.dataLayer = window.dataLayer || []
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_TRACK_ID)

    window.onNuxtReady(app => {
      app.$nuxt.$on('routeChanged', (to, from) => {
        gtag('event', 'page_view', {
          send_to: GA_TRACK_ID
        })
      })
    })
  } else {
    window.gtag = noop
  }
}