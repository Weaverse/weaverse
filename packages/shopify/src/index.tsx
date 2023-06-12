import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { Weaverse, WeaverseRoot } from '@weaverse/react'
import React, { useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { useStudio } from './hooks/use-studio'
import { registerThirdPartyElement } from '~/utils/register-integration'
import type { ThirdPartyIntegration } from '~/types/shopify'
import { initUploadCareAdaptiveDelivery } from './utils/uploadcare'

export * from '@weaverse/react'
export * from './types'
export * from './types/configs'
export * from './types/shopify'
export * from './utils/fetch-project-data'

let createRootContext = (configs: WeaverseType) => new Weaverse(configs)
class ShopifyWeaverse extends Weaverse {
  thirdPartyIntegration = [] as ThirdPartyIntegration[]
  constructor() {
    super()
  }
}

interface ShopifyWeaverseType extends WeaverseType {
  thirdPartyIntegration?: ThirdPartyIntegration[]
}

function createWeaverseShopifyContext(configs: ShopifyWeaverseType) {
  let context = createRootContext(configs) as ShopifyWeaverse
  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })

  registerThirdPartyElement(context, configs)

  return context
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="wv-error-boundary">
      <p>Something went wrong :(</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reload frame</button>
    </div>
  )
}

function ShopifyRoot({ context }: WeaverseRootPropsType) {
  useStudio(context)
  useEffect(() => {
    initUploadCareAdaptiveDelivery(context.weaverseHost)
  }, [])
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => context.triggerUpdate()}
    >
      <WeaverseRoot context={context} />
    </ErrorBoundary>
  )
}

export {
  ShopifyRoot,
  createWeaverseShopifyContext,
  ShopifyWeaverse,
  ShopifyWeaverseType,
}
