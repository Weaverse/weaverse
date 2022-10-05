import type { WeaverseElementProps } from '@weaverse/react'

// Product
type IProductImage = {
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
  //live view
  media_type: string
  external_id: string
  preview_image: {
    src: string
  }
}

interface IProductVariant {
  barcode: string
  compare_at_price: string | null
  created_at: string
  fulfillment_service: string
  grams: number
  id: number
  image_id: number | null
  inventory_item_id: number
  inventory_management: string
  // inventory_policy: ProductVariantInventoryPolicy;
  inventory_quantity: number
  old_inventory_quantity: number
  option1: string | null
  option2: string | null
  option3: string | null
  // presentment_prices: IProductVariantPresentmentPriceSet[];
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
  // weight_unit: ProductVariantWeightUnit;

  // live view
  featured_media: { id: number }
}

interface IProductOption {
  id: number
  name: string
  position: number
  product_id: number
  values: string[]
}

export type Product = {
  id: number
  title: string
  price: string
  image: IProductImage
  images: IProductImage[]
  options: IProductOption[]
  variants: IProductVariant[]
  body_html: string
  vendor: string
  handle: string
  // live view
  featured_image: string
  media: IProductImage[]
  description: string
}

export type ProductContextProps = {
  product: Product
  productId?: string | number
  formId: string
  variantId: number
  onChangeVariant: (id: number) => void
}

export type ProductListContextProps = {
  productId?: string | number
}

export interface ProductListProps extends WeaverseElementProps {
  collectionId: number
  collectionHandle: string
  productNumber: number
  rows: number
  itemsPerSlide: number
  containerHeight: string
}

export interface ProductBoxProps extends WeaverseElementProps {
  productId: number
  productHandle?: string
  optionStyles?: 'combined' | 'custom'
}

export interface ProductTitleProps extends WeaverseElementProps {
  htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  linkProduct: boolean
}

export interface ProductImageProps extends WeaverseElementProps {
  aspectRatio: string
  showThumbnails: boolean
  thumbnailPosition: 'top' | 'right' | 'bottom' | 'left' | undefined
  showBullets: boolean
  showFullscreenButton: boolean
  showPlayButton: boolean
  showNav: boolean
}

export interface ProductAtcProps extends WeaverseElementProps {
  buttonText: string
  addingText: string
  addedText: string
  soldOutText: string
  unavailableText: string
  // cartAction: '' | 'cart'
  goToCart: boolean
}

export interface ProductVariantProps extends WeaverseElementProps {
  variantType: 'custom' | 'combined'
}

// Article
export interface ArticleListProps extends WeaverseElementProps {
  blogId: string | number
  blogHandle?: string
  itemsPerSlide: number
  articleNumber: number
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
interface IImage {
  created_at: string
  height: number
  src: string
  updated_at?: string
  width: number
  alt: string | null
}

interface Collection {
  body_html: string
  disjunctive: boolean
  handle: string
  id: number
  image?: IImage
  published_at: string
  published_scope: string
  // rules: ISmartCollectionRule[]
  // sort_order: SmartCollectionSortOrder
  template_suffix: string | null
  title: string
  updated_at: string
}

export interface CollectionBoxProps extends WeaverseElementProps {
  collectionId: number
  collectionHandle?: string
}

export type CollectionContextProps = {
  collection: Collection
  collectionId: string | number
}

// Form
export interface FormElementProps extends WeaverseElementProps {
  formType: string
  fields: FormFieldProps[]
  submitText: string
  submitPosition: 'flex-start' | 'flex-end' | 'center'
  openInNewTab: boolean
  targetLink: string
}

export type FormFieldType = 'text' | 'email' | 'multiline'
export type FormFieldProps = {
  id: number
  type: FormFieldType
  placeholder: string
  showLabel: boolean
  label: string
  required: boolean
}
