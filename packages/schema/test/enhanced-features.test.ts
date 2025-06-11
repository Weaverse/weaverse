import {
  createSchema,
  devTools,
  groupHelpers,
  inputHelpers,
  isValidSchema,
  mergeSchemas,
  parseSchema,
  type SchemaType,
  schemaBuilder,
  schemaRegistry,
  validateSchema,
} from '../src'

// Test enhanced validation
function testValidation() {
  console.log('Testing enhanced validation...')

  const invalidSchema = {
    // Missing required fields
    settings: [
      {
        group: 'Test',
        inputs: [],
      },
    ],
  }

  const result = validateSchema(invalidSchema)

  if (!result.success) {
    console.log('✓ validateSchema correctly identified invalid schema')
    console.log(`  Found ${result.issues.length} issues`)
  }

  // Test parseSchema throws
  try {
    parseSchema({ invalid: true })
    console.log('✗ parseSchema should have thrown')
  } catch {
    console.log('✓ parseSchema correctly throws on invalid schema')
  }

  // Test type guard
  const validSchema: SchemaType = {
    title: 'Test Component',
    type: 'test-component',
  }

  if (isValidSchema(validSchema) && !isValidSchema({ invalid: true })) {
    console.log('✓ isValidSchema type guard works correctly')
  }
}

// Test schema builder
function testSchemaBuilder() {
  console.log('Testing schema builder...')

  const schema = schemaBuilder()
    .title('Test Component')
    .type('test-component')
    .limit(5)
    .addSetting(groupHelpers.general([inputHelpers.text('title', 'Title')]))
    .build()

  if (
    schema.title === 'Test Component' &&
    schema.type === 'test-component' &&
    schema.limit === 5 &&
    schema.settings?.length === 1
  ) {
    console.log('✓ Schema builder creates valid schema')
  }

  // Test error handling
  try {
    schemaBuilder().build()
    console.log('✗ Builder should throw when required fields missing')
  } catch {
    console.log('✓ Builder correctly throws when required fields missing')
  }
}

// Test input helpers
function testInputHelpers() {
  console.log('Testing input helpers...')

  const textInput = inputHelpers.text('username', 'Username', {
    placeholder: 'Enter username',
    helpText: 'Your unique username',
  })

  if (
    textInput.type === 'text' &&
    textInput.name === 'username' &&
    textInput.label === 'Username'
  ) {
    console.log('✓ Text input helper works correctly')
  }

  const rangeInput = inputHelpers.range('padding', 'Padding', {
    min: 0,
    max: 100,
    step: 5,
    unit: 'px',
  })

  if (rangeInput.type === 'range' && rangeInput.configs) {
    console.log('✓ Range input helper works correctly')
  }

  const selectInput = inputHelpers.select('size', 'Size', [
    { label: 'Small', value: 'sm' },
    { label: 'Large', value: 'lg' },
  ])

  if (selectInput.type === 'select' && selectInput.configs) {
    console.log('✓ Select input helper works correctly')
  }

  const switchInput = inputHelpers.switch('visible', 'Visible', true)
  if (switchInput.type === 'switch' && switchInput.defaultValue === true) {
    console.log('✓ Switch input helper works correctly')
  }

  const headingInput = inputHelpers.heading('Advanced Settings')
  if (
    headingInput.type === 'heading' &&
    headingInput.label === 'Advanced Settings'
  ) {
    console.log('✓ Heading input helper works correctly')
  }
}

// Test group helpers
function testGroupHelpers() {
  console.log('Testing group helpers...')

  const inputs = [inputHelpers.text('test', 'Test')]

  const generalGroup = groupHelpers.general(inputs)
  const layoutGroup = groupHelpers.layout(inputs)
  const styleGroup = groupHelpers.style(inputs)
  const contentGroup = groupHelpers.content(inputs)
  const customGroup = groupHelpers.custom('Custom Group', inputs)

  if (
    generalGroup.group === 'General' &&
    layoutGroup.group === 'Layout' &&
    styleGroup.group === 'Style' &&
    contentGroup.group === 'Content' &&
    customGroup.group === 'Custom Group'
  ) {
    console.log('✓ All group helpers work correctly')
  }
}

// Test schema composition
function testSchemaComposition() {
  console.log('Testing schema composition...')

  const baseSchema = createSchema({
    title: 'Base',
    type: 'base',
    settings: [groupHelpers.general([inputHelpers.text('title', 'Title')])],
  })

  const extendedSchema = mergeSchemas(baseSchema, {
    title: 'Extended',
    settings: [groupHelpers.layout([inputHelpers.range('padding', 'Padding')])],
  })

  if (
    extendedSchema.title === 'Extended' &&
    extendedSchema.type === 'base' &&
    extendedSchema.settings?.length === 2
  ) {
    console.log('✓ Schema composition works correctly')
  }
}

// Test schema registry
function testSchemaRegistry() {
  console.log('Testing schema registry...')

  // Clear registry first
  schemaRegistry['schemas'].clear()

  const schema = createSchema({
    title: 'Test',
    type: 'test',
  })

  schemaRegistry.register('test-schema', schema)

  const retrieved = schemaRegistry.get('test-schema')
  const list = schemaRegistry.list()

  if (retrieved === schema && list.includes('test-schema')) {
    console.log('✓ Schema registry stores and retrieves schemas correctly')
  }

  // Test validation
  const validSchema = createSchema({
    title: 'Valid',
    type: 'valid',
  })

  const invalidSchema = { invalid: true } as any

  schemaRegistry.register('valid-schema', validSchema)
  schemaRegistry.register('invalid-schema', invalidSchema)

  const validation = schemaRegistry.validateAll()

  if (
    validation.valid.includes('valid-schema') &&
    validation.invalid.some((item) => item.name === 'invalid-schema')
  ) {
    console.log('✓ Schema registry validation works correctly')
  }
}

// Test development tools
function testDevTools() {
  console.log('Testing development tools...')

  const schema = createSchema({
    title: 'Test Component',
    type: 'test-component',
    settings: [
      groupHelpers.general([
        inputHelpers.text('title', 'Title'),
        inputHelpers.switch('visible', 'Visible'),
      ]),
      groupHelpers.style([inputHelpers.range('padding', 'Padding')]),
    ],
  })

  const analysis = devTools.analyzeSchema(schema)

  if (
    analysis.valid &&
    analysis.stats.title === 'Test Component' &&
    analysis.stats.inputCount === 3 &&
    analysis.stats.groupCount === 2
  ) {
    console.log('✓ Schema analysis works correctly')
  }

  const printed = devTools.prettyPrint(schema)
  if (
    typeof printed === 'string' &&
    printed.includes('"title": "Test Component"')
  ) {
    console.log('✓ Pretty printing works correctly')
  }

  const tsInterface = devTools.generateTypeInterface(schema)
  if (
    tsInterface.includes('interface TestComponentProps') &&
    tsInterface.includes('title: string') &&
    tsInterface.includes('visible: boolean')
  ) {
    console.log('✓ TypeScript interface generation works correctly')
  }
}

// Run all tests
function runAllTests() {
  console.log('Running enhanced features tests...\n')

  testValidation()
  testSchemaBuilder()
  testInputHelpers()
  testGroupHelpers()
  testSchemaComposition()
  testSchemaRegistry()
  testDevTools()

  console.log('\n✓ All enhanced features tests completed!')
}

runAllTests()
