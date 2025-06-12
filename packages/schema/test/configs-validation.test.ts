import { describe, expect, it } from 'vitest'
import {
  BasicInputSchema,
  createSchema,
  inputHelpers,
  RangeInputConfigsSchema,
  type SchemaType,
  SelectInputConfigsSchema,
  ToggleGroupConfigsSchema,
  validateSchema,
} from '../src'

describe('Configs Validation Tests', () => {
  describe('Schema Validation', () => {
    it('should validate schema with mixed input configs', () => {
      const schema = createSchema({
        type: 'test-component',
        title: 'Test Component',
        settings: [
          {
            group: 'General',
            inputs: [
              {
                type: 'range',
                name: 'padding',
                label: 'Padding',
                configs: {
                  min: 0,
                  max: 100,
                },
              },
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                configs: {
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                },
              },
              {
                type: 'toggle-group',
                name: 'display',
                label: 'Display Mode',
                configs: {
                  options: [
                    { label: 'Grid', value: 'grid', icon: 'grid-icon' },
                    { label: 'List', value: 'list', icon: 'list-icon' },
                  ],
                },
              },
            ],
          },
        ],
      })

      const result = validateSchema(schema)
      expect(result.success).toBe(true)
    })
  })

  describe('Range Input Configs', () => {
    it('should preserve all range config properties', () => {
      const rangeInputFull = {
        type: 'range' as const,
        name: 'padding',
        label: 'Padding',
        configs: {
          min: 0,
          max: 100,
          step: 5,
          unit: 'px',
        },
      }

      const result = BasicInputSchema.safeParse(rangeInputFull)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.configs).toEqual(rangeInputFull.configs)
      }
    })

    it('should preserve partial range config properties', () => {
      const rangeInputPartial = {
        type: 'range' as const,
        name: 'margin',
        label: 'Margin',
        configs: {
          min: 0,
          max: 50,
        },
      }

      const result = BasicInputSchema.safeParse(rangeInputPartial)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.configs).toEqual(rangeInputPartial.configs)
      }
    })

    it('should reject invalid range configs', () => {
      const rangeInputInvalid = {
        type: 'range' as const,
        name: 'size',
        label: 'Size',
        configs: {
          min: 'invalid', // Should be number
          max: 100,
        },
      }

      const result = BasicInputSchema.safeParse(rangeInputInvalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        const hasConfigsError = result.error.issues.some(
          (issue) =>
            issue.path.includes('configs') && issue.path.includes('min'),
        )
        expect(hasConfigsError).toBe(true)
      }
    })
  })

  describe('Select Input Configs', () => {
    it('should preserve select input configs correctly', () => {
      const selectInput = {
        type: 'select' as const,
        name: 'alignment',
        label: 'Text Alignment',
        configs: {
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      }

      const result = BasicInputSchema.safeParse(selectInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.configs).toEqual(selectInput.configs)
      }
    })
  })

  describe('Toggle Group Input Configs', () => {
    it('should preserve toggle group input configs correctly', () => {
      const toggleInput = {
        type: 'toggle-group' as const,
        name: 'layout',
        label: 'Layout Type',
        configs: {
          options: [
            { label: 'Grid', value: 'grid', icon: 'grid' },
            { label: 'List', value: 'list', icon: 'list' },
          ],
        },
      }

      const result = BasicInputSchema.safeParse(toggleInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.configs).toEqual(toggleInput.configs)
      }
    })
  })

  describe('Input Helpers with Configs', () => {
    it('should work correctly with range helper', () => {
      const rangeInput = inputHelpers.range('spacing', 'Spacing', {
        min: 0,
        max: 200,
        step: 10,
        unit: 'rem',
      })

      const result = BasicInputSchema.safeParse(rangeInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('range')
        expect(result.data.name).toBe('spacing')
        expect(result.data.configs).toEqual({
          min: 0,
          max: 200,
          step: 10,
          unit: 'rem',
        })
      }
    })

    it('should work correctly with select helper', () => {
      const selectInput = inputHelpers.select('variant', 'Button Variant', [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ])

      const result = BasicInputSchema.safeParse(selectInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('select')
        expect(Array.isArray((result.data.configs as any)?.options)).toBe(true)
      }
    })
  })

  describe('Complete Schema with Mixed Inputs', () => {
    it('should preserve all configs correctly in complete schema validation', () => {
      const schema: SchemaType = {
        title: 'Test Component',
        type: 'test-component',
        settings: [
          {
            group: 'Layout',
            inputs: [
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
              {
                type: 'select',
                name: 'alignment',
                label: 'Alignment',
                configs: {
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                },
              },
              {
                type: 'toggle-group',
                name: 'display',
                label: 'Display Mode',
                configs: {
                  options: [
                    { label: 'Grid', value: 'grid', icon: 'grid-icon' },
                    { label: 'List', value: 'list' },
                  ],
                },
              },
            ],
          },
        ],
      }

      const result = validateSchema(schema)

      expect(result.success).toBe(true)
      if (result.success) {
        const rangeInput = result.data.settings?.[0]?.inputs[0]
        const selectInput = result.data.settings?.[0]?.inputs[1]
        const toggleInput = result.data.settings?.[0]?.inputs[2]

        expect(rangeInput?.configs).toEqual({
          min: 0,
          max: 100,
          step: 5,
          unit: 'px',
        })

        expect(selectInput?.configs).toEqual({
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        })

        expect(toggleInput?.configs).toEqual({
          options: [
            { label: 'Grid', value: 'grid', icon: 'grid-icon' },
            { label: 'List', value: 'list' },
          ],
        })
      }
    })
  })

  describe('Individual Configs Schemas', () => {
    it('should validate RangeInputConfigsSchema correctly', () => {
      const rangeConfigs = { min: 0, max: 100, step: 5, unit: 'px' }
      const result = RangeInputConfigsSchema.safeParse(rangeConfigs)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(rangeConfigs)
      }
    })

    it('should validate SelectInputConfigsSchema correctly', () => {
      const selectConfigs = {
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ],
      }
      const result = SelectInputConfigsSchema.safeParse(selectConfigs)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(selectConfigs)
      }
    })

    it('should validate ToggleGroupConfigsSchema correctly', () => {
      const toggleConfigs = {
        options: [
          { label: 'Grid', value: 'grid', icon: 'grid-icon' },
          { label: 'List', value: 'list' },
        ],
      }
      const result = ToggleGroupConfigsSchema.safeParse(toggleConfigs)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(toggleConfigs)
      }
    })
  })
})
