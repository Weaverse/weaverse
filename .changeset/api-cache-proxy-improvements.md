---
"@weaverse/biome": patch
"@weaverse/cli": patch
"@weaverse/core": patch
"@weaverse/hydrogen": patch
"@weaverse/react": patch
"@weaverse/shopify": patch
---

feat: API cache proxy improvements and TypeScript fixes

#### API Cache Proxy Improvements
- **Migration to withCache.fetch**: Updated `WeaverseClient` to use Hydrogen's `withCache.fetch` instead of deprecated `withCache.run`
- **Response Structure Unification**: Standardized response formats between `directFetch` and `withCache.fetch` methods  
- **Enhanced Cache Strategy**: Improved cache key generation and response validation
- **Better Error Handling**: Added comprehensive error handling for API responses

#### TypeScript Build Fixes  
- **Interface Merging**: Fixed duplicate type declarations using proper interface merging for module augmentation
- **Window Type Declarations**: Converted type declarations to interfaces for proper global scope extension
- **Environment Variables**: Added missing environment variables to `HydrogenEnv` interface

#### Code Quality Improvements
- **Biome Configuration**: Updated to automatically remove unused variables and optimize imports
- **Removed Console Logs**: Cleaned up debug logging and unused code

This change maintains backward compatibility while improving performance and reliability of the API cache proxy system. The migration from `withCache.run` to `withCache.fetch` aligns with Shopify Hydrogen's latest recommendations.