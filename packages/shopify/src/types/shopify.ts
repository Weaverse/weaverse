import type {
  ElementCatalog,
  ElementFlags,
  ElementInspector,
  GridSize,
  ParentType,
  ToolbarAction,
} from './weaverse-shopify'

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
  compare_at_price: string | number | null
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
  price: string | number
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
  available: boolean
  options: string[]
  featured_image: ShopifyProductImage
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

export type OptionKey = 'option1' | 'option2' | 'option3'

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
  featured_image: string
  aspect_ratio: number
  selected_or_first_available_variant: ShopifyProductVariant
  has_only_default_variant: boolean
  price: string | number
  price_max: string | number
  price_min: string | number
  price_varies: boolean
  compare_at_price: string | number
  compare_at_price_max: string | number
  compare_at_price_min: string | number
  compare_at_price_varies: boolean
  url: string
  // Recommendation props
  media?: ShopifyProductImage[]
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
  image: string | ShopifyCollectionImage | null
  products_count: number
  published_at: string
  published_scope: string
  sort_order: string
  template_suffix: string | null
  title: string
  updated_at: string
  // Liquid props
  url: string
  featured_image: string | ShopifyCollectionImage | null
}

export interface ShopifyArticleImage {
  created_at: string
  height: number
  src: string
  updated_at?: string
  width: number
  alt: string | null
}

export interface ShopifyObjectMetafield {
  key: string
  namespace: string
  value: string | number
  value_type: 'string' | 'integer'
  description: string | null
}

export interface ShopifyArticle {
  author: string
  blog_id: number
  body_html: string
  created_at: string
  id: number
  handle: string
  image: string | ShopifyArticleImage | null
  metafields: ShopifyObjectMetafield[]
  published: boolean
  published_at: string
  summary_html: string | null
  tags: string
  template_suffix: string | null
  title: string
  updated_at: string
  user_id: number
  // Liquid props
  url: string
  excerpt: string | null
}

// 3rd Integration

type InformationThirdParty = {
  developer: string
  image: string
  rating: number
  description: string
  available?: string
  hyperlink: string
}

type CatalogThirdParty = {
  title: string
  type: string
  extraData?: Record<string, unknown>
  inspector?: ElementInspector
  flags?: ElementFlags
  parentTypes?: ParentType[]
  toolbar?: (ToolbarAction | ToolbarAction[])[]
  gridSize?: GridSize
  catalog?: ElementCatalog
}

export interface ThirdPartyIntegration {
  appType?: string
  id?: string
  name?: string
  information?: InformationThirdParty
  elements: CatalogThirdParty[]
  order?: number
}
