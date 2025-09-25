import { useMatches, type UIMatch } from 'react-router'

// Route-keyed data structure interfaces
export interface RouteKeyedDataContext {
  root?: Record<string, unknown>
  [routeKey: `routes/${string}`]: Record<string, unknown>
}

// Flat route-keyed data context: {root: {...}, "routes/xxx": {...}}
export type WeaverseDataContext = RouteKeyedDataContext & Record<string, unknown>

/**
 * Creates flat route-keyed structure from matches
 * Target: {root: {...rootData}, "routes/product": {...productData}}
 * Eliminates all duplication by using route IDs as keys
 */
function createFlatDataContext(matches: UIMatch<unknown, unknown>[]): WeaverseDataContext {
  const context: WeaverseDataContext = {}
  
  // Process matches from root to leaf, creating route-keyed structure
  for (const match of matches) {
    if (match.data && typeof match.data === 'object') {
      // Use route ID as key (e.g., "root", "routes/product")
      context[match.id] = match.data
    }
  }
  
  return context
}

/**
 * Hook to get flat route-keyed data context from matches
 * Returns: {root: {...}, "routes/xxx": {...}}
 * No more useLoaderData dependency - everything comes from matches
 */
export function useWeaverseDataContext(): WeaverseDataContext {
  const matches = useMatches()
  
  // Create flat route-keyed structure - eliminates duplication
  return createFlatDataContext(matches)
}

/**
 * Helper function to create flat route-keyed data context from useMatches() result
 * Returns: {root: {...}, "routes/xxx": {...}}
 */
export function createWeaverseDataContext(matches: UIMatch<unknown, unknown>[]): WeaverseDataContext {
  // Create flat route-keyed structure - clean and efficient
  return createFlatDataContext(matches)
}

/**
 * Type guard to check if data is WeaverseDataContext (simplified)
 */
export function isWeaverseDataContext(data: unknown): data is WeaverseDataContext {
  return data !== null && typeof data === 'object'
}