import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { ProductContext } from '~/context'
import { weaverseShopifyConfigs } from '~/proxy'
import type { ProductPriceProps } from '~/types'
import { formatMoney } from '~/utils'

let ProductPrice = forwardRef<HTMLDivElement, ProductPriceProps>(
  (props, ref) => {
    let { showCompareAt, showSaleBadge, ...rest } = props
    let context = useContext(ProductContext)
    let [variant, setVariant] = useState(context?.selectedVariant)

    useEffect(() => {
      if (context?.selectedVariant) {
        setVariant(context.selectedVariant)
      }
    }, [context?.selectedVariant])

    if (context) {
      let { ssrMode, product } = context
      if (ssrMode) {
        return (
          <div ref={ref} className="wv-product-prices" {...rest}>
            {`
              {%- assign variant = product.selected_or_first_available_variant -%}
              {%- assign price = variant.price -%}
              {%- assign compare_at_price = variant.compare_at_price -%}
              <span class="wv-sale-price">{{- price | money -}}</span>
              ${
                showCompareAt &&
                `
                {%- if compare_at_price > price -%}
                  <s class="wv-compare-price">{{- compare_at_price | money -}}</s>
                {%- endif -%}
                `
              }
              ${
                showSaleBadge &&
                `
                {%- if compare_at_price > price -%}
                  {%- assign saved_percentage = '' -%}
                  {%- assign saved_percentage = compare_at_price | minus: price | times: 100 | divided_by: compare_at_price | append: '%' -%}
                  <span className="wv-sale-badge">{{- saved_percentage -}}</span>
                {%- endif -%}
                `
              }
            `}
          </div>
        )
      }

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

      return (
        <div ref={ref} className="wv-product-prices" {...rest}>
          <span className="wv-sale-price">
            {formatMoney(price, money_format)}
          </span>
          {showCompareAt && compare_at_price ? (
            <s className="wv-compare-price">
              {formatMoney(compare_at_price, money_format)}
            </s>
          ) : null}
          {showSaleBadge && savedPercentage > 0 ? (
            <span className="wv-sale-badge">Save {savedPercentage}%</span>
          ) : null}
        </div>
      )
    }
    return null
  }
)

ProductPrice.defaultProps = {
  showCompareAt: true,
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
      color: '#666666',
      marginLeft: '8px',
      fontSize: '16px',
      lineHeight: '24px',
    },
    '.wv-sale-badge': {
      color: '#ffffff',
      backgroundColor: '#da3f3f',
      alignItems: 'center',
      display: 'inline-flex',
      marginLeft: '12px',
      height: '22px',
      borderRadius: '11px',
      fontSize: '11px',
      fontWeight: '600',
      lineHeight: '16px',
      padding: '2px 10px',
      textTransform: 'uppercase',
    },
  },
}

export default ProductPrice
