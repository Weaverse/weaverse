import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'
import IMG from 'react-image-gallery'
import type { ProductImageProps } from '~/types'
// @ts-ignore
let ImageGallery = IMG.default
let ProductImage = forwardRef<HTMLDivElement, ProductImageProps>(
  (props, ref) => {
    let { showThumbnails, thumbnailPosition, showBullets, ...rest } = props
    let { product, productId, variantId } = useContext(ProductContext)
    let weaverseContext = useContext(WeaverseContext)
    let { ssrMode } = weaverseContext
    let [startIndex, setStartIndex] = useState(0)
    let images = product?.media || product?.images || []

    if (!productId || !images.length) {
      return null
    }
    function renderVideo(item: any) {
      return (
        <iframe src={item.embedUrl} frameBorder="0" allowFullScreen></iframe>
      )
    }
    useEffect(() => {
      let variants = product?.variants || []
      let variant = variants.find((variant) => variant.id === variantId)
      let imageId = variant?.image_id || variant?.featured_media.id
      let imageIndex = images.findIndex((img) => img.id === imageId)
      if (imageIndex !== -1 && imageIndex !== startIndex) {
        setStartIndex(imageIndex)
      }
    }, [variantId])

    let items = images.map((image) => {
      let src = image.src || image.preview_image.src
      let item = {
        original: src,
        thumbnail: src,
        originalHeight: '100%',
        originalWidth: '100%',
        alt: image.alt,
      }
      if (image.media_type === 'external_video') {
        Object.assign(item, {
          embedUrl: `https://www.youtube.com/embed/${image.external_id}?autoplay=1&showinfo=0`,
          renderItem: renderVideo,
        })
      }
      return item
    })

    return (
      <div ref={ref} {...rest}>
        {ssrMode ? (
          <img
            src={`{{ product_${productId}.featured_image }}`}
            alt="featured image"
          />
        ) : (
          <ImageGallery
            items={items}
            startIndex={startIndex}
            showBullets={showBullets}
            showThumbnails={showThumbnails}
            thumbnailPosition={thumbnailPosition}
          />
        )}
      </div>
    )
  }
)

