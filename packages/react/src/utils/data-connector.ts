function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object') {
      // biome-ignore lint/nursery/noUselessUndefined: <explanation>
      return undefined
    }

    // Handle array indexing like items[0] or items[1]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch
      const arrayObj = (current as Record<string, unknown>)[arrayKey]
      if (Array.isArray(arrayObj)) {
        const indexNum = Number.parseInt(index, 10)
        if (indexNum >= 0 && indexNum < arrayObj.length) {
          return arrayObj[indexNum]
        }
      }
      // biome-ignore lint/nursery/noUselessUndefined: <explanation>
      return undefined
    }

    // Handle regular object property access
    return current !== null && key in current
      ? (current as Record<string, unknown>)[key]
      : undefined
  }, obj)
}

export function replaceContentDataConnectors(
  content: string,
  loaderData: unknown
): unknown {
  if (!loaderData) {
    return content
  }
  if (typeof content === 'string') {
    try {
      let newContent = content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const value = getNestedValue(loaderData, path.trim())
        return value !== undefined ? String(value) : match
      })
      return newContent
    } catch (error) {
      console.warn('Error processing data connectors:', error)
      return content
    }
  }

  return content
}
