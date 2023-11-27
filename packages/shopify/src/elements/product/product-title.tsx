import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'

import { useProductContext } from '~/hooks/use-product-context'
import type { ProductTitleProps } from '~/types'

let ProductTitle = forwardRef<HTMLElement, ProductTitleProps>((props, ref) => {
  let { htmlTag, clickAction, ...rest } = props
  let { isDesignMode } = useContext(WeaverseContext)
  let { product } = useProductContext()

  let shopData = window.weaverseShopifyConfigs?.shopData || {}
  let isNotProductPage = shopData?.request?.page_type !== 'product'

  let handleClick = () => {
    if (!isDesignMode) {
      if (clickAction === 'goToProductPage' && isNotProductPage) {
        let { root_url = '/' } =
          window.weaverseShopifyConfigs?.shopData?.routes || {}
        let url = `${root_url}products/${product.handle}`
        window.location.href = url
      }
    }
  }

  return React.createElement(
    htmlTag,
    {
      ref,
      onClick: handleClick,
      'data-go-to-product':
        clickAction === 'goToProductPage' && isNotProductPage,
      ...rest,
    },
    product.title,
  )
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: '34px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '46px',
    letterSpacing: '0px',
    wordBreak: 'break-word',
    marginTop: '6px',
    marginBottom: '24px',
    marginLeft: '0px',
    marginRight: '0px',
    '&[data-go-to-product="true"]': {
      cursor: 'pointer',
    },
  },
}

ProductTitle.defaultProps = {
  htmlTag: 'h2',
}

export default ProductTitle
