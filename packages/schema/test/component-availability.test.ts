import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import {
  type ComponentAvailabilityContext,
  type ComponentGroup,
  createSchemaTypeSafe,
  ElementSchema,
  mergeSchemas,
  type PageType,
  type Resolvable,
  SchemaRegistry,
  type SchemaType,
  type SchemaTypeStrict,
  schemaBuilder,
  validateSchema,
} from '../src'

describe('component availability', () => {
  it.each([
    true,
    false,
  ])('should_preserve_boolean_enabled_when_value_is_%s', (enabled) => {
    // Arrange
    let componentSchema = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled,
    }

    // Act
    let result = validateSchema(componentSchema)

    // Assert
    expect(result.success && result.data.enabled).toBe(enabled)
  })

  it('should_preserve_callback_enabled_without_executing_it', () => {
    // Arrange
    let enabled = vi.fn(
      ({ page, group }: ComponentAvailabilityContext) =>
        page.type === 'CUSTOM' && group === 'body'
    )
    let componentSchema: SchemaType = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled,
    }

    // Act
    let result = ElementSchema.safeParse(componentSchema)

    // Assert
    expect({
      enabled: result.success ? result.data.enabled : undefined,
      invocationCount: enabled.mock.calls.length,
    }).toEqual({ enabled, invocationCount: 0 })
  })

  it('should_infer_the_documented_callback_context', () => {
    // Arrange
    let componentSchema: SchemaType = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled: ({ page, group }) => {
        expectTypeOf(page).toEqualTypeOf<{
          id: string
          type: PageType
          handle: string
          locale: string
        }>()
        expectTypeOf(group).toEqualTypeOf<ComponentGroup>()
        return page.handle === 'freebies/essential' && group === 'body'
      },
    }

    // Act
    let enabled = componentSchema.enabled

    // Assert
    expectTypeOf(enabled).toEqualTypeOf<
      Resolvable<boolean, ComponentAvailabilityContext> | undefined
    >()
  })

  it('should_reject_invalid_scalar_enabled', () => {
    // Arrange
    let componentSchema = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled: 'yes',
    }

    // Act
    let result = validateSchema(componentSchema)

    // Assert
    expect(result.success).toBe(false)
  })

  it.each([
    false,
    ({ page }: ComponentAvailabilityContext) => page.type === 'CUSTOM',
  ])('should_preserve_enabled_from_schema_builder', (enabled) => {
    // Arrange
    let builder = schemaBuilder()
      .title('Availability Test')
      .type('availability-test')

    // Act
    let componentSchema = builder.enabled(enabled).buildUnsafe()

    // Assert
    expect(componentSchema.enabled).toBe(enabled)
  })

  it('should_support_enabled_in_strict_schema_helpers', () => {
    // Arrange
    let enabled = ({ page }: ComponentAvailabilityContext) =>
      page.handle === 'freebies/essential'
    let strictSchema: SchemaTypeStrict = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled,
    }

    // Act
    let componentSchema = createSchemaTypeSafe(strictSchema)

    // Assert
    expect(componentSchema.enabled).toBe(enabled)
  })

  it('should_preserve_callback_when_registering_component_schema', () => {
    // Arrange
    let enabled = vi.fn(() => true)
    let componentSchema: SchemaType = {
      title: 'Availability Test',
      type: 'availability-registration-test',
      enabled,
    }
    let registry = new SchemaRegistry()

    // Act
    registry.register('availability-registration-test', componentSchema)
    let registeredSchema = registry.get('availability-registration-test')

    // Assert
    expect({
      enabled: registeredSchema?.enabled,
      invocationCount: enabled.mock.calls.length,
    }).toEqual({ enabled, invocationCount: 0 })
  })

  it('should_preserve_last_enabled_override_when_merging_schemas', () => {
    // Arrange
    let enabled = ({ page }: ComponentAvailabilityContext) =>
      page.handle === 'freebies/essential'
    let baseSchema: SchemaType = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled: true,
    }

    // Act
    let disabledSchema = mergeSchemas(baseSchema, { enabled: false })
    let callbackSchema = mergeSchemas(disabledSchema, { enabled })

    // Assert
    expect([disabledSchema.enabled, callbackSchema.enabled]).toEqual([
      false,
      enabled,
    ])
  })
})
