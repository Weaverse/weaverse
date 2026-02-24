# Translation System API Specification

This document outlines the architecture, database schema, and API endpoints for the new Translation Manager system. This system is designed to manage translations independently of the core item data, allowing for non-destructive localization.

## 1. Database Schema

The system uses a dedicated `Translation` table to store localized content.

```prisma
model Translation {
  id              String   @id @default(uuid())
  
  // The ID of the item (e.g., Section, Block, Element) being translated
  itemId          String
  
  // The target language code (e.g., 'fr', 'vi', 'en-US')
  // Should ideally match ISO standards or shop locale codes
  language        String
  
  // The specific data path within the item to translate
  // Example: "data.content", "data.settings.heading", "data.buttons[0].label"
  key             String
  
  // The original value at the time of translation (for reference/stale checks)
  originalValue   String?  @db.Text
  
  // The translated content
  translatedValue String   @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([itemId, language, key])
  @@index([itemId, language])
}
```

## 2. Key Concepts

- **Standalone Storage**: Translations are NOT stored in the `Item.data` JSON structure. They are stored separately in the `Translation` table.
- **Path-Based Lookup**: The `key` field represents the object path within the item's data. This allows the SDK to map translations back to the correct property at runtime.
- **Non-Destructive**: The original item data remains in the default language. Translations are applied as an overlay or "mask" over the original data during rendering or preview.

## 3. API Endpoints

### 3.1. Scan & Load Translations
Retrieves translatable content for a page and optionally merges existing translations.

- **Endpoint**: `GET /api/translation/scan`
- **Query Parameters**:
  - `pageId`: (Required) ID of the page to scan.
  - `language`: (Optional) If provided, merges existing translations into the response.

**Response**:
```json
{
  "pageId": "...",
  "availableLanguages": ["fr", "de"], // Languages that have existing translations
  "content": [
    {
      "itemId": "element-123",
      "key": "data.content",
      "value": "Hello World",       // Current value in Item.data
      "path": "data.content",
      "translatedValue": "Bonjour"  // Present if 'language' param was provided
    }
  ]
}
```

### 3.2. Apply/Save Translations
Persists selected translations to the database.

- **Endpoint**: `POST /api/translation/apply`
- **Body**:
```json
{
  "language": "fr",
  "translations": [
    {
      "itemId": "element-123",
      "key": "data.content",
      "value": "Bonjour le monde",      // New translated value
      "originalValue": "Hello World"    // Original value for reference
    }
  ]
}
```

### 3.3. Preview Translations
Returns the page data with translations applied in-memory. Useful for WYSIWYG editing or previewing without saving to `Item.data`.

- **Endpoint**: `GET /api/translation/preview`
- **Query Parameters**:
  - `pageId`: (Required)
  - `language`: (Required)

**Response**:
Returns the full page object (or project data) where `items` have their text content replaced by the values found in the `Translation` table (or matched via logic).

### 3.4. Auto-Translate
Helper endpoint to generate translations using AI.

- **Endpoint**: `POST /api/translation/translate`
- **Body**:
```json
{
  "content": "Hello World",
  "targetLocale": "fr"
}
```
**Response**: `{ "translated": "Bonjour le monde" }`

## 4. SDK Integration Guide

To support this system in the SDK/Runtime:

1.  **Fetching Data**: When loading a page for a specific locale, the SDK should:
    *   Fetch the standard Page/Item data.
    *   Fetch the associated records from the `Translation` table for the requested `language` and page `itemIds`.
2.  **Applying Translations**:
    *   Iterate through the fetched items.
    *   For each item, check if there are matching entries in the loaded Translations.
    *   Use the `key` (path) to find the property in the item's data and replace it with `translatedValue`.
    *   *Note: Deep merging or path setting utility (like lodash `set`) is needed to handle nested keys like `data.settings.title`.*
3.  **Fallback**: If no translation exists for a specific key/language, render the original value from `Item.data`.
