import type Stitches from '@stitches/react/types/stitches'
import type { ElementCSS, WeaverseItemStore } from '@weaverse/core'
import clsx from 'clsx'
import type { LinkHTMLAttributes } from 'react'

// Make the css data formatted to correct order (desktop, tablet, mobile)
function formatCSS(css: ElementCSS) {
  return {
    '@desktop': css['@desktop'],
    '@mobile': css['@mobile'],
  }
}

let permanentClasses: Record<string, string> = {}
export function generateItemClassName(
  instance: WeaverseItemStore,
  stitchesInstance: Stitches
) {
  let { css, type, className: cls = '' } = instance.data
  let className = ''
  let permanentClass = ''
  let perCss = instance.Element?.permanentCss
  if (perCss) {
    if (type in permanentClasses) {
      permanentClass = permanentClasses[type]
    } else {
      // @ts-ignore
      let { className: perCls } = stitchesInstance.css(perCss)()
      Object.assign(permanentClasses, { [type]: perCls })
      permanentClass = perCls
    }
  }
  className = permanentClass
  if (css) {
    // let stitches create the style from css object and
    // then return the classname, so we can use it in the render
    let formattedCss = formatCSS(css)
    let newStitchesClass = stitchesInstance.css(formattedCss)().className || ''
    let { stitchesClass } = instance
    let otherClass = (instance.ref.current?.className || '')
      .replace(stitchesClass, '')
      .replace(cls, '')
      .replace(permanentClass, '')
      .trim()
    className = clsx(permanentClass, cls, newStitchesClass, otherClass)
    instance.stitchesClass = newStitchesClass
  }
  return className
}

export function loadCSS(attrs: LinkHTMLAttributes<HTMLLinkElement>) {
  return new Promise((resolve, reject) => {
    let found = document.querySelector(`link[href="${attrs.href}"]`)
    if (found) {
      return resolve(true)
    }
    let link = document.createElement('link')
    Object.assign(link, attrs)
    link.addEventListener('load', () => resolve(true))
    link.onerror = reject
    document.head.appendChild(link)
  })
}
