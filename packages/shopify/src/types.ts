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
}

export type Product = {
  id: number
  title: string
  price: string
  image: IProductImage
  images: IProductImage[]
  variants: IProductVariant[]
  body_html: string
  description: string
  vendor: string
  handle: string
}

export type ProductContextProps = {
  product?: Product
  productId?: string | number
  formId?: string
  variantId: number
  onChangeVariant: (id: number) => void
}

export interface ProductBoxProps extends WeaverseElementProps {
  productId: number
  productHandle?: string
  optionStyles?: 'combined' | 'custom'
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
