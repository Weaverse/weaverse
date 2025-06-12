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

// Test validate schema
function testValidateSchema() {
  console.log('Testing validate schema...')
  let schema = createSchema({
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
  if (result.success) {
    console.log('✓ Schema validated successfully')
  } else {
    console.log('✗ Schema validation failed')
    console.log('Issues:', result.issues)
  }
}

// Test range input configs preservation
function testRangeInputConfigs() {
  console.log('Testing range input configs preservation...')

  // Test with all range config properties
  const rangeInputFull = {
    type: 'range',
    name: 'padding',
    label: 'Padding',
    configs: {
      min: 0,
      max: 100,
      step: 5,
      unit: 'px',
    },
  }

  const fullResult = BasicInputSchema.safeParse(rangeInputFull)

  if (
    fullResult.success &&
    JSON.stringify(fullResult.data.configs) ===
      JSON.stringify(rangeInputFull.configs)
  ) {
    console.log('✓ Range input with all configs properties preserved correctly')
  } else {
    console.log('✗ Range input configs not preserved properly')
    console.log('Expected:', rangeInputFull.configs)
    console.log(
      'Received:',
      fullResult.success ? fullResult.data.configs : 'FAILED',
    )
  }

  // Test with partial range config properties
  const rangeInputPartial = {
    type: 'range',
    name: 'margin',
    label: 'Margin',
    configs: {
      min: 0,
      max: 50,
    },
  }

  const partialResult = BasicInputSchema.safeParse(rangeInputPartial)

  if (
    partialResult.success &&
    JSON.stringify(partialResult.data.configs) ===
      JSON.stringify(rangeInputPartial.configs)
  ) {
    console.log(
      '✓ Range input with partial configs properties preserved correctly',
    )
  } else {
    console.log('✗ Range input partial configs not preserved properly')
    console.log('Expected:', rangeInputPartial.configs)
    console.log(
      'Received:',
      partialResult.success ? partialResult.data.configs : 'FAILED',
    )
  }

  // Test with invalid range configs
  const rangeInputInvalid = {
    type: 'range',
    name: 'size',
    label: 'Size',
    configs: {
      min: 'invalid', // Should be number
      max: 100,
    },
  }

  const invalidResult = BasicInputSchema.safeParse(rangeInputInvalid)

  if (!invalidResult.success) {
    const hasConfigsError = invalidResult.error.issues.some(
      (issue) => issue.path.includes('configs') && issue.path.includes('min'),
    )
    if (hasConfigsError) {
      console.log('✓ Range input with invalid configs properly rejected')
    } else {
      console.log(
        '✗ Range input validation should have failed on invalid configs',
      )
    }
  } else {
    console.log(
      '✗ Range input with invalid configs should have failed validation',
    )
  }
}

// Test select input configs preservation
function testSelectInputConfigs() {
  console.log('Testing select input configs preservation...')

  const selectInput = {
    type: 'select',
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

  if (
    result.success &&
    JSON.stringify(result.data.configs) === JSON.stringify(selectInput.configs)
  ) {
    console.log('✓ Select input configs preserved correctly')
  } else {
    console.log('✗ Select input configs not preserved properly')
    console.log('Expected:', selectInput.configs)
    console.log('Received:', result.success ? result.data.configs : 'FAILED')
  }
}

// Test toggle group input configs preservation
function testToggleGroupInputConfigs() {
  console.log('Testing toggle group input configs preservation...')

  const toggleInput = {
    type: 'toggle-group',
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

  if (
    result.success &&
    JSON.stringify(result.data.configs) === JSON.stringify(toggleInput.configs)
  ) {
    console.log('✓ Toggle group input configs preserved correctly')
  } else {
    console.log('✗ Toggle group input configs not preserved properly')
    console.log('Expected:', toggleInput.configs)
    console.log('Received:', result.success ? result.data.configs : 'FAILED')
  }
}

// Test input helpers with configs
function testInputHelpersWithConfigs() {
  console.log('Testing input helpers with configs...')

  // Test range helper
  const rangeInput = inputHelpers.range('spacing', 'Spacing', {
    min: 0,
    max: 200,
    step: 10,
    unit: 'rem',
  })

  const rangeResult = BasicInputSchema.safeParse(rangeInput)

  if (
    rangeResult.success &&
    rangeResult.data.type === 'range' &&
    rangeResult.data.name === 'spacing' &&
    JSON.stringify(rangeResult.data.configs) ===
      JSON.stringify({ min: 0, max: 200, step: 10, unit: 'rem' })
  ) {
    console.log('✓ Range input helper with configs works correctly')
  } else {
    console.log('✗ Range input helper with configs failed')
    console.log('Expected configs:', {
      min: 0,
      max: 200,
      step: 10,
      unit: 'rem',
    })
    console.log(
      'Received configs:',
      rangeResult.success ? rangeResult.data.configs : 'FAILED',
    )
  }

  // Test select helper
  const selectInput = inputHelpers.select('variant', 'Button Variant', [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ])

  const selectResult = BasicInputSchema.safeParse(selectInput)

  if (
    selectResult.success &&
    selectResult.data.type === 'select' &&
    Array.isArray((selectResult.data.configs as any)?.options)
  ) {
    console.log('✓ Select input helper with configs works correctly')
  } else {
    console.log('✗ Select input helper with configs failed')
  }
}

// Test complete schema validation with mixed inputs
function testSchemaWithMixedInputs() {
  console.log('Testing complete schema with mixed input types...')

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

  if (result.success) {
    const rangeInput = result.data.settings?.[0]?.inputs[0]
    const selectInput = result.data.settings?.[0]?.inputs[1]
    const toggleInput = result.data.settings?.[0]?.inputs[2]

    const rangeConfigsMatch =
      JSON.stringify(rangeInput?.configs) ===
      JSON.stringify({
        min: 0,
        max: 100,
        step: 5,
        unit: 'px',
      })

    const selectConfigsMatch =
      JSON.stringify(selectInput?.configs) ===
      JSON.stringify({
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
      })

    const toggleConfigsMatch =
      JSON.stringify(toggleInput?.configs) ===
      JSON.stringify({
        options: [
          { label: 'Grid', value: 'grid', icon: 'grid-icon' },
          { label: 'List', value: 'list' },
        ],
      })

    if (rangeConfigsMatch && selectConfigsMatch && toggleConfigsMatch) {
      console.log(
        '✓ Complete schema with mixed input types preserves all configs correctly',
      )
    } else {
      console.log('✗ Some configs not preserved in complete schema validation')
      console.log('Range configs match:', rangeConfigsMatch)
      console.log('Select configs match:', selectConfigsMatch)
      console.log('Toggle configs match:', toggleConfigsMatch)
    }
  } else {
    console.log('✗ Complete schema validation failed')
    console.log('Issues:', result.issues)
  }
}

// Test individual configs schemas
function testIndividualConfigsSchemas() {
  console.log('Testing individual configs schemas...')

  // Test RangeInputConfigsSchema
  const rangeConfigs = { min: 0, max: 100, step: 5, unit: 'px' }
  const rangeResult = RangeInputConfigsSchema.safeParse(rangeConfigs)

  if (
    rangeResult.success &&
    JSON.stringify(rangeResult.data) === JSON.stringify(rangeConfigs)
  ) {
    console.log('✓ RangeInputConfigsSchema validation works correctly')
  } else {
    console.log('✗ RangeInputConfigsSchema validation failed')
  }

  // Test SelectInputConfigsSchema
  const selectConfigs = {
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ],
  }
  const selectResult = SelectInputConfigsSchema.safeParse(selectConfigs)

  if (
    selectResult.success &&
    JSON.stringify(selectResult.data) === JSON.stringify(selectConfigs)
  ) {
    console.log('✓ SelectInputConfigsSchema validation works correctly')
  } else {
    console.log('✗ SelectInputConfigsSchema validation failed')
  }

  // Test ToggleGroupConfigsSchema
  const toggleConfigs = {
    options: [
      { label: 'Grid', value: 'grid', icon: 'grid-icon' },
      { label: 'List', value: 'list' },
    ],
  }
  const toggleResult = ToggleGroupConfigsSchema.safeParse(toggleConfigs)

  if (
    toggleResult.success &&
    JSON.stringify(toggleResult.data) === JSON.stringify(toggleConfigs)
  ) {
    console.log('✓ ToggleGroupConfigsSchema validation works correctly')
  } else {
    console.log('✗ ToggleGroupConfigsSchema validation failed')
  }
}

// Run all tests
function runConfigsValidationTests() {
  console.log('Running configs validation tests...\n')

  testValidateSchema()
  testRangeInputConfigs()
  testSelectInputConfigs()
  testToggleGroupInputConfigs()
  testInputHelpersWithConfigs()
  testSchemaWithMixedInputs()
  testIndividualConfigsSchemas()

  console.log('\n✓ All configs validation tests completed!')
}

runConfigsValidationTests()
