import { isBrowser } from '@weaverse/react'
let initialized = false
export function initUploadCareAdaptiveDelivery(baseUrl: string) {
  try {
    Promise.resolve().then(() => {
      if (!initialized && isBrowser && !window.Blinkloader) {
        initialized = true
        ;(function (src, cb) {
          let s = document.createElement('script')
          s.setAttribute('src', src)
          s.onload = cb
          ;(document.head || document.body).appendChild(s)
        })(baseUrl + '/static/blinkloader.min.js', function () {
          window.Blinkloader.optimize({
            pubkey: '1a22133d1a1bdc089d4c',
          })
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
}
