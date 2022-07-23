import { WeaverseElementProps } from '@weaverse/react'

// Product
export type Product = {
  id: number
  title: string
  body_html: string
  vendor: string
  handle: string
}

export type ProductContextProps = {
  product?: Product
  productId?: string | number
}

export interface ProductBoxProps extends WeaverseElementProps {
  productId: number
  productHandle?: string
}

// Form
export interface FormElementProps extends WeaverseElementProps {
  formType: string
  fields: FormField[]
  button: FormSubmitButton
}

export type FormField = {
  id: number
  type: 'text' | 'email' | 'multiline'
  placeholder: string
  showLabel: boolean
  label: string
  required: boolean
}

export type FormSubmitButton = {
  text: string
  position: 'flex-start' | 'flex-end' | 'center'
  openInNewTab: boolean
  targetLink: string
}
