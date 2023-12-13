import { weaverseShopifyCollections } from '~/proxy'
import type { CollectionListProps } from '~/types'
import type { ShopifyCollection } from '~/types/shopify'

export function useCollections(
  collections: CollectionListProps['collections'],
) {
  let collectionsInfo: ShopifyCollection[] = collections
    .map(({ collectionId }) => weaverseShopifyCollections[collectionId])
    .filter(Boolean)
  let hasAllData = collectionsInfo.every(Boolean)
  return hasAllData ? collectionsInfo : []
}
