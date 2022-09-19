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
  product?: Product
  productId?: string | number
  formId?: string
  variantId: number
  variantPosition: number
  onChangeVariant: (id: number) => void
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
  showThumbnails: boolean
  thumbnailPosition: 'top' | 'right' | 'bottom' | 'left' | undefined
  showBullets: boolean
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
