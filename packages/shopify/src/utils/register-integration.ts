import type { ThirdPartyIntegration } from '~/types/shopify'
import type { WeaverseElement } from '@weaverse/react'
import * as ThirdParty from '~/elements/third-party'
import type { ShopifyWeaverse, ShopifyWeaverseType } from '~/index'

const initElement = (integrations: ThirdPartyIntegration[]) => {
  const elements = integrations.reduce(
    (list, item) => {
      const { elements } = item
      for (let element of elements) {
        list[element.type] = {
          Component: ThirdParty.default,
          defaultCss: ThirdParty.css,
          type: element.type,
          extraData: element.extraData,
        }
      }
      return list
    },
    {} as Record<string, WeaverseElement>,
  )

  return elements
}

export const registerThirdPartyElement = (
  context: ShopifyWeaverse,
  configs: ShopifyWeaverseType,
) => {
  if (!configs.thirdPartyIntegration) {
    configs.thirdPartyIntegration = [
      {
        elements: [
          {
            type: 'dingdoong_date_picker',
            title: 'Date Picker',
          },
        ],
      },
    ]
  }

  const elements = initElement(configs.thirdPartyIntegration)

  Object.values(elements).forEach((v) => {
    context.registerElement(v)
  })
}
