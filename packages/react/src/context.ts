import type { WeaverseType } from '@weaverse/core'
import { Weaverse } from '@weaverse/core'
import { createContext } from 'react'
import { Elements } from './elements'

export let createRootContext = (configs: WeaverseType) => {
  let rootContext = new Weaverse(configs)
  // Register the element components
  Object.keys(Elements).forEach((key) => {
    rootContext.registerElement(Elements[key])
  })
  return rootContext
}

export let WeaverseContext = createContext<Weaverse>({} as Weaverse)
export let WeaverseContextProvider = WeaverseContext.Provider
export let WeaverseContextConsumer = WeaverseContext.Consumer
