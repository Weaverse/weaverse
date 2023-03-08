import React, { useId, useState } from 'react'

export function NoHydrate({
  getHTML,
  ...rest
}: { getHTML?: () => string } & JSX.IntrinsicElements['div']) {
  let id = useId()
  let [html] = useState(() => {
    if (typeof document === 'undefined') {
      return getHTML?.() ?? ''
    }
    let el = document.getElementById(id)
    if (!el) return getHTML?.() ?? ''
    return el.innerHTML
  })
  return <div {...rest} id={id} dangerouslySetInnerHTML={{ __html: html }} />
}
