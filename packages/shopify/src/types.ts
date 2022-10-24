import type { WeaverseElementProps } from '@weaverse/react'

// Product
export interface ShopifyProductImage {
  created_at: string
  id: number
  position: number
  product_id: number
  variant_ids: number[]
  src: string
  width: number
  height: number
  updated_at: string
  alt: string | null
}

export interface ShopifyProductVariant {
  barcode: string
  compare_at_price: string | null
  created_at: string
  fulfillment_service: string
  grams: number
  id: number
  image_id: number | null
  inventory_item_id: number
  inventory_management: string
  inventory_policy: ProductVariantInventoryPolicy
  inventory_quantity: number
  old_inventory_quantity: number
  option1: string | null
  option2: string | null
  option3: string | null
  presentment_prices: ShopifyProductVariantPresentmentPriceSet[]
  position: number
  price: string
  product_id: number
  requires_shipping: boolean
  sku: string
  taxable: boolean
  tax_code: string | null
  title: string
  updated_at: string
  weight: number
  weight_unit: ProductVariantWeightUnit
  // Liquid props
  featured_media?: ShopifyProductImage
}

export interface ShopifyProductVariantPresentmentPriceSet {
  price: ShopifyMoney
  compare_at_price: ShopifyMoney
}

export interface ShopifyMoney {
  amount: number | string
  currency_code: string
}

export type ProductVariantInventoryPolicy = 'deny' | 'continue'
export type ProductVariantWeightUnit = 'g' | 'kg' | 'oz' | 'lb'

export interface ShopifyProductOption {
  id: number
  name: string
  position: number
  product_id: number
  values: string[]
}

export interface ShopifyProduct {
  body_html: string
  created_at: string
  handle: string
  id: number
  image: ShopifyProductImage
  images: ShopifyProductImage[]
  options: ShopifyProductOption[]
  product_type: string
  published_at: string
  published_scope: string
  tags: string
  template_suffix: string | null
  title: string
  metafields_global_title_tag?: string
  metafields_global_description_tag?: string
  updated_at: string
  variants: ShopifyProductVariant[]
  vendor: string
  status: 'active' | 'archived' | 'draft'
  // Liquid props
  selected_or_first_available_variant?: ShopifyProductVariant
  has_only_default_variant?: boolean
}

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
  buttonText: string
  soldOutText: string
  unavailableText: string
}

export interface ProductVariantProps extends WeaverseElementProps {
  optionsStyle: 'combined' | 'custom'
}

// Article
export interface ArticleListProps extends WeaverseElementProps {
  blogId: string | number
  blogHandle: string
  itemsPerSlide: number
  articleNumber: number
  itemsSpacing: number
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

// Collection
export interface ShopifyCollectionImage {
  created_at: string
  height: number
  src: string
  updated_at?: string
  width: number
  alt: string | null
}

export interface ShopifyCollection {
  admin_graphql_api_id: string
  body_html: string
  collection_type: string
  handle: string
  id: number
  image: ShopifyCollectionImage
  products_count: number
  published_at: string
  published_scope: string
  sort_order: string
  template_suffix: string | null
  title: string
  updated_at: string
}

export interface CollectionBoxProps extends WeaverseElementProps {
  collectionId: number
  collectionHandle?: string
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
