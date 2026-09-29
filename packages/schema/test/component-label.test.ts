import { describe, expect, it, vi } from 'vitest'
import { type SchemaType, schemaBuilder, validateSchema } from '../src'

describe('component label', () => {
  it('should_preserve_label_callback_without_executing_it', () => {
    let label = vi.fn((data: Record<string, unknown>) => String(data.heading))
    let componentSchema: SchemaType = { title: 'Tile', type: 'tile', label }

    let result = validateSchema(componentSchema)

    expect({
      label: result.success ? result.data.label : undefined,
      invocationCount: label.mock.calls.length,
    }).toEqual({ label, invocationCount: 0 })
  })

  it('should_reject_label_when_value_is_not_a_function', () => {
    let componentSchema = { title: 'Tile', type: 'tile', label: 'Tile' }

    let result = validateSchema(componentSchema)

    expect(result.success).toBe(false)
  })

  it('should_set_label_when_using_schema_builder', () => {
    let label = (data: Record<string, unknown>) => String(data.heading)

    let result = schemaBuilder({ title: 'Tile', type: 'tile' })
      .label(label)
      .buildUnsafe()

    expect(result.label).toBe(label)
  })
})