export let css = {
  '@desktop': {
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
}

ProductImage.defaultProps = {
  showThumbnails: false,
  thumbnailPosition: 'bottom',
  showBullets: true,
}

export default ProductImage

export let permanentCss = {
  '@desktop': {
    iframe: { width: '100%', height: '100%' },
    '.image-gallery-slide': {
      height: '100%',
      left: '0',
      position: 'absolute',
      top: '0',
      width: '100%',
      '.image-gallery-image': { width: '100%', objectFit: 'contain' },
      '.image-gallery-description': {
        background: 'rgba(0, 0, 0, .4)',
        bottom: '70px',
        color: '#fff',
        left: '0',
        lineHeight: 1,
        padding: '10px 20px',
        position: 'absolute',
        whiteSpace: 'normal',
      },
    },
    '.image-gallery-slides': {
      height: '100%',
      lineHeight: 0,
      overflow: 'hidden',
      position: 'relative',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
    '.image-gallery-swipe': { height: '100%' },
    '.image-gallery-content': {
      height: '100%',
      position: 'relative',
      lineHeight: 0,
      top: '0',
      display: 'flex',
      flexDirection: 'column',
      '.image-gallery-slide': {
        '.image-gallery-image': { maxHeight: 'calc(100vh - 80px)' },
      },
    },
    '.image-gallery': {
      height: '100%',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      OUserSelect: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      position: 'relative',
    },
    '.image-gallery-icon': {
      color: '#333',
      transition: 'all .3s ease-out',
      appearance: 'none',
      border: '0',
      cursor: 'pointer',
      outline: 'none',
      position: 'absolute',
      zIndex: 4,
      borderRadius: '100%',
      backgroundColor: '#eee',
      width: '36px',
      height: '36px',
      padding: '8px',
      '&:focus': { outline: '2px solid #337ab7' },
    },
    '.image-gallery-using-mouse': {
      '.image-gallery-icon': { '&:focus': { outline: 'none' } },
    },
    '.image-gallery-fullscreen-button': {
      bottom: '0',
      right: '0',
      '.image-gallery-svg': { height: '20px', width: '20px' },
    },
    '.image-gallery-play-button': {
      bottom: '0',
      left: '0',
      '.image-gallery-svg': { height: '20px', width: '20px' },
    },
    '.image-gallery-left-nav': {
      padding: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      left: '0',
      '.image-gallery-svg': { height: '20px', width: '20px' },
    },
    '.image-gallery-right-nav': {
      padding: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      right: '0',
      '.image-gallery-svg': { height: '20px', width: '20px' },
    },
    '.image-gallery-left-nav[disabled]': {
      cursor: 'disabled',
      opacity: 0.6,
      pointerEvents: 'none',
    },
    '.image-gallery-right-nav[disabled]': {
      cursor: 'disabled',
      opacity: 0.6,
      pointerEvents: 'none',
    },
    '.image-gallery.fullscreen-modal': {
      background: '#000',
      bottom: '0',
      height: '100%',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
      width: '100%',
      zIndex: 5,
      '.image-gallery-content': { top: '50%', transform: 'translateY(-50%)' },
    },
    '.image-gallery-slide-wrapper': {
      height: '0',
      flexGrow: 7,
      position: 'relative',
    },
    '.image-gallery-thumbnails-wrapper': {
      height: '0',
      flexGrow: 3,
      position: 'relative',
    },
    '.image-gallery-content.fullscreen': { background: '#000' },
    '.image-gallery-content.left': {
      '.image-gallery-slide': {
        '.image-gallery-image': { maxHeight: '100vh' },
      },
    },
    '.image-gallery-content.right': {
      '.image-gallery-slide': {
        '.image-gallery-image': { maxHeight: '100vh' },
      },
    },
    '.image-gallery-slide-wrapper.left': {
      display: 'inline-block',
      width: 'calc(100% - 110px)',
    },
    '.image-gallery-slide-wrapper.right': {
      display: 'inline-block',
      width: 'calc(100% - 110px)',
    },
    '.image-gallery-slide-wrapper.image-gallery-rtl': { direction: 'rtl' },
    '.image-gallery-slide.center': { position: 'relative' },
    '.image-gallery-bullets': {
      bottom: '20px',
      left: '0',
      margin: '0 auto',
      position: 'absolute',
      right: '0',
      width: '80%',
      zIndex: 4,
      '.image-gallery-bullets-container': {
        margin: '0',
        padding: '0',
        textAlign: 'center',
      },
      '.image-gallery-bullet': {
        appearance: 'none',
        backgroundColor: '#f2f2f2b3',
        border: '1px solid #fff',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'inline-block',
        margin: '0 5px',
        outline: 'none',
        padding: '5px',
        transition: 'all .2s ease-out',
        '&:focus': {
          transform: 'scale(1.2)',
          background: '#337ab7',
          border: '1px solid #337ab7',
        },
      },
      '.image-gallery-bullet.active': {
        transform: 'scale(1.2)',
        border: '1px solid #fff',
        background: '#333333b3',
      },
    },
    '.image-gallery-thumbnails-wrapper.thumbnails-swipe-horizontal': {
      touchAction: 'pan-y',
    },
    '.image-gallery-thumbnails-wrapper.thumbnails-swipe-vertical': {
      touchAction: 'pan-x',
    },
    '.image-gallery-thumbnails-wrapper.thumbnails-wrapper-rtl': {
      direction: 'rtl',
    },
    '.image-gallery-thumbnails-wrapper.left': {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '100px',
      margin: '0 5px',
      '.image-gallery-thumbnails': {
        height: '100%',
        width: '100%',
        left: '0',
        padding: '0',
        position: 'absolute',
        top: '0',
        '.image-gallery-thumbnail': {
          display: 'block',
          marginRight: '0',
          padding: '0',
        },
        '.image-gallery-thumbnail+.image-gallery-thumbnail': {
          marginLeft: '0',
          marginTop: '2px',
        },
      },
    },
    '.image-gallery-thumbnails-wrapper.right': {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '100px',
      margin: '0 5px',
      '.image-gallery-thumbnails': {
        height: '100%',
        width: '100%',
        left: '0',
        padding: '0',
        position: 'absolute',
        top: '0',
        '.image-gallery-thumbnail': {
          display: 'block',
          marginRight: '0',
          padding: '0',
        },
        '.image-gallery-thumbnail+.image-gallery-thumbnail': {
          marginLeft: '0',
          marginTop: '2px',
        },
      },
    },
    '.image-gallery-thumbnails': {
      overflow: 'hidden',
      padding: '5px 0',
      '.image-gallery-thumbnails-container': {
        cursor: 'pointer',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      },
    },
    '.image-gallery-thumbnail': {
      display: 'inline-block',
      border: '4px solid transparent',
      transition: 'border .3s ease-out',
      width: '100px',
      background: 'transparent',
      padding: '0',
      '.image-gallery-thumbnail-inner': {
        display: 'block',
        position: 'relative',
      },
      '.image-gallery-thumbnail-image': {
        verticalAlign: 'middle',
        width: '100%',
        lineHeight: 0,
      },
      '&:focus': { outline: 'none', border: '4px solid #337ab7' },
    },
    '.image-gallery-thumbnail+.image-gallery-thumbnail': { marginLeft: '2px' },
    '.image-gallery-thumbnail.active': {
      outline: 'none',
      border: '4px solid #337ab7',
    },
    '.image-gallery-thumbnail-label': {
      boxSizing: 'border-box',
      color: '#fff',
      fontSize: '1em',
      left: '0',
      lineHeight: '1em',
      padding: '5%',
      position: 'absolute',
      top: '50%',
      textShadow: '0 2px 2px #1a1a1a',
      transform: 'translateY(-50%)',
      whiteSpace: 'normal',
      width: '100%',
    },
    '.image-gallery-index': {
      background: 'rgba(0, 0, 0, .4)',
      color: '#fff',
      lineHeight: 1,
      padding: '10px 20px',
      position: 'absolute',
      right: '0',
      top: '0',
      zIndex: 4,
    },
    '@media hover: hover)and (pointer: fine)': {
      '.image-gallery-icon': {
        '&:hover': {
          color: '#337ab7',
          '.image-gallery-svg': { transform: 'scale(1.1)' },
        },
      },
    },
  },
}
