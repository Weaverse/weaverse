// eslint-disable-next-line no-template-curly-in-string
let defaultMoneyFormat = '${{amount}}'

/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} format - shop `money_format` setting
 * @return {String} value - formatted value
 */
export function formatMoney(cents: string | number, format: string): string {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '')
  }
  let value: string | 0 = ''
  let placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
  let formatString = format || defaultMoneyFormat

  function formatWithDelimiters(
    number: any,
    precision = 2,
    thousands = ',',
    decimal = '.'
  ): string | 0 {
    if (Number.isNaN(number) || number == null) {
      return 0
    }

    number = (number / 100.0).toFixed(precision)

    let parts = number.split('.')
    let dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    )
    let centsAmount = parts[1] ? decimal + parts[1] : ''

    return dollarsAmount + centsAmount
  }

  // @ts-expect-error
  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2)
      break
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0)
      break
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',')
      break
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',')
      break
  }

  // @ts-expect-error
  return formatString.replace(placeholderRegex, value)
}
