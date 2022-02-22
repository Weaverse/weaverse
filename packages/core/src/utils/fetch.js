function r(m) {
  return m && m.default || m
}

module.exports = globalThis.fetch = globalThis.fetch || (
  typeof process == 'undefined' ? r(require('unfetch')) : (function (url, opts) {
    return r(require('node-fetch'))(String(url).replace(/^\/\//g, 'https://'), opts)
  })
)