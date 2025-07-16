import { describe, expect, it } from 'vitest'
import {
  BasicInputSchema,
  ElementSchema,
  isValidSchema,
  parseSchema,
  SchemaBuilder,
  type SchemaType,
  validateSchema,
  z,
} from '../src/index'

describe('Zod v4 Upgrade Tests', () => {
  describe('Zod v4 Import', () => {
    it('should successfully import Zod v4', () => {
      expect(z).toBeDefined()
      expect(typeof z.string).toBe('function')
      expect(typeof z.object).toBe('function')
      expect(typeof z.discriminatedUnion).toBe('function')
    })

    it('should support Zod v4 discriminated unions', () => {
      const discriminatedSchema = z.discriminatedUnion('type', [
        z.object({ type: z.literal('component'), name: z.string() }),
        z.object({ type: z.literal('section'), title: z.string() }),
      ])

      const componentResult = discriminatedSchema.safeParse({
        type: 'component',
        name: 'test-component',
      })

      expect(componentResult.success).toBe(true)
      if (componentResult.success) {
        expect(componentResult.data.type).toBe('component')
        expect((componentResult.data as any).name).toBe('test-component')
      }
    })
  })

  describe('Enhanced Schema Validation', () => {
    it('should validate schemas with improved performance', () => {
      const testSchema: SchemaType = {
        title: 'Test Component',
        type: 'test-component',
        settings: [
          {
            group: 'General',
            inputs: [
              {
                type: 'text',
                name: 'title',
                label: 'Title',
                defaultValue: 'Default Title',
              },
            ],
          },
        ],
      }

      const result = validateSchema(testSchema)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.title).toBe('Test Component')
        expect(result.data.type).toBe('test-component')
        expect(result.data.settings).toHaveLength(1)
      }
    })

    it('should provide enhanced error reporting', () => {
      const invalidSchema = {
        title: '', // Too short
        type: 'invalid-type-with-spaces and special chars!',
        settings: [],
      }

      const result = validateSchema(invalidSchema)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.issues).toBeDefined()
        expect(result.issues.length).toBeGreaterThan(0)

        // Check for specific validation issues
        const titleIssue = result.issues.find(
          (issue) => issue.path && issue.path.includes('title')
        )
        expect(titleIssue).toBeDefined()
      }
    })

    it('should support parseSchema with Zod v4', () => {
      const validSchema = {
        title: 'Parse Test',
        type: 'parse-test',
        settings: [
          {
            group: 'Settings',
            inputs: [
              {
                type: 'text' as const,
                name: 'test',
                label: 'Test',
              },
            ],
          },
        ],
      }

      expect(() => parseSchema(validSchema)).not.toThrow()
      const parsed = parseSchema(validSchema)
      expect(parsed.title).toBe('Parse Test')
    })

    it('should support isValidSchema type guard', () => {
      const validSchema = {
        title: 'Type Guard Test',
        type: 'type-guard-test',
      }

      const invalidSchema = {
        title: '', // Invalid
        type: 'valid-type',
      }

      expect(isValidSchema(validSchema)).toBe(true)
      expect(isValidSchema(invalidSchema)).toBe(false)
    })
  })

  describe('Schema Builder with Zod v4', () => {
    it('should build schemas using the enhanced builder', () => {
      const schema = new SchemaBuilder()
        .title('Builder Test')
        .type('builder-test')
        .limit(5)
        .settings([
          {
            group: 'General',
            inputs: [
              {
                type: 'text',
                name: 'title',
                label: 'Title',
              },
            ],
          },
        ])
        .build()

      expect(schema.title).toBe('Builder Test')
      expect(schema.type).toBe('builder-test')
      expect(schema.limit).toBe(5)
      expect(schema.settings).toHaveLength(1)
    })

    it('should validate schemas during build process', () => {
      const builder = new SchemaBuilder()
        .title('Validation Test')
        .type('validation-test')

      // Test that the builder can create a valid schema
      expect(() => builder.build()).not.toThrow()
      const schema = builder.build()
      expect(schema.title).toBe('Validation Test')
    })
  })

  describe('Input Schema Validation', () => {
    it('should validate basic input schemas', () => {
      const textInput = {
        type: 'text',
        name: 'testInput',
        label: 'Test Input',
        defaultValue: 'default',
      }

      const result = BasicInputSchema.safeParse(textInput)
      expect(result.success).toBe(true)
    })

    it('should validate complex input configurations', () => {
      const selectInput = {
        type: 'select',
        name: 'selectInput',
        label: 'Select Input',
        configs: {
          options: [
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2' },
          ],
        },
      }

      const result = BasicInputSchema.safeParse(selectInput)
      expect(result.success).toBe(true)
    })

    it('should validate range input configurations', () => {
      const rangeInput = {
        type: 'range',
        name: 'rangeInput',
        label: 'Range Input',
        configs: {
          min: 0,
          max: 100,
          step: 1,
          unit: 'px',
        },
      }

      const result = BasicInputSchema.safeParse(rangeInput)
      expect(result.success).toBe(true)
    })
  })

  describe('Element Schema Validation', () => {
    it('should validate complete element schemas', () => {
      const elementSchema = {
        title: 'Complete Element',
        type: 'complete-element',
        limit: 3,
        settings: [
          {
            group: 'Content',
            inputs: [
              {
                type: 'text',
                name: 'headline',
                label: 'Headline',
                defaultValue: 'Default Headline',
              },
              {
                type: 'richtext',
                name: 'description',
                label: 'Description',
              },
            ],
          },
          {
            group: 'Style',
            inputs: [
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Background Color',
              },
              {
                type: 'range',
                name: 'padding',
                label: 'Padding',
                configs: {
                  min: 0,
                  max: 100,
                  step: 5,
                  unit: 'px',
                },
              },
            ],
          },
        ],
        enabledOn: {
          pages: ['INDEX', 'PRODUCT'],
          groups: ['body'],
        },
        presets: {
          children: [
            {
              type: 'hero-banner',
              title: 'Hero Banner',
            },
          ],
        },
      }

      const result = ElementSchema.safeParse(elementSchema)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.title).toBe('Complete Element')
        expect(result.data.settings).toHaveLength(2)
        expect(result.data.settings?.[0].inputs).toHaveLength(2)
        expect(result.data.settings?.[1].inputs).toHaveLength(2)
      }
    })

    it('should validate element schemas with child types', () => {
      const elementWithChildren = {
        title: 'Parent Element',
        type: 'parent-element',
        childTypes: ['child-one', 'child-two', 'child-three'],
        settings: [
          {
            group: 'Layout',
            inputs: [
              {
                type: 'select',
                name: 'layout',
                label: 'Layout Type',
                configs: {
                  options: [
                    { label: 'Grid', value: 'grid' },
                    { label: 'Flex', value: 'flex' },
                  ],
                },
              },
            ],
          },
        ],
      }

      const result = ElementSchema.safeParse(elementWithChildren)
      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.childTypes).toEqual([
          'child-one',
          'child-two',
          'child-three',
        ])
      }
    })
  })

  describe('Performance Improvements', () => {
    it('should parse schemas efficiently', () => {
      const start = performance.now()

      // Parse multiple schemas to test performance
      for (let i = 0; i < 100; i++) {
        const schema = {
          title: `Performance Test ${i}`,
          type: `performance-test-${i}`,
          settings: [
            {
              group: 'General',
              inputs: [
                {
                  type: 'text' as const,
                  name: 'field1',
                  label: 'Field 1',
                },
              ],
            },
          ],
        }

        const result = validateSchema(schema)
        expect(result.success).toBe(true)
      }

      const duration = performance.now() - start
      console.log(`Parsed 100 schemas in ${duration.toFixed(2)}ms`)

      // Should complete in reasonable time (under 1 second)
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain compatibility with existing schemas', () => {
      // Test with 'inspector' field (deprecated but supported)
      const legacySchema = {
        title: 'Legacy Schema',
        type: 'legacy-schema',
        inspector: [
          {
            group: 'Legacy Group',
            inputs: [
              {
                type: 'text' as const,
                name: 'legacyField',
                label: 'Legacy Field',
              },
            ],
          },
        ],
      }

      const result = validateSchema(legacySchema)
      expect(result.success).toBe(true)
    })

    it('should support mixed inspector and settings', () => {
      const mixedSchema = {
        title: 'Mixed Schema',
        type: 'mixed-schema',
        inspector: [
          {
            group: 'Inspector Group',
            inputs: [
              {
                type: 'text' as const,
                name: 'inspectorField',
                label: 'Inspector Field',
              },
            ],
          },
        ],
        settings: [
          {
            group: 'Settings Group',
            inputs: [
              {
                type: 'text' as const,
                name: 'settingsField',
                label: 'Settings Field',
              },
            ],
          },
        ],
      }

      const result = validateSchema(mixedSchema)
      expect(result.success).toBe(true)
    })
  })
})
