import type { CountdownTimeKey } from '~/types/components'
import type { OptionDisplayType } from '~/types/configs'
import type { ThirdPartyIntegration } from '~/types/shopify'

export let TIMES: CountdownTimeKey[] = ['days', 'hours', 'minutes', 'seconds']
export let COUNTDOWN_KEY = 'wv-cd-evergreen-start'
export let INSTAGRAM_API = 'https://graph.instagram.com'

export let DEFAULT_OPTION_DESIGN: OptionDisplayType = 'dropdown'

export let PRODUCT_IMAGE_PLACEHOLDER =
  'https://ucarecdn.com/6a10905d-7ddb-4194-a32c-a4e4e2097019/-/preview/-/quality/smart/-/format/auto/'

export let DEFAULT_INTEGRATIONS: ThirdPartyIntegration[] = [
  {
    elements: [
      {
        type: 'dingdoong_date_picker',
        title: 'Date Picker',
      },
    ],
  },
]
