import type { WeaverseItemStore } from '@weaverse/core'

// make the css data formatted to correct order (desktop, tablet, mobile)
function shortCssObject(css: { [key: string]: any }) {
  return {
    '@desktop': css['@desktop'],
    // '@tablet': css[`@tablet`],
    '@mobile': css['@mobile'],
  }
}
let permanentClasses: any = {}
export function generateItemClass(
  instance: WeaverseItemStore,
  stitchesInstance: any
) {
  let { css, type, className: cls = '' } = instance.data
  let className = ''
  let permanentClass = ''
  let perCss = instance.Element?.permanentCss
  if (perCss) {
    if (type in permanentClasses) {
      permanentClass = permanentClasses[type]
    } else {
      let { className: perCls } = stitchesInstance.css(perCss)()
      Object.assign(permanentClasses, { [type]: perCls })
      permanentClass = perCls
    }
  }
  className = permanentClass
  if (css) {
    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let formattedCss = shortCssObject(css)
    let { className: newClass = '' } = stitchesInstance.css(formattedCss)()
    let { stitchesClass } = instance
    let otherClass = (instance.ref.current?.className || '')
      .replace(stitchesClass, '')
      .replace(cls, '')
      .replace(permanentClass, '')
      .trim()
    className = `${permanentClass} ${cls} ${newClass} ${otherClass}`.trim()
    instance.stitchesClass = newClass
  }
  return className
}
