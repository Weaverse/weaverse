import type { ElementCSS } from '@weaverse/react'
import { Components } from '@weaverse/react'
import React from 'react'
let { Icon } = Components

export function ProductSkeleton() {
  return (
    <div className="wv-product-form wv-product-details-skeleton animate-pulse">
      <div className="wv-media">
        <div className="wv-media-main-image">
          <Icon name="Image" />
        </div>
        <div className="wv-media-thumbnails">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="wv-media-thumbnail-item">
                <Icon name="Image" />
              </div>
            ))}
        </div>
      </div>
      <div className="wv-info">
        <div className="wv-info-vendor"></div>
        <div className="wv-info-title">
          <div className="wv-item" />
          <div className="wv-item" />
          <div className="wv-item" />
        </div>
        <div className="wv-info-price">
          <div className="wv-price-item" />
          <div className="wv-price-item" />
          <div className="wv-price-item" />
        </div>
        <div className="wv-info-options">
          <div className="wv-option-circle">
            <div className="wv-option-item" />
            <div className="wv-option-item" />
            <div className="wv-option-item" />
          </div>
          <div className="wv-option-round">
            <div className="wv-option-item" />
            <div className="wv-option-item" />
            <div className="wv-option-item" />
          </div>
        </div>
        <div className="wv-info-buy-button">
          <Icon name="ShoppingCart" />
        </div>
        <div className="wv-info-description">
          <div className="wv-line-1"></div>
          <div className="wv-line-2"></div>
          <div className="wv-line-3"></div>
          <div className="wv-line-4"></div>
          <div className="wv-line-5"></div>
        </div>
        <div className="wv-info-meta">
          <div className="wv-item-1">
            <div className="wv-label"></div>
            <div className="wv-value"></div>
          </div>
          <div className="wv-item-2">
            <div className="wv-label"></div>
            <div className="wv-value"></div>
          </div>
          <div className="wv-item-3">
            <div className="wv-label"></div>
            <div className="wv-value"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-product-details-skeleton': {
      display: 'flex',
      gap: '24px',
      div: {
        display: 'block',
      },
      '.wv-media': {
        width: '50%',
        '.wv-media-main-image': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D1D5DB',
          height: '600px',
          borderRadius: '4px',
          svg: { width: '96px', height: '96px', color: '#E5E7EB' },
        },
        '.wv-media-thumbnails': {
          display: 'flex',
          marginTop: '12px',
          gap: '12px',
          overflow: 'hidden',
          '.wv-media-thumbnail-item': {
            backgroundColor: '#D1D5DB',
            height: '120px',
            width: '90px',
            display: 'flex',
            flexShrink: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            svg: { width: '36px', height: '36px', color: '#E5E7EB' },
          },
        },
      },
      '.wv-info': {
        width: '50%',
        '.wv-info-vendor': {
          height: '10px',
          width: '250px',
          marginBottom: '16px',
          backgroundColor: '#E5E7EB',
        },
        '.wv-info-title': {
          marginBottom: '16px',
          display: 'flex',
          gap: '6px',
          '.wv-item': {
            height: '32px',
            width: '180px',
            backgroundColor: '#D1D5DB',
          },
        },
        '.wv-info-price': {
          display: 'flex',
          gap: '6px',
          '.wv-price-item': {
            height: '16px',
            width: '100px',
            backgroundColor: '#E5E7EB',
          },
        },
        '.wv-info-options': {
          margin: '32px 0',
          '.wv-option-circle': {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            '.wv-option-item': {
              height: '50px',
              width: '50px',
              borderRadius: '9999px',
              backgroundColor: '#E5E7EB',
            },
          },
          '.wv-option-round': {
            display: 'flex',
            gap: '10px',
            '.wv-option-item': {
              height: '40px',
              width: '100px',
              borderRadius: '2px',
              backgroundColor: '#E5E7EB',
            },
          },
        },
        '.wv-info-buy-button': {
          height: '52px',
          width: '100%',
          margin: '32px 0',
          backgroundColor: '#D1D5DB',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          svg: { width: '28px', height: '28px', color: '#FFF' },
        },
        '.wv-info-description': {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          '& > div': { borderRadius: '999px' },
          '.wv-line-1': {
            height: '8px',
            width: '500px',
            maxWidth: '100%',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-2': {
            height: '8px',
            width: '550px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-3': {
            height: '8px',
            width: '470px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-4': {
            height: '8px',
            width: '530px',
            backgroundColor: '#E5E7EB',
          },
          '.wv-line-5': {
            height: '8px',
            width: '510px',
            backgroundColor: '#E5E7EB',
          },
        },
        '.wv-info-meta': {
          margin: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          '& > div': {
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '16px',
            margin: '0 0 12px',
            maxWidth: '100%',
          },
          '.wv-item-1': { width: '350px' },
          '.wv-item-2': { width: '300px' },
          '.wv-item-3': { width: '400px' },
          '.wv-label, .wv-value': {
            height: '16px',
            backgroundColor: '#D1D5DB',
            width: '50%',
            borderRadius: '2px',
          },
        },
      },
    },
  },
  '@mobile': {
    '.wv-product-details-skeleton': {
      display: 'block',
      '.wv-media, .wv-info': {
        width: '100%',
      },
      '.wv-media': {
        '.wv-media-main-image': {
          height: '300px',
          marginBottom: '24px',
        },
        '.wv-media-thumbnails': {
          display: 'none',
        },
      },
    },
  },
}
