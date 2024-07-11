import type { ElementCSS } from '@weaverse/react'
import type { CSSProperties } from 'react'
import React, { forwardRef } from 'react'

import { Components } from '~/components'
import { Image } from '~/elements/product/product-media/image'
import { weaverseShopifyConfigs, weaverseShopifyProducts } from '~/proxy'
import type { HotspotsProps } from '~/types'
import type { ShopifyProduct } from '~/types/shopify'
import { formatMoney } from '~/utils/money'

let { Icon } = Components

export let Hotspots = forwardRef<HTMLDivElement, HotspotsProps>(
  (props, ref) => {
    let { image, aspectRatio, icon, color, hotspots, ...rest } = props
    let { money_format } = weaverseShopifyConfigs.shopData || {}
    let products: ShopifyProduct[] = hotspots
      .filter((hotspot) => hotspot.productId)
      .map((hotspot) => weaverseShopifyProducts[hotspot.productId!])
    let style = {
      '--aspect-ratio': aspectRatio,
      '--color': color === 'light' ? '#000' : '#fff',
      '--bg-color': color === 'light' ? '#fff' : '#000',
    } as CSSProperties

    return (
      <div ref={ref} {...rest} style={style}>
        <img
          alt="Hotspots"
          className="hotspots__image"
          src={image}
          loading="lazy"
        />
        <div className="hotspots">
          {hotspots.map((hotspot) => {
            let product = products.find(
              (product) => product?.id === hotspot.productId,
            )
            if (!product) return null
            let { images, url, price, title } = product
            return (
              <div
                key={hotspot.productId}
                className="animate-ping hotspots__button"
                style={
                  {
                    top: `${hotspot.offsetY}%`,
                    left: `${hotspot.offsetX}%`,
                    '--translate-x-ratio': hotspot.offsetX > 50 ? 1 : -1,
                    '--translate-y-ratio': hotspot.offsetY > 50 ? 1 : -1,
                  } as CSSProperties
                }
              >
                <Icon name={icon} />
                <div
                  className="hotspot__product"
                  style={{
                    top: hotspot.offsetY > 50 ? 'auto' : '100%',
                    bottom: hotspot.offsetY > 50 ? '100%' : 'auto',
                    left: hotspot.offsetX > 50 ? 'auto' : '100%',
                    right: hotspot.offsetX > 50 ? '100%' : 'auto',
                  }}
                >
                  <div className="hotspot__product-image">
                    <a href={url} target="_self">
                      <Image image={images[0]} width={500} />
                    </a>
                  </div>
                  <div className="hotspot__product-info">
                    <div>
                      <a href={url} className="hotspot__product-title">
                        {title}
                      </a>
                      <p className="hotspot__product-price">
                        {formatMoney(price, money_format)}
                      </p>
                    </div>
                    <a className="hotspot__view-details" href={url}>
                      View full details
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

export let css: ElementCSS = {
  '@desktop': {
    position: 'relative',
    display: 'flex',
    '.hotspots__image': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    '.hotspots__button': {
      position: 'absolute',
      display: 'flex',
      width: '28px',
      height: '28px',
      padding: '5px',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--color)',
      cursor: 'pointer',
      svg: {
        width: '18px',
        height: '18px',
      },
      '&:hover': {
        '.hotspot__product': {
          opacity: '1',
          visibility: 'visible',
          transform:
            'translate3d(calc(var(--translate-x-ratio) * 28px), calc(var(--translate-y-ratio) * -6px), 0)',
        },
      },
      '.hotspot__product': {
        width: '280px',
        padding: '16px',
        backgroundColor: '#fff',
        overflow: 'hidden',
        transition: '.3s all',
        opacity: '0',
        visibility: 'hidden',
        transform:
          'translate3d(calc(var(--translate-x-ratio) * 28px), calc(var(--translate-y-ratio) * -16px), 0)',
        boxShadow: '2px 7px 15px rgba(0, 0, 0, .04)',
        position: 'absolute',
        display: 'flex',
        gap: '16px',
        '.hotspot__product-image': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          a: {
            width: '80px',
            display: 'flex',
            img: {
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
            },
          },
        },
        '.hotspot__product-info': {
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '.hotspot__product-title': {
            display: 'flex',
            fontSize: '14px',
            lineHeight: '1.5',
            fontWeight: '600',
            color: '#222',
            textDecoration: 'none',
            textTransform: 'uppercase',
          },
          '.hotspot__product-price': {
            fontSize: '15px',
            fontWeight: '500',
            marginTop: '8px',
            marginBottom: '10px',
            color: '#222',
          },
          '.hotspot__view-details': {
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            justifySelf: 'flex-end',
            color: '#222',
          },
        },
      },
    },
  },
  '@mobile': {
    aspectRatio: 'var(--aspect-ratio, 1/1)',
    '.hotspots__button': {
      '.hotspot__product': {
        flexDirection: 'column',
        width: '150px',
      },
    },
  },
}

Hotspots.defaultProps = {
  image:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Integration.png?v=1698317519',
  aspectRatio: 'auto',
  icon: 'HandBag',
  color: 'light',
  hotspots: [
    {
      id: 'default',
      productId: null,
      productHandle: '',
      offsetX: 50,
      offsetY: 50,
    },
  ],
}

export default Hotspots
