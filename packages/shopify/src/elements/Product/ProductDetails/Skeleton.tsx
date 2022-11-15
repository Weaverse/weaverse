import type { ElementCSS } from '@weaverse/react'
import React from 'react'

export function ProductSkeleton() {
  return (
    <div className="wv-product-form wv-product-details-skeleton animate-pulse">
      <div className="wv-media">
        <div className="wv-media-main-image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>
        <div className="wv-media-thumbnails">
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div className="wv-media-thumbnail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="wv-info">
        <div className="wv-info-vendor"></div>
        <div className="wv-info-title">
          <div className="wv-item"></div>
          <div className="wv-item"></div>
          <div className="wv-item"></div>
        </div>
        <div className="wv-info-price">
          <div className="wv-price-item"></div>
          <div className="wv-price-item"></div>
          <div className="wv-price-item"></div>
        </div>
        <div className="wv-info-options">
          <div className="wv-option-circle">
            <div className="wv-option-item"></div>
            <div className="wv-option-item"></div>
            <div className="wv-option-item"></div>
          </div>
          <div className="wv-option-round">
            <div className="wv-option-item"></div>
            <div className="wv-option-item"></div>
            <div className="wv-option-item"></div>
          </div>
        </div>
        <div className="wv-info-buy-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <path
              d="M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></path>
            <circle
              cx="80"
              cy="204"
              r="20"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></circle>
            <circle
              cx="184"
              cy="204"
              r="20"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></circle>
            <path
              d="M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></path>
          </svg>
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

export let skeletonCss: ElementCSS = {
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
          justifyContent: 'space-between',
          '.wv-media-thumbnail-item': {
            backgroundColor: '#D1D5DB',
            height: '120px',
            width: '90px',
            display: 'flex',
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
          svg: { width: '28px', height: '28px' },
        },
        '.wv-info-description': {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          '& > div': { borderRadius: '999px' },
          '.wv-line-1': {
            height: '8px',
            width: '500px',
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
