import { describe, expectTypeOf, it } from 'vitest'
import type {
  ComponentAvailabilityContext,
  ComponentGroup,
  CreateHydrogenSchemaOptions,
  HydrogenComponentSchema,
  Resolvable,
} from '../src'

describe('Hydrogen component availability types', () => {
  it('should_export_component_availability_types', () => {
    // Arrange
    let enabled: Resolvable<boolean, ComponentAvailabilityContext> = ({
      page,
      group,
    }) => page.handle === 'freebies/essential' && group === 'body'
    let options: CreateHydrogenSchemaOptions = {
      title: 'Availability Test',
      type: 'availability-test',
      enabled,
    }
    let schema: HydrogenComponentSchema = options

    // Act
    let schemaEnabled = schema.enabled

    // Assert
    expectTypeOf<ComponentGroup>().toEqualTypeOf<'body' | 'header' | 'footer'>()
    expectTypeOf(schemaEnabled).toEqualTypeOf<
      Resolvable<boolean, ComponentAvailabilityContext> | undefined
    >()
  })
})
