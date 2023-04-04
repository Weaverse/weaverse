import elements from './elements'
import type { WeaverseRootPropsType, WeaverseType } from '@weaverse/react'
import { createRootContext, WeaverseRoot } from '@weaverse/react'
import React from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { useStudio } from './hooks/use-studio'

export * from '@weaverse/react'
export * from './types'
export * from './types/configs'
export * from './types/shopify'
export * from './utils/fetch-project-data'

function createWeaverseShopifyContext(configs: WeaverseType) {
  let context = createRootContext(configs)
  Object.keys(elements).forEach((key) => {
    context.registerElement(elements[key])
  })
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
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => context.triggerUpdate()}
    >
      <WeaverseRoot context={context} />
    </ErrorBoundary>
  )
}

export { ShopifyRoot, createWeaverseShopifyContext }
