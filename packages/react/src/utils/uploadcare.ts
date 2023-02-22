import { isBrowser } from '@weaverse/core'

export function initUploadCareAdaptiveDelivery(baseUrl: string) {
  try {
    Promise.resolve().then(() => {
      if (isBrowser && !window.Blinkloader) {
        ;(function (src, cb) {
          let s = document.createElement('script')
          s.setAttribute('src', src)
          s.onload = cb
          ;(document.head || document.body).appendChild(s)
        })(baseUrl + '/static/blinkloader.min.js', function () {
          window.Blinkloader.optimize({
            pubkey: '1a22133d1a1bdc089d4c',
            fadeIn: true,
            lazyload: true,
            smartCompression: true,
            responsive: true,
            retina: true,
            webp: true,
          })
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
}
