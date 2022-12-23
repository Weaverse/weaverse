import type { WeaverseElementProps } from '@weaverse/react'
import type { KeenSliderInstance } from 'keen-slider'
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
  className?: string
}

export interface ProductCardButtonsProps
  extends Pick<
    ProductCardProps,
    'showViewDetailsButton' | 'viewDetailsButtonText' | 'showQuickViewButton'
  > {
  product: ShopifyProduct
}

export interface ProductListProps
  extends WeaverseElementProps,
    ProductCardProps {
  source: 'recommended' | 'recentlyView' | 'collection' | 'fixedProducts'
  collectionId: number
  collectionHandle: string
  productIds: number[]
  layout: 'grid' | 'slider'
  productCount: number
  productsPerRow: number
  gap: number
}

export interface ProductDetailsProps extends WeaverseElementProps {
  productId: number | 'default'
  productHandle: string // For generating product liquid data in SSR
  useDefaultProduct: boolean
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

export interface FieldProps {
  field: FormFieldProps
  formId: string
}

export interface CustomHTMLProps extends WeaverseElementProps {
  content: string
}

export * from './shopify'
export * from './configs'

declare global {
  interface Window {
    weaverseShopifyConfigs: ShopifyGlobalConfigs
    weaverseShopifyProducts: Record<number, ShopifyProduct>
    weaverseShopifyProductsByCollection: Record<number, number[]>
    weaverseShopifyCollections: Record<number, ShopifyCollection>
    weaverseShopifyArticles: Record<number, ShopifyArticle>
    weaverseShopifyBlogs: Record<number, ShopifyArticle>
    weaverseCartHelpers: WeaverseCartHelpers
  }
}
