import React, { forwardRef, useContext, useEffect, useState } from 'react'
import type { TODO } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from './context'
import IMG from 'react-image-gallery'
// @ts-ignore
let ImageGallery = IMG.default
let ProductImage = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { showThumbnail, ...rest } = props
  let { product, productId, variantId } = useContext(ProductContext)
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let [startIndex, setStartIndex] = useState(0)
  let images = product?.media || product?.images || []

  if (!productId || !images.length) {
    return null
  }
  function renderVideo(item: any) {
    return <iframe src={item.embedUrl} frameBorder="0" allowFullScreen></iframe>
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
      <style>
        {`
        iframe {
          width: 100%;
          height: 100%;
        }
        .image-gallery-slide, .image-gallery-slides, .image-gallery-swipe, .image-gallery-content, .image-gallery {
          height: 100%;
        }
          .image-gallery-icon {
    color: #333;
    transition: all .3s ease-out;
    appearance: none;
    border: 0;
    cursor: pointer;
    outline: none;
    position: absolute;
    z-index: 4;
    border-radius: 100%;
    background-color: #eee;
    width: 36px;
    height: 36px;
    padding: 8px;
}

@media(hover: hover)and (pointer: fine) {
    .image-gallery-icon:hover {
        color: #337ab7
    }
    .image-gallery-icon:hover .image-gallery-svg {
        transform: scale(1.1)
    }
}

.image-gallery-icon:focus {
    outline: 2px solid #337ab7
}

.image-gallery-using-mouse .image-gallery-icon:focus {
    outline: none
}

.image-gallery-fullscreen-button,
.image-gallery-play-button {
    bottom: 0;
}

.image-gallery-fullscreen-button .image-gallery-svg,
.image-gallery-play-button .image-gallery-svg {
    height: 20px;
    width: 20px
}
.image-gallery-fullscreen-button {
    right: 0
}

.image-gallery-play-button {
    left: 0
}

.image-gallery-left-nav,
.image-gallery-right-nav {
    padding: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.image-gallery-left-nav .image-gallery-svg,
.image-gallery-right-nav .image-gallery-svg {
    height: 20px;
    width: 20px
}

.image-gallery-left-nav[disabled],
.image-gallery-right-nav[disabled] {
    cursor: disabled;
    opacity: .6;
    pointer-events: none
}

.image-gallery-left-nav {
    left: 0
}

.image-gallery-right-nav {
    right: 0
}

.image-gallery {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative
}

.image-gallery.fullscreen-modal {
    background: #000;
    bottom: 0;
    height: 100%;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 5
}

.image-gallery.fullscreen-modal .image-gallery-content {
    top: 50%;
    transform: translateY(-50%)
}

.image-gallery-content {
    position: relative;
    line-height: 0;
    top: 0;
    display: flex;
    flex-direction: column;
}
.image-gallery-slide-wrapper {
  height: 0;
  flex-grow: 7;
}

.image-gallery-thumbnails-wrapper {
  height: 0;
  flex-grow: 3;
} 
  
.image-gallery-content.fullscreen {
    background: #000
}

.image-gallery-content .image-gallery-slide .image-gallery-image {
    max-height: calc(100vh - 80px)
}

.image-gallery-content.left .image-gallery-slide .image-gallery-image,
.image-gallery-content.right .image-gallery-slide .image-gallery-image {
    max-height: 100vh
}

.image-gallery-slide-wrapper {
    position: relative
}

.image-gallery-slide-wrapper.left,
.image-gallery-slide-wrapper.right {
    display: inline-block;
    width: calc(100% - 110px)
}

.image-gallery-slide-wrapper.image-gallery-rtl {
    direction: rtl
}

.image-gallery-slides {
    line-height: 0;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
    text-align: center
}

.image-gallery-slide {
    left: 0;
    position: absolute;
    top: 0;
    width: 100%
}

.image-gallery-slide.center {
    position: relative
}

.image-gallery-slide .image-gallery-image {
    width: 100%;
    object-fit: contain
}

.image-gallery-slide .image-gallery-description {
    background: rgba(0, 0, 0, .4);
    bottom: 70px;
    color: #fff;
    left: 0;
    line-height: 1;
    padding: 10px 20px;
    position: absolute;
    white-space: normal
}

.image-gallery-bullets {
    bottom: 20px;
    left: 0;
    margin: 0 auto;
    position: absolute;
    right: 0;
    width: 80%;
    z-index: 4
}

.image-gallery-bullets .image-gallery-bullets-container {
    margin: 0;
    padding: 0;
    text-align: center
}

.image-gallery-bullets .image-gallery-bullet {
    appearance: none;
    background-color: #f2f2f2b3;
    border: 1px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    margin: 0 5px;
    outline: none;
    padding: 5px;
    transition: all .2s ease-out
}

.image-gallery-bullets .image-gallery-bullet:focus {
    transform: scale(1.2);
    background: #337ab7;
    border: 1px solid #337ab7
}

.image-gallery-bullets .image-gallery-bullet.active {
    transform: scale(1.2);
    border: 1px solid #fff;
    background: #333333b3;
}

.image-gallery-thumbnails-wrapper {
    position: relative
}

.image-gallery-thumbnails-wrapper.thumbnails-swipe-horizontal {
    touch-action: pan-y
}

.image-gallery-thumbnails-wrapper.thumbnails-swipe-vertical {
    touch-action: pan-x
}

.image-gallery-thumbnails-wrapper.thumbnails-wrapper-rtl {
    direction: rtl
}

.image-gallery-thumbnails-wrapper.left,
.image-gallery-thumbnails-wrapper.right {
    display: inline-block;
    vertical-align: top;
    width: 100px
}

.image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails,
.image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
    height: 100%;
    width: 100%;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0
}

.image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail,
.image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
    display: block;
    margin-right: 0;
    padding: 0
}

.image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail+.image-gallery-thumbnail,
.image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail+.image-gallery-thumbnail {
    margin-left: 0;
    margin-top: 2px
}

.image-gallery-thumbnails-wrapper.left,
.image-gallery-thumbnails-wrapper.right {
    margin: 0 5px
}

.image-gallery-thumbnails {
    overflow: hidden;
    padding: 5px 0
}

.image-gallery-thumbnails .image-gallery-thumbnails-container {
    cursor: pointer;
    text-align: center;
    white-space: nowrap
}

.image-gallery-thumbnail {
    display: inline-block;
    border: 4px solid transparent;
    transition: border .3s ease-out;
    width: 100px;
    background: transparent;
    padding: 0
}

.image-gallery-thumbnail+.image-gallery-thumbnail {
    margin-left: 2px
}

.image-gallery-thumbnail .image-gallery-thumbnail-inner {
    display: block;
    position: relative
}

.image-gallery-thumbnail .image-gallery-thumbnail-image {
    vertical-align: middle;
    width: 100%;
    line-height: 0
}

.image-gallery-thumbnail.active,
.image-gallery-thumbnail:focus {
    outline: none;
    border: 4px solid #337ab7
}

.image-gallery-thumbnail-label {
    box-sizing: border-box;
    color: #fff;
    font-size: 1em;
    left: 0;
    line-height: 1em;
    padding: 5%;
    position: absolute;
    top: 50%;
    text-shadow: 0 2px 2px #1a1a1a;
    transform: translateY(-50%);
    white-space: normal;
    width: 100%
}

.image-gallery-index {
    background: rgba(0, 0, 0, .4);
    color: #fff;
    line-height: 1;
    padding: 10px 20px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 4
}
        
        `}
      </style>
      {ssrMode ? (
        <img
          src={`{{ product_${productId}.featured_image }}`}
          alt="featured image"
        />
      ) : (
        <ImageGallery
          items={items}
          startIndex={startIndex}
          showBullets
          showIndex
          showThumbnails={showThumbnail}
        />
      )}
    </div>
  )
})

ProductImage.defaultProps = {
  showThumbnail: false,
  css: {
    '@desktop': {
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
    },
  },
}

export default ProductImage
