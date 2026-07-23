import type { z } from 'zod/v4'
import type {
  BasicInput,
  BasicInputSchema,
  ComponentPresets,
  ComponentPresetsSchema,
  ConfigsProps,
  ConfigsPropsSchema,
  ElementSchema,
  HeadingInput,
  HeadingInputSchema,
  Input,
  InputSchema,
  InputType,
  InspectorGroup,
  InspectorGroupSchema,
  inputTypeSchema,
  PageType,
  PageTypeSchema,
  RangeInputConfigs,
  RangeInputConfigsSchema,
  SchemaType,
  SelectInputConfigs,
  SelectInputConfigsSchema,
  ToggleGroupConfigs,
  ToggleGroupConfigsSchema,
} from '../src'

type MutuallyAssignable<Left, Right> = [Left] extends [Right]
  ? [Right] extends [Left]
    ? true
    : false
  : false

type Assert<Condition extends true> = Condition

export type AssertInputType = Assert<
  MutuallyAssignable<InputType, z.output<typeof inputTypeSchema>>
>
export type AssertSelectInputConfigs = Assert<
  MutuallyAssignable<
    SelectInputConfigs,
    z.output<typeof SelectInputConfigsSchema>
  >
>
export type AssertToggleGroupConfigs = Assert<
  MutuallyAssignable<
    ToggleGroupConfigs,
    z.output<typeof ToggleGroupConfigsSchema>
  >
>
export type AssertRangeInputConfigs = Assert<
  MutuallyAssignable<
    RangeInputConfigs,
    z.output<typeof RangeInputConfigsSchema>
  >
>
export type AssertConfigsProps = Assert<
  MutuallyAssignable<ConfigsProps, z.output<typeof ConfigsPropsSchema>>
>
export type AssertBasicInput = Assert<
  MutuallyAssignable<BasicInput, z.output<typeof BasicInputSchema>>
>
export type AssertHeadingInput = Assert<
  MutuallyAssignable<HeadingInput, z.output<typeof HeadingInputSchema>>
>
export type AssertInput = Assert<
  MutuallyAssignable<Input, z.output<typeof InputSchema>>
>
export type AssertInspectorGroup = Assert<
  MutuallyAssignable<InspectorGroup, z.output<typeof InspectorGroupSchema>>
>
export type AssertPageType = Assert<
  MutuallyAssignable<PageType, z.output<typeof PageTypeSchema>>
>
export type AssertComponentPresets = Assert<
  MutuallyAssignable<ComponentPresets, z.output<typeof ComponentPresetsSchema>>
>
export type AssertSchemaType = Assert<
  MutuallyAssignable<SchemaType, z.output<typeof ElementSchema>>
>

let basicInput: BasicInput = {
  type: 'text',
  name: 'title',
  condition: (data: { showTitle?: boolean }) => data.showTitle ?? true,
  defaultValue: Symbol('legacy value'),
}
let headingInput: HeadingInput = {
  type: 'heading',
  label: 'Section settings',
  customProperty: true,
}
let legacyPreset: ComponentPresets = {
  type: 'legacy-preset',
  children: [123],
}
let inspectorGroup: InspectorGroup = {
  group: 'Layout',
  inputs: [basicInput, headingInput],
}
let schema: SchemaType = {
  title: 'Type alignment',
  type: 'type-alignment',
  settings: [inspectorGroup],
  presets: { children: [legacyPreset] },
  enabled: ({ page }) => page.type === 'PRODUCT',
}

void schema
