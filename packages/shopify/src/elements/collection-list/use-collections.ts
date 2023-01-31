import type { CollectionListProps } from '~/types'

export function useCollections(
  collections: CollectionListProps['collections']
) {
  let collectionsInfo = collections
    .map(({ collectionId }) => window.weaverseShopifyCollections[collectionId])
    .filter(Boolean)
  let hasAllData = collectionsInfo.every(Boolean)
  return hasAllData ? collectionsInfo : []
}
