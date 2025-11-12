---
"@weaverse/hydrogen": patch
---

refactor(hydrogen): Optimize WeaverseClient for maintainability, type safety, and performance

**Key Improvements:**

- Enhanced type safety by leveraging isValidSchema from @weaverse/schema package
- Improved error handling with graceful fallback for invalid API responses
- Added comprehensive test suite with 19 tests covering multi-project architecture
- Performance optimizations: O(1) component lookups, cached URL parsing, WeakMap memoization
- Better code organization with extracted helper methods reducing cognitive complexity
- Structured error handling with WeaverseError class and error codes

**Breaking Changes:**

- Constructor now throws immediately on invalid projectId (fail-fast validation)
- Migration: Wrap WeaverseClient instantiation in try/catch to handle configuration errors

**Fixes:**

- Restored fallback page behavior when API responses are invalid, allowing Studio Preview to load
- Removed unused zod dependency in favor of @weaverse/schema validation
- Improved error context preservation in production debugging
