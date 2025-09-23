---
"@weaverse/react": patch
"@weaverse/hydrogen": patch
---

Fix dependency issue by moving react-router dependent code to Hydrogen package

## 🔧 Dependency Fix

- **FIXED**: Moved `useWeaverseDataContext` and related functionality from `@weaverse/react` to `@weaverse/hydrogen`
- **FIXED**: Resolved build errors where React package tried to import `react-router` without it being a dependency
- **IMPROVED**: Made React package truly router-agnostic by using generic `DataContext` type
- **MAINTAINED**: All exports now available from `@weaverse/hydrogen` where `react-router` is properly installed

## 🎯 Package Structure

### @weaverse/react (Router-agnostic)
- ✅ `replaceContentDataConnectors()`
- ✅ `replaceContentDataConnectorsDeep()`  
- ✅ Generic `DataContext` type
- ✅ Core React utilities

### @weaverse/hydrogen (Router-aware)  
- ✅ `useWeaverseDataContext()`
- ✅ `createWeaverseDataContext()`
- ✅ `WeaverseDataContext` type
- ✅ All React exports + Hydrogen-specific features

## 📦 Usage Impact
No breaking changes - all functionality remains available from `@weaverse/hydrogen` as intended.