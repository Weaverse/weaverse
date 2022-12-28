import type { ElementCSS } from '@weaverse/react'
import React from 'react'

export function ProductCardSaleBadge() {
  return <span className="wv-pcard__sale-badge">Sale</span>
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard__sale-badge': {
      position: 'absolute',
      right: 12,
      top: 12,
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      padding: '4px 10px',
      letterSpacing: '1px',
      fontSize: 15,
      color: '#fff',
      lineHeight: 1,
      backgroundColor: '#a83d3d',
    },
  },
}
