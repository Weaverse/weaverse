import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef } from 'react'

import { CollectionCard, css as collectionCardCss } from './collection-card'
import { Skeleton, css as skeletonCss } from './skeleton'
import { useCollections } from './use-collections'

import { Components } from '~/components'
import { useWeaverseShopify } from '~/hooks/use-weaverse-shopify'
import type { CollectionListProps } from '~/types'

let { Placeholder, Slider } = Components

let CollectionList = forwardRef<HTMLDivElement, CollectionListProps>(
  (props, ref) => {
    let {
      collections,
      layout,
      collectionsPerRow,
      gap,
      imageAspectRatio,
      showProductCount,
      zoomInOnHover,
      children,
      ...rest
    } = props
    let { ssrMode } = useWeaverseShopify()
    let collectionsInfo = useCollections(collections)

    if (!collections.length) {
      return (
        <div ref={ref} {...rest}>
          <Placeholder element="Collection List">
            Select collections and start editing.
          </Placeholder>
        </div>
      )
    }

    let rows = Math.ceil(collectionsInfo.length / collectionsPerRow)
    let shouldRenderSkeleton = ssrMode || !collectionsInfo.length
    let display = 'grid'
    let overflow = 'hidden'
    if (!shouldRenderSkeleton && layout === 'slider') {
      display = 'block'
      overflow = '0'
    }
    let style = {
      '--display': display,
      '--overflow': overflow,
      '--gap': `${gap}px`,
      '--collection-per-row': collectionsPerRow,
      '--rows': rows,
    } as React.CSSProperties

    if (shouldRenderSkeleton) {
      return (
        <div ref={ref} {...rest} style={style}>
          <Skeleton
            collectionCount={
              layout === 'slider' ? collectionsPerRow : collections.length
            }
            imageAspectRatio={imageAspectRatio}
          />
        </div>
      )
    }

    let collectionCards = collectionsInfo.map((collection) => (
      <CollectionCard
        key={collection.id}
        collection={collection}
        imageAspectRatio={imageAspectRatio}
        showProductCount={showProductCount}
        zoomInOnHover={zoomInOnHover}
        className={layout === 'slider' ? 'keen-slider__slide' : ''}
      />
    ))

    if (layout === 'slider') {
      return (
        <div ref={ref} {...rest} style={style}>
          <Slider
            className="wv-collection-list__slider"
            gap={gap}
            arrowOffset={-80}
            slidesPerView={collectionsPerRow}
          >
            {collectionCards}
          </Slider>
        </div>
      )
    }

    return (
      <div ref={ref} {...rest} style={style}>
        {collectionCards}
      </div>
    )
  },
)

export default CollectionList

CollectionList.defaultProps = {
  collections: [],
  layout: 'grid',
  collectionsPerRow: 4,
  gap: 16,
  imageAspectRatio: 'auto',
  zoomInOnHover: true,
  showProductCount: true,
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'var(--display, grid)',
    gridTemplateColumns: 'repeat(var(--collection-per-row), 1fr)',
    gap: 'var(--gap, 16px)',
    overflow: 'var(--overflow, hidden)',
    position: 'relative',
    ...collectionCardCss['@desktop'],
    ...skeletonCss['@desktop'],
  },
  '@mobile': {
    display: 'flex',
    overflow: 'auto',
    scrollBehavior: 'smooth',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 0,
    '.wv-collection-list__slider': {
      '.wv-collection-card': {
        padding: '0 32px',
      },
    },
    ...collectionCardCss['@mobile'],
    ...skeletonCss['@mobile'],
  },
}
