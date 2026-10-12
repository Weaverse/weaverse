import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

let require = createRequire(import.meta.url)
let { registerComponent, WeaverseHydrogen } = require('@weaverse/hydrogen')
let { WeaverseRoot } = require('@weaverse/react')

// Use the renderer's own React pair in the isolated package consumer.
let requireReact = createRequire(import.meta.resolve('@weaverse/react'))
let { createElement } = requireReact('react')
let { renderToStaticMarkup } = requireReact('react-dom/server')

const IMAGE = {
  id: 'shared-file',
  url: '/hero.jpg',
  altText: '{{root.title}}',
  width: 1200,
  height: 800,
  previewSrc: '/preview.jpg',
}

let received = new Map()
registerComponent({
  type: 'main',
  schema: { type: 'main', title: 'Main', settings: [] },
  Component: ({ children }) => createElement('div', null, children),
})
registerComponent({
  type: 'image-probe',
  schema: {
    type: 'image-probe',
    title: 'Image probe',
    settings: [{ group: 'Image', inputs: [{ type: 'image', name: 'image' }] }],
  },
  Component: (props) => {
    received.set(props['data-wv-id'], props.image)
    return null
  },
})

let hero = { ...IMAGE, focalPoint: { x: 0.8, y: 0.3 } }
let card = { ...IMAGE, focalPoint: { x: 0, y: 1 } }
let page = JSON.parse(
  JSON.stringify({
    id: 'page',
    name: 'Page',
    rootId: 'root',
    items: [
      { id: 'root', type: 'main', data: {}, childIds: ['hero', 'card'] },
      { id: 'hero', type: 'image-probe', data: { image: hero } },
      { id: 'card', type: 'image-probe', data: { image: card } },
    ],
  })
)
let weaverse = new WeaverseHydrogen({
  projectId: 'project',
  pageId: 'page',
  data: page,
  internal: {},
  requestInfo: { pathname: '/', search: '', queries: {} },
})
weaverse.dataContext = { root: { title: 'Hero' } }

renderToStaticMarkup(createElement(WeaverseRoot, { context: weaverse }))

assert.deepEqual(Object.fromEntries(received), {
  hero: { ...hero, altText: 'Hero' },
  card: { ...card, altText: 'Hero' },
})

weaverse.itemInstances.get('hero').setData({
  image: { ...IMAGE, focalPoint: { x: 1, y: 0 } },
})
renderToStaticMarkup(createElement(WeaverseRoot, { context: weaverse }))

assert.deepEqual(
  [...received.values()].map((image) => image.focalPoint),
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]
)

// A fresh saved payload without metadata must not retain the edited point.
page.items[1].data.image = IMAGE
weaverse.setProjectData(page)
renderToStaticMarkup(createElement(WeaverseRoot, { context: weaverse }))

assert.deepEqual(Object.fromEntries(received), {
  hero: { ...IMAGE, altText: 'Hero' },
  card: { ...card, altText: 'Hero' },
})
