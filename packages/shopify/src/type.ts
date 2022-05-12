import {WeaverseElementProps} from '@weaverse/react'

export type Product = {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  handle: string;
}

export type ProductContextProps = {
  product?: Product
}


export interface ProductBoxProps extends WeaverseElementProps{
  productId: number;
  productHandle?: string;
}