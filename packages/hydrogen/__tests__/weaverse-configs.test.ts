import type { HydrogenEnv } from '@shopify/hydrogen'
import { describe, expect, it } from 'vitest'
import { getWeaverseConfigs } from '../src/utils'
import { WeaverseClient } from '../src/weaverse-client'

interface ClientWithPrivateApiUrl {
  configs: {
    projectId: string
    weaverseApiBase: string
    weaverseHost: string
  }
  getApiUrl: (endpoint: string) => string
}

describe('getWeaverseConfigs', () => {
  it('should_default_api_base_to_studio_host', () => {
    let configs = getWeaverseConfigs(
      new Request('https://example.com/products/blue-shirt'),
      { WEAVERSE_PROJECT_ID: 'project-1' } as unknown as HydrogenEnv
    )

    expect(configs.weaverseApiBase).toBe('https://studio.weaverse.io')
  })

  it('should_ignore_legacy_api_base_when_studio_host_is_configured', () => {
    let configs = getWeaverseConfigs(
      new Request('https://example.com/products/blue-shirt'),
      {
        WEAVERSE_API_BASE: 'https://legacy-api.example.com',
        WEAVERSE_HOST: 'https://studio.weaverse.io',
        WEAVERSE_PROJECT_ID: 'project-1',
      } as unknown as HydrogenEnv
    )

    expect(configs.weaverseApiBase).toBe('https://studio.weaverse.io')
  })
})

describe('WeaverseClient API URLs', () => {
  it('should_build_api_urls_from_studio_host', () => {
    let client = Object.create(
      WeaverseClient.prototype
    ) as ClientWithPrivateApiUrl
    client.configs = {
      projectId: 'project-1',
      weaverseApiBase: 'https://legacy-api.example.com',
      weaverseHost: 'https://studio.weaverse.io',
    }

    let url = client.getApiUrl('project_configs')

    expect(url).toBe('https://studio.weaverse.io/api/public/project_configs')
  })
})
