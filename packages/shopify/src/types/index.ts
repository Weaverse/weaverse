import type {
  WeaverseElementProps,
  WeaverseResourcePickerData,
} from '@weaverse/react'
import type { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider'

import type { WeaverseIcon } from './components'
import type {
  OptionDisplayType,
  ShopifyGlobalConfigs,
  WeaverseCartHelpers,
} from './configs'
import type {
  ShopifyArticle,
  ShopifyCollection,
  ShopifyProduct,
  ShopifyProductImage,
  ShopifyProductOption,
  ShopifyProductVariant,
} from './shopify'

import type { WeaverseShopify } from '~/index'

export * from './configs'
export * from './shopify'
export * from './weaverse-shopify'

export interface ProductContextType {
  product: ShopifyProduct
  productId?: string | number
  formRef: React.RefObject<HTMLFormElement>
  selectedVariant: ShopifyProductVariant | null
  setSelectedVariant: (variant: ShopifyProductVariant) => void
  /**
   * Indicates whether the product element is ready for interaction.
   */
  ready: boolean
}

export interface ProductListContextProps {
  productId?: string | number
}

export interface ProductCardProps {
  product: ShopifyProduct
  imageAspectRatio: AspectRatio
  showSecondImageOnHover: boolean
  showSaleBadge: boolean
  showViewDetailsButton: boolean
  viewDetailsButtonText: string
  showQuickViewButton: boolean
  showProductOption: boolean
  optionName: string
  optionLimit: number
  className?: string
}

export type ProductCardInfoProps = Pick<
  ProductCardProps,
  'product' | 'showProductOption' | 'optionName' | 'optionLimit'
>

export type ProductCardOptionsProps = Pick<
  ProductCardProps,
  'product' | 'optionName' | 'optionLimit'
>

export interface ProductCardButtonsProps
  extends Pick<
    ProductCardProps,
    'showViewDetailsButton' | 'viewDetailsButtonText' | 'showQuickViewButton'
  > {
  product: ShopifyProduct
}

export type ProductListSource = 'collection' | 'recommended' | 'fixedProducts'
export type FixedProduct = {
  productId: string
  productHandle: string
}

export interface ProductListProps
  extends WeaverseElementProps,
    ProductCardProps {
  source: ProductListSource
  collectionId: number
  collectionHandle: string
  fixedProducts: FixedProduct[]
  layout: 'grid' | 'slider'
  productCount: number
  productsPerRow: number
  gap: number
}

export interface CollectionCardProps {
  collection: ShopifyCollection
  imageAspectRatio: AspectRatio
  showProductCount: boolean
  zoomInOnHover: boolean
  className?: string
}

export interface CollectionListProps
  extends WeaverseElementProps,
    CollectionCardProps {
  collections: { collectionId: number; collectionHandle: string }[]
  layout: 'grid' | 'slider'
  collectionsPerRow: number
  gap: number
}

export interface ArticleCardProps {
  article: ShopifyArticle
  imageAspectRatio: AspectRatio
  zoomInOnHover: boolean
  showDate: boolean
  dateFormat?: string
  showAuthor: boolean
  showExcerpt: boolean
  excerptLineClamp: number
  showReadMoreButton: boolean
  readMoreButtonText: string
  className?: string
}

export interface ArticleListProps
  extends WeaverseElementProps,
    ArticleCardProps {
  blogId: number
  blogHandle: string
  layout: 'grid' | 'slider'
  articleCount: number
  articlesPerRow: number
  gap: number
}

export interface UseProductHookInput
  extends Pick<ProductListProps, 'source' | 'collectionId' | 'fixedProducts'> {
  isDesignMode: boolean
}

export interface ProductSkeletonProps {
  productCount: number
  imageAspectRatio: AspectRatio
}

export interface CollectionSkeletonProps {
  collectionCount: number
  imageAspectRatio: AspectRatio
}
export interface ArticleSkeletonProps {
  articleCount: number
  imageAspectRatio: AspectRatio
}

export interface ProductDetailsProps extends WeaverseElementProps {
  productId: number | 'default'
  productHandle: string // For generating product liquid data in SSR
  useDefaultProduct: boolean
  product?: WeaverseResourcePickerData
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProductInfoProps extends WeaverseElementProps {}

export type ProductMediaSize = 'small' | 'medium' | 'large'
export type AspectRatio = 'auto' | '1/1' | '3/4' | '4/3'

export interface ProductMediaProps extends WeaverseElementProps {
  mediaSize: ProductMediaSize
  aspectRatio: AspectRatio
  fallbackImage: string
  allowFullscreen: boolean
  thumbnailSlidePerView: number
}
export interface ProductImageHooksInput {
  context: ProductContextType | null
  thumbnailSlidePerView: number
  onSlideChanged?: (slider: KeenSliderInstance) => void
  onSliderCreated?: (slider: KeenSliderInstance) => void
  ResizePlugin: KeenSliderPlugin
}
export interface ProductMediaArrowsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
}
export interface ProductMediaDotsProps {
  currentSlide: number
  instanceRef: React.MutableRefObject<KeenSliderInstance | null>
}
export interface ProductImageProps
  extends React.DOMAttributes<HTMLImageElement> {
  image: ShopifyProductImage
  width: number
  className?: string
}

export interface MediaFullscreenSliderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ShopifyProductImage[]
}

