import type {
  BasicInput,
  HeadingInput,
  InputType,
  InspectorGroup,
  PageType,
} from '../src'

// Test that types are properly exported and can be used
const basicInput: BasicInput = {
  type: 'text',
  name: 'title',
  label: 'Title',
  placeholder: 'Enter title',
  helpText: 'This is the title',
  shouldRevalidate: false,
  condition: 'someCondition',
  defaultValue: 'Default Title',
}

const headingInput: HeadingInput = {
  type: 'heading',
  label: 'Section Settings',
  // Can have additional properties
  someExtraProperty: true,
}

const inspectorGroup: InspectorGroup = {
  group: 'Layout',
  inputs: [basicInput, headingInput],
}

const pageType: PageType = 'PRODUCT'
const inputType: InputType = 'toggle-group'

// Type assertions to ensure compatibility
export type AssertBasicInput = BasicInput extends BasicInput ? true : false
export type AssertHeadingInput = HeadingInput extends HeadingInput
  ? true
  : false
export type AssertInspectorGroup = InspectorGroup extends InspectorGroup
  ? true
  : false

console.log('Type alignment test passed!')
