import type { WeaverseElementProps } from '@weaverse/react'
import type { ShopifyGlobalConfigs, WeaverseCartHelpers } from './configs'
import type {
  ShopifyArticle,
  ShopifyCollection,
  ShopifyProduct,
  ShopifyProductImage,
  ShopifyProductVariant,
} from './shopify'

export interface ProductContextType {
  product: ShopifyProduct
  ssrMode: boolean
  productId?: string | number
  formId: string
  formRef: React.RefObject<HTMLFormElement>
  selectedVariant: ShopifyProductVariant | null
  setSelectedVariant: (variant: ShopifyProductVariant) => void
}

export interface ProductListContextProps {
  productId?: string | number
}

export interface ProductListProps extends WeaverseElementProps {
  collectionId: number
  collectionHandle: string
  productNumber: number
  itemsPerSlide: number
  itemsSpacing: number
}

export interface ProductDetailsProps extends WeaverseElementProps {
  productId: number
  productHandle: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProductInfoProps extends WeaverseElementProps {}

export type ProductMediaSize = 'small' | 'medium' | 'large'
export type AspectRatio = 'auto' | '1 / 1' | '3 / 4' | '4 / 3'

export interface ProductMediaProps extends WeaverseElementProps {
  mediaSize: ProductMediaSize
  aspectRatio: AspectRatio
}
export interface SlideImageProps {
  image: ShopifyProductImage
  className: string
}
export interface ProductTitleProps extends WeaverseElementProps {
  htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
}

export interface ProductDescriptionProps extends WeaverseElementProps {
  lineClamp: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProductVendorProps extends WeaverseElementProps {}

export interface ProductMetaProps extends WeaverseElementProps {
  // showAvailability: boolean
  showSKU: boolean
  // showCollections: boolean
  showTags: boolean
  showVendor: boolean
  showType: boolean
}

export interface ProductPriceProps extends WeaverseElementProps {
  showCompareAt: boolean
  showSaleBadge: boolean
}

export interface ProductBuyButtonProps extends WeaverseElementProps {
  showQuantitySelector: boolean
  quantityLabel: string
  buttonText: string
  soldOutText: string
  unavailableText: string
}

export interface ProductVariantProps extends WeaverseElementProps {
  optionsStyle: 'combined' | 'custom'
}
export interface CombinedVariantProps {
  context: ProductContextType
}

export interface ArticleBoxProps extends WeaverseElementProps {
  articleId: number
  articleHandle?: string
}

export interface ArticleTitleProps extends WeaverseElementProps {
  htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  linkArticle: boolean
}

export interface ArticleImageProps extends WeaverseElementProps {
  linkArticle: boolean
  aspectRatio: string
}

export interface CollectionBoxProps extends WeaverseElementProps {
  collectionId: number
  collectionHandle?: string
}

export interface ArticleListProps extends WeaverseElementProps {
  blogId: string | number
  blogHandle: string
  itemsPerSlide: number
  articleNumber: number
  itemsSpacing: number
}

export interface CollectionContextProps {
  collection: ShopifyCollection
  collectionId: string | number
}

// Form
export interface FormElementProps extends WeaverseElementProps {
  formType: string
  fields: FormFieldProps[]
  submitText: string
  submitPosition: 'left' | 'right' | 'center'
  openInNewTab: boolean
  targetLink: string
}

export type FormFieldType = 'text' | 'email' | 'multiline'
export interface FormFieldProps {
  id: number
  type: FormFieldType
  placeholder: string
  showLabel: boolean
  label: string
  name?: string
  required: boolean
}

export * from './shopify'
export * from './configs'

declare global {
  interface Window {
    weaverseShopifyConfigs: ShopifyGlobalConfigs
    weaverseShopifyProducts: Record<number, ShopifyProduct>
    weaverseShopifyProductsByCollection: Record<number, ShopifyProduct>
    weaverseShopifyCollections: Record<number, ShopifyCollection>
    weaverseShopifyArticles: Record<number, ShopifyArticle>
    weaverseShopifyBlogs: Record<number, ShopifyArticle>
    weaverseCartHelpers: WeaverseCartHelpers
  }
}
