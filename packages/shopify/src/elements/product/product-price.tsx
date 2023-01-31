import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useEffect, useState } from 'react'
import { useProductContext } from '~/hooks/use-product-context'
import { weaverseShopifyConfigs } from '~/proxy'
import type { ProductPriceProps } from '~/types'
import { formatMoney } from '~/utils/money'

let ProductPrice = forwardRef<HTMLDivElement, ProductPriceProps>(
  (props, ref) => {
    let { showCompareAt, showComparePriceFirst, showSaleBadge, ...rest } = props
    let context = useProductContext()
    let [variant, setVariant] = useState(context.selectedVariant)

    useEffect(() => {
      if (context.selectedVariant) {
        setVariant(context.selectedVariant)
      }
    }, [context.selectedVariant])

    let { product } = context
    let { money_format } = weaverseShopifyConfigs.shopData
    let price: string | number = product?.price || 0
    let compare_at_price: string | number = product?.compare_at_price || 0
    if (variant) {
      price = variant.price
      compare_at_price = variant.compare_at_price || 0
    }

    let savedPercentage = 0
    if (compare_at_price && Number(compare_at_price) > Number(price)) {
      let savedAmount = Number(compare_at_price) - Number(price)
      savedPercentage = Math.round(
        (savedAmount / Number(compare_at_price)) * 100
      )
    }

    let comparePrice =
      showCompareAt && compare_at_price ? (
        <s className="wv-compare-price">
          {formatMoney(compare_at_price, money_format)}
        </s>
      ) : null

    return (
      <div ref={ref} {...rest}>
        {showComparePriceFirst ? comparePrice : null}
        <span className="wv-sale-price">
          {formatMoney(price, money_format)}
        </span>
        {showComparePriceFirst ? null : comparePrice}
        {showSaleBadge && savedPercentage > 0 ? (
          <span className="wv-sale-badge">Save {savedPercentage}%</span>
        ) : null}
      </div>
    )
  }
)

ProductPrice.defaultProps = {
  showCompareAt: true,
  showComparePriceFirst: false,
  showSaleBadge: true,
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    alignItems: 'center',
    '.wv-sale-price': {
      fontSize: '24px',
      lineHeight: '32px',
    },
    '.wv-compare-price': {
      color: 'rgba(33, 33, 33, .75)',
      marginLeft: '12px',
      fontSize: '24px',
      lineHeight: '32px',
    },
    '.wv-sale-badge': {
      color: '#ffffff',
      backgroundColor: '#da3f3f',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '12px',
      height: '22px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '16px',
      padding: '2px 10px',
      textTransform: 'uppercase',
    },
  },
}

export default ProductPrice
