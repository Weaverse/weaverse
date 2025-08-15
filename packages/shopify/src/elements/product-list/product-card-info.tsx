import type { ElementCSS } from '@weaverse/react'
import { weaverseShopifyConfigs } from '~/proxy'
import type { ProductCardInfoProps } from '~/types'
import { formatMoney } from '~/utils/money'
import {
  ProductCardOptions,
  css as productCardOptionsCss,
} from './product-card-options'

export function ProductCardInfo(props: ProductCardInfoProps) {
  let { product, showProductOption, optionName, optionLimit } = props
  let { title, price, compare_at_price, url } = product
  let { money_format } = weaverseShopifyConfigs.shopData

  return (
    <div className="wv-pcard__info">
      <a className="wv-pcard__title" href={url} target="_self">
        {title}
      </a>
      <div className="wv-pcard__prices">
        <span
          className="wv-pcard__price sale-price"
          dangerouslySetInnerHTML={{ __html: formatMoney(price, money_format) }}
          suppressHydrationWarning
        />
        {compare_at_price && (
          <s
            className="wv-pcard__price compare-price"
            dangerouslySetInnerHTML={{
              __html: formatMoney(compare_at_price, money_format),
            }}
            suppressHydrationWarning
          />
        )}
      </div>
      {showProductOption && (
        <ProductCardOptions
          optionLimit={optionLimit}
          optionName={optionName}
          product={product}
        />
      )}
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard__info': {
      marginTop: '20px',
      textAlign: 'center',
      '.wv-pcard__title': {
        marginBottom: '4px',
        color: '#222',
        textTransform: 'uppercase',
        fontSize: '16px',
        lineHeight: '20px',
        fontWeight: '600',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        },
      },
      '.wv-pcard__prices': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        lineHeight: '1.5',
        color: '#000000',
        position: 'relative',
        fontWeight: '500',
        fontSize: '16px',
        '.wv-pcard__price': {
          margin: '5px 0',
          '&.compare-price': {
            color: 'rgba(33, 33, 33, .75)',
            marginLeft: '12px',
          },
        },
      },
      ...productCardOptionsCss['@desktop'],
    },
  },
}
