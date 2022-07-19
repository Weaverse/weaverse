import type { WeaverseItemStore } from '@weaverse/core'

// make the css data formatted to correct order (desktop, tablet, mobile)
let shortCssObject = (css: { [key: string]: any }) => {
  return {
    '@desktop': css['@desktop'],
    // '@tablet': css[`@tablet`],
    '@mobile': css['@mobile'],
  }
}

export function generateItemClass(
  instance: WeaverseItemStore,
  stitchesInstance: any
) {
  let { css, className: cls = '' } = instance.data
  let className = ''
  if (css) {
    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let formattedCss = shortCssObject(css)
    let { className: newClass = '' } = stitchesInstance.css(formattedCss)()
    let { stitchesClass } = instance
    let otherClass = (instance.ref.current?.className || '')
      .replace(stitchesClass, '')
      .replace(cls, '')
      .trim()
    className = `${cls} ${newClass} ${otherClass}`.trim()
    instance.stitchesClass = newClass
  }
  return className
}
