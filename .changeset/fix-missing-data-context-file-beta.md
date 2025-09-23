---
"@weaverse/hydrogen": patch
---

Fix missing use-weaverse-data-context.ts file in Hydrogen package

## 🔧 Build Fix

- **FIXED**: Added missing `use-weaverse-data-context.ts` file to Hydrogen package
- **FIXED**: Resolved build errors where imports couldn't resolve the module
- **MAINTAINED**: All data context functionality now properly available

## 📦 Package Structure

The Hydrogen package now correctly includes:
- ✅ `useWeaverseDataContext()` hook
- ✅ `createWeaverseDataContext()` function
- ✅ `WeaverseDataContext` type
- ✅ All router-dependent functionality

## 🎯 Impact
No functional changes - this is purely a build/packaging fix to ensure the file is included in published packages.