import { describe, expect, it, vi } from 'vitest'
import {
  ComponentManifestSchema,
  componentManifestJsonSchema,
  generateComponentManifest,
} from '../src/manifest'

describe('component manifest', () => {
  it('should_generate_canonical_artifact_when_components_are_unsorted', async () => {
    // Arrange
    let components = [
      {
        schema: { type: 'rich-text', title: 'Rich text' },
      },
      {
        schema: { type: 'hero', title: 'Hero' },
        loader: () => Promise.resolve(null),
      },
    ]

    // Act
    let artifact = await generateComponentManifest(components, {
      source: {
        name: 'pilot',
        revision: 'abc123',
        version: '1.0.0',
      },
    })

    // Assert
    expect(artifact).toEqual({
      manifest: {
        version: 1,
        source: {
          name: 'pilot',
          revision: 'abc123',
          version: '1.0.0',
        },
        components: [
          {
            type: 'hero',
            title: 'Hero',
            hasLoader: true,
          },
          {
            type: 'rich-text',
            title: 'Rich text',
            hasLoader: false,
          },
        ],
      },
      json: `{
  "version": 1,
  "source": {
    "name": "pilot",
    "revision": "abc123",
    "version": "1.0.0"
  },
  "components": [
    {
      "type": "hero",
      "title": "Hero",
      "hasLoader": true
    },
    {
      "type": "rich-text",
      "title": "Rich text",
      "hasLoader": false
    }
  ]
}
`,
      hash: 'sha256:c9fa04094770566e4e6c8530b351a88a7c5be83ef2dc14fc86b2ec0f99b655a1',
    })
  })

  it('should_omit_default_when_setting_is_sensitive', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'integration',
          title: 'Integration',
          settings: [
            {
              group: 'Integration',
              inputs: [
                {
                  type: 'text',
                  name: 'apiKey',
                  label: 'API key',
                  defaultValue: 'secret',
                  sensitive: true,
                },
                {
                  type: 'text',
                  name: 'heading',
                  defaultValue: 'Hello',
                },
              ],
            },
          ],
        },
      },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect(manifest.components[0]?.settings).toEqual([
      {
        group: 'Integration',
        inputs: [
          {
            type: 'text',
            name: 'apiKey',
            label: 'API key',
            sensitive: true,
          },
          {
            type: 'text',
            name: 'heading',
            defaultValue: 'Hello',
          },
        ],
      },
    ])
  })

  it('should_mark_dynamic_rules_without_executing_them', async () => {
    // Arrange
    let enabled = vi.fn(() => true)
    let condition = vi.fn(() => true)
    let components = [
      {
        schema: {
          type: 'dynamic',
          title: 'Dynamic',
          enabled,
          settings: [
            {
              group: 'Content',
              inputs: [
                {
                  type: 'text',
                  name: 'heading',
                  condition,
                },
              ],
            },
          ],
        },
      },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect({
      availability: manifest.components[0]?.availability,
      condition: manifest.components[0]?.settings?.[0]?.inputs[0]?.condition,
      enabledCalls: enabled.mock.calls.length,
      conditionCalls: condition.mock.calls.length,
    }).toEqual({
      availability: { enabled: { dynamic: true } },
      condition: { dynamic: true },
      enabledCalls: 0,
      conditionCalls: 0,
    })
  })

  it('should_reject_duplicate_component_types', async () => {
    // Arrange
    let components = [
      { schema: { type: 'hero', title: 'Hero' } },
      { schema: { type: 'hero', title: 'Hero duplicate' } },
    ]

    // Act
    let result = generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    await expect(result).rejects.toThrow('Duplicate component type: hero')
  })

  it('should_reject_invalid_component_schema', async () => {
    // Arrange
    let components = [{ schema: { type: 'hero', title: 'H' } }]

    // Act
    let result = generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    await expect(result).rejects.toThrow(
      'Invalid component schema at components[0]'
    )
  })

  it('should_include_static_contract_fields_in_author_defined_array_order', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'container',
          title: 'Container',
          childTypes: ['second', 'first'],
          limit: 2,
          enabled: true,
          enabledOn: {
            pages: ['PRODUCT', 'CUSTOM'],
            groups: ['footer', 'body'],
          },
          presets: {
            zIndex: 2,
            align: 'center',
            children: [{ type: 'second', text: 'Child' }],
          },
        },
        examples: [{ zIndex: 3, align: 'start' }],
      },
      { schema: { type: 'second', title: 'Second' } },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect(manifest.components[0]).toEqual({
      type: 'container',
      title: 'Container',
      hasLoader: false,
      childTypes: ['second', 'first'],
      limit: 2,
      availability: {
        enabled: true,
        pages: ['PRODUCT', 'CUSTOM'],
        groups: ['footer', 'body'],
      },
      presets: {
        align: 'center',
        children: [{ text: 'Child', type: 'second' }],
        zIndex: 2,
      },
      examples: [{ align: 'start', zIndex: 3 }],
    })
  })

  it('should_reject_non_json_setting_default_with_path', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'invalid-default',
          title: 'Invalid default',
          settings: [
            {
              group: 'Content',
              inputs: [
                {
                  type: 'text',
                  name: 'heading',
                  defaultValue: Symbol('invalid'),
                },
              ],
            },
          ],
        },
      },
    ]

    // Act
    let result = generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    await expect(result).rejects.toThrow(
      'Non-JSON value at components[0].settings[0].inputs[0].defaultValue'
    )
  })

  it('should_omit_sensitive_values_from_presets_and_examples', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'integration',
          title: 'Integration',
          settings: [
            {
              group: 'Integration',
              inputs: [
                { type: 'text', name: 'apiKey', sensitive: true },
                { type: 'text', name: 'heading' },
              ],
            },
          ],
          presets: { apiKey: 'secret', heading: 'Preset heading' },
        },
        examples: [{ apiKey: 'secret', heading: 'Example heading' }],
      },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect({
      presets: manifest.components[0]?.presets,
      examples: manifest.components[0]?.examples,
    }).toEqual({
      presets: { heading: 'Preset heading' },
      examples: [{ heading: 'Example heading' }],
    })
  })

  it('should_recursively_omit_sensitive_values_from_examples', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'integration',
          title: 'Integration',
          settings: [
            {
              group: 'Integration',
              inputs: [{ type: 'text', name: 'apiKey', sensitive: true }],
            },
          ],
        },
        examples: [
          {
            data: { apiKey: 'secret', heading: 'Example heading' },
            blocks: [{ apiKey: 'nested-secret', heading: 'Nested heading' }],
          },
        ],
      },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect(manifest.components[0]?.examples).toEqual([
      {
        data: { heading: 'Example heading' },
        blocks: [{ heading: 'Nested heading' }],
      },
    ])
  })

  it('should_omit_sensitive_values_from_nested_child_presets', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'parent',
          title: 'Parent',
          presets: {
            children: [
              { type: 'child', apiKey: 'secret', heading: 'Child heading' },
            ],
          },
        },
      },
      {
        schema: {
          type: 'child',
          title: 'Child',
          settings: [
            {
              group: 'Integration',
              inputs: [{ type: 'text', name: 'apiKey', sensitive: true }],
            },
          ],
        },
      },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect(manifest.components[1]?.presets).toEqual({
      children: [{ heading: 'Child heading', type: 'child' }],
    })
  })

  it('should_generate_identical_bytes_for_equivalent_inputs', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'hero',
          title: 'Hero',
          presets: { zIndex: 2, align: 'center' },
        },
      },
    ]

    // Act
    let first = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123', version: '1.0.0' },
    })
    let second = await generateComponentManifest(components, {
      source: { version: '1.0.0', revision: 'abc123', name: 'pilot' },
    })

    // Assert
    expect({ json: first.json, hash: first.hash }).toEqual({
      json: second.json,
      hash: second.hash,
    })
  })

  it('should_expose_runtime_and_json_schema_for_version_one', async () => {
    // Arrange
    let { manifest } = await generateComponentManifest(
      [{ schema: { type: 'hero', title: 'Hero' } }],
      { source: { name: 'pilot', revision: 'abc123' } }
    )

    // Act
    let result = ComponentManifestSchema.safeParse(manifest)

    // Assert
    expect({
      valid: result.success,
      id: componentManifestJsonSchema.$id,
      includesVersion: JSON.stringify(componentManifestJsonSchema).includes(
        '"const":1'
      ),
    }).toEqual({
      valid: true,
      id: 'https://weaverse.io/schemas/component-manifest/v1.json',
      includesVersion: true,
    })
  })

  it('should_reject_unknown_root_manifest_property', () => {
    // Arrange
    let manifest = {
      version: 1,
      source: { name: 'pilot', revision: 'abc123' },
      components: [],
      unknown: true,
    }

    // Act
    let result = ComponentManifestSchema.safeParse(manifest)

    // Assert
    expect(result.success).toBe(false)
  })

  it('should_reject_unknown_nested_manifest_property', () => {
    // Arrange
    let manifest = {
      version: 1,
      source: { name: 'pilot', revision: 'abc123' },
      components: [
        {
          type: 'hero',
          title: 'Hero',
          hasLoader: false,
          settings: [
            {
              group: 'Content',
              inputs: [{ type: 'text', name: 'heading', unknown: true }],
            },
          ],
        },
      ],
    }

    // Act
    let result = ComponentManifestSchema.safeParse(manifest)

    // Assert
    expect(result.success).toBe(false)
  })

  it('should_reject_unregistered_nested_preset_type', async () => {
    // Arrange
    let components = [
      {
        schema: {
          type: 'parent',
          title: 'Parent',
          presets: {
            children: [{ type: 'missing-child', apiKey: 'secret' }],
          },
        },
      },
    ]

    // Act
    let result = generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    await expect(result).rejects.toThrow(
      'Unknown preset child type at components[0].presets.children[0]: missing-child'
    )
  })

  it('should_sort_component_types_by_utf16_code_unit', async () => {
    // Arrange
    let components = [
      { schema: { type: 'ä', title: 'Accented' } },
      { schema: { type: 'z', title: 'Zed' } },
    ]

    // Act
    let { manifest } = await generateComponentManifest(components, {
      source: { name: 'pilot', revision: 'abc123' },
    })

    // Assert
    expect(manifest.components.map(({ type }) => type)).toEqual(['z', 'ä'])
  })

  it('should_preserve_own_proto_key_in_free_form_json', async () => {
    // Arrange
    let example = Object.create(null)
    Object.defineProperty(example, '__proto__', {
      value: 'preserved',
      enumerable: true,
    })

    // Act
    let artifact = await generateComponentManifest(
      [{ schema: { type: 'hero', title: 'Hero' }, examples: [example] }],
      { source: { name: 'pilot', revision: 'abc123' } }
    )

    // Assert
    expect(artifact.json).toContain('"__proto__": "preserved"')
  })

  it('should_reject_empty_source_revision', async () => {
    // Arrange
    let components = [{ schema: { type: 'hero', title: 'Hero' } }]

    // Act
    let result = generateComponentManifest(components, {
      source: { name: 'pilot', revision: '' },
    })

    // Assert
    await expect(result).rejects.toThrow('Invalid component manifest')
  })
})
