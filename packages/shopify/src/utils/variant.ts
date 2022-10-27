import type { ShopifyProduct, ShopifyProductVariant } from '~/types'

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param product {Object} Product JSON object
 * @param options {Array} List of submitted values (e.g. ['36', 'Black'])
 * @returns variant {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */
export function getVariantFromOptionArray(
  product: ShopifyProduct,
  options: string[]
) {
  validateProductStructure(product)
  validateOptionsArray(options)

  let result = product.variants.filter(function (variant) {
    return options.every(function (option, index) {
      let variantOptions = getVariantOptions(variant)
      return variantOptions[index] === option
    })
  })

  return result[0] || null
}

export function getVariantOptions(variant: ShopifyProductVariant) {
  if (variant.options) {
    return Array.from(variant.options)
  }
  return [variant.option1, variant.option2, variant.option3].filter(
    Boolean
  ) as string[]
}

/**
 * Check if the product data is a valid JS object
 * Error will be thrown if type is invalid
 * @param product {object} Product JSON object
 */
function validateProductStructure(product: ShopifyProduct) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.')
  }

  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(product + ' is empty.')
  }
}

/**
 * Validate the structure of the array
 * It must be formatted as list of values
 * @param options {Array} collection Array of object (e.g. ['36', 'Black'])
 */
function validateOptionsArray(options: string[]) {
  if (Array.isArray(options) && typeof options[0] === 'object') {
    throw new Error(options + 'is not a valid array of options.')
  }
}