export interface ProductTitleProps extends WeaverseElementProps {
  htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  clickAction: 'none' | 'goToProductPage'
}

export interface ProductDescriptionProps extends WeaverseElementProps {
  lineClamp: number
  showViewDetailsButton: boolean
  viewDetailsText: string
  viewDetailsClickAction: 'viewDetails' | 'goToProductPage'
  isInsideProductQuickView: boolean
}

export interface ProductDescriptionViewDetailsProps {
  viewDetailsText: string
  children: React.ReactNode
}

export interface ProductVendorProps extends WeaverseElementProps {
  showLabel: boolean
  labelText: string
  clickAction: 'none' | 'openLink'
  openInNewTab: boolean
}

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
  showComparePriceFirst: boolean
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
  showTooltip: boolean
  hideUnavailableOptions: boolean
}
export interface CombinedVariantProps {
  context: ProductContextType
}
export interface OptionValuesProps
  extends Pick<ProductVariantProps, 'showTooltip' | 'hideUnavailableOptions'> {
  product: ShopifyProduct
  option: ShopifyProductOption
  type: OptionDisplayType
  selectedValue: string | null | undefined
  selectedOptions: string[]
  onSelect: (position: number, value: string) => void
}

// Form
export interface FormElementProps extends WeaverseElementProps {
  formType: string
  fields: FormField[]
  submitText: string
  submitPosition: 'left' | 'right' | 'center'
  openInNewTab: boolean
  targetLink: string
}

export type FormFieldType = 'text' | 'email' | 'multiline'
export interface FormField {
  id: string
  type: FormFieldType
  placeholder: string
  showLabel: boolean
  label: string
  name?: string
  required: boolean
}

export interface FieldProps {
  field: FormField
  formId: string
}
export interface CollectionContextProps {
  [key: string]: any
}
export interface CustomHTMLProps extends WeaverseElementProps {
  content: string
}

export interface ThirdPartyProps extends WeaverseElementProps {
  snippet_code: string
  information: unknown
  placeholder: {
    name: string
    content: string
  }
}

export type Hotspot = {
  id: string
  productId: number | null
  productHandle: string
  offsetX: number
  offsetY: number
}

export interface HotspotsProps extends WeaverseElementProps {
  image: string
  aspectRatio: AspectRatio
  icon: WeaverseIcon
  color: 'light' | 'dark'
  hotspots: Hotspot[]
}

declare global {
  interface Window {
    createWeaverseStudioBridge: (weaverse: WeaverseShopify) => void
    weaverseShopifyConfigs: ShopifyGlobalConfigs
    weaverseShopifyProducts: Record<number, ShopifyProduct>
    weaverseShopifyProductsByCollection: Record<number, number[]>
    weaverseShopifyCollections: Record<number, ShopifyCollection>
    weaverseShopifyArticlesByBlog: Record<number, number[]>
    weaverseShopifyArticles: Record<number, ShopifyArticle>
    weaverseCartHelpers: WeaverseCartHelpers
    weaverseSlideshowInstances: Record<string, KeenSliderInstance>
  }
}
