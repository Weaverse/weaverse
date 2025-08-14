---
title: Input Settings
description: Input settings to allow section components customizable via Weaverse Theme Customizer.
publishedAt: September 27, 2023
updatedAt: April 21, 2025
order: 5
published: true
---

## Anatomy

**Input** allows developers to specify a set of configurations that merchants can adjust to customize a component. Each
setting provides a specific control, from simple text inputs to complex selectors.

Input settings are generally composed of standard attributes. We can classify them into two main categories:

- [Basic Inputs](/docs/development-guide/input-settings#basic-inputs)

- [Resource Picker Inputs](/docs/development-guide/input-settings#resource-picker-inputs)

### Overview

A quick look at an `input` configs type:

```tsx
type Input = {
  type: InputType
  name: string
  label?: string
  configs?: ConfigsType
  condition?: string | ((data: ElementData, weaverse: WeaverseHydrogen) => boolean)
  defaultValue?:
    | string
    | number
    | boolean
    | Partial<WeaverseImage>
    | { [x: string]: any }
  placeholder?: string
  helpText?: string
  shouldRevalidate?: boolean
}
```

### Attributes Details

Here's a breakdown of the available attributes in an input setting:

| Attribute          | Type                                                 | Description                                                                                                           | Required |
| ------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| `type`             | `InputType`                                          | Specifies the kind of UI control the merchant will interact with.                                                     | ✅        |
| `name`             | `string`                                             | The key of the value in the component's data. E.g., "title" binds to `component.data.title`.                          | ✅        |
| `defaultValue`     | `string` \| `number` \| `boolean` \| `WeaverseImage` | Sets initial values for inputs and initial data for the component.                                                    | ➖        |
| `label`            | `string`                                             | A label for the input to show in the Weaverse Studio's settings panel                                                      | ➖        |
| `placeholder`      | `string`                                             | A placeholder text to show when the input is empty.                                                                   | ➖        |
| `configs`          | `AdditionalInputConfigs`                             | Additional options for inputs require more configuration. (Available for `select`, `toggle-group`, and `range` input) | ➖        |
| `condition`        | `string` \| `function`                               | Only displays the input if the specified condition matches. Supports both string and function-based conditions.       | ➖        |
| `helpText`         | `string`                                             | Provides additional information or instructions for the input setting (**HTML** format supported).                    | ➖        |
| `shouldRevalidate` | `boolean`                                            | Automatically revalidate the page when the input changes to apply new data from `loader` function.                    | ➖        |

- `condition`

  The **`condition`** attribute enables developers to define conditions under which an input will be displayed. It supports two formats:

  1. **Function-based conditions** (Recommended):
     ```tsx
     {
       type: 'text',
       name: 'buttonText',
       label: 'Button Text',
       condition: (data) => data.showButton === true
     }
     ```

  2. **String-based conditions** (Deprecated):
     ```tsx
     {
       type: 'text',
       name: 'buttonText',
       label: 'Button Text',
       condition: 'showButton.eq.true'
     }
     ```

  > **Note to users:** String-based conditions are deprecated. For new components, we strongly recommend using function-based conditions which offer more flexibility and better type safety.

  Function-based conditions receive the component's current data and the Weaverse instance, allowing for more complex conditional logic that can reference multiple fields or perform calculations.

- `helpText`

  The **`helpText`** attribute can utilize **HTML**, offering more expressive help instructions. This allows for the
  inclusion of links, emphasis using bold or italics, lists, and more.

  **Example**:

  ```html data-line-numbers=false
  Learn more about
  <a
    href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading"
    target="_blank"
    rel="noopener noreferrer"
    >image loading strategies</a
  >.
  ```

  Will appear as:

  ![Help text input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/help-text-input.webp?v=1743390826)

## Basic Inputs

### `heading`

The **`heading`** input type is a special input that creates a heading or section title in the settings panel. It's used to organize inputs into logical groups.

**Example:**
```tsx
{
  type: "heading",
  label: "Content Settings"
}
```

**Output:**
![Heading input type example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/heading-input.png?v=1745227001)

### `text`

The text input allows merchants to enter a single line of plain text. It's frequently used for capturing headings,
button text, or short promotional messages.

**Return**: `string` - The inputted text value.

**Example:**

```tsx
{
  type: "text",
  label: "Heading",
  name: "heading",
  defaultValue: "Testimonials",
  placeholder: "Enter section heading",
}
```

**Output:**

![Text input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/text-input.webp?v=1743407119)

### `textarea`

The textarea input provides a multi-line text box suitable for longer descriptions, like testimonials, user reviews, or
shipping and return policies.

**Return**: `string` - The inputted multiline text value.

**Example:**

```tsx
{
  type: "textarea",
  label: "Customer testimonial",
  name: "customerTestimonial",
  defaultValue: "The shipping was fast, and the packaging was eco-friendly. I love shopping here!",
  placeholder: "Share customer shopping experience..."
}
```

**Output:**

![Textarea input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/text-area-input.webp?v=1743407119)

### `switch`

The switch input provides a toggle option. This can be useful for enabling or disabling product availability,
promotional features, or customer reviews.

**Return**: `boolean` - Indicates whether the switch is turned on (**`true`**) or off (**`false`**).

**Example:**

```tsx
{
  type: "switch",
  label: "Enable discount",
  name: "enableDiscount",
  defaultValue: true,
}
```

**Output:**

![Switch input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/switch-input.webp?v=1743407119)

### `range`

The range input lets merchants select a value within a set range. This can be used for adjusting quantities, setting
percentages, or customizing display sizes.

**Return**: `number` - The selected value within the defined range.

**Example:**

```tsx
{
  type: "range",
  label: "Discount percentage",
  name: "discountPercentage",
  defaultValue: 10,
  configs: {
    min: 5,
    max: 50,
    step: 1,
    unit: "%"
  }
}
```

**Output:**

![Range input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/range-input.webp?v=1743407874)

**`configs` details:**

| Property | Type     | Description                                                                                   | Required |
| -------- | -------- | --------------------------------------------------------------------------------------------- | -------- |
| `min`    | `number` | The minimum value the range input can have.                                                   | ✅        |
| `max`    | `number` | The maximum value the range input can have.                                                   | ✅        |
| `step`   | `number` | The intervals between values in the range.                                                    | ✅        |
| `unit`   | `string` | A unit of measure displayed next to the value (e.g., `px`, `%`). Purely for display purposes. | ➖        |

### `select`

The select input provides a dropdown list, allowing merchants to select one option from a predefined list of options.

**Return**: `string` - The selected option's value.

**Example:**

```tsx
{
  type: "select",
  label: "Image aspect ratio",
  name: "imageAspectRatio",
  configs: {
    options: [
      { value: "auto", label: "Adapt to image" },
      { value: "1/1", label: "1/1" },
      { value: "3/4", label: "3/4" },
      { value: "4/3", label: "4/3" },
    ]
  },
  defaultValue: "auto"
}
```

**Output:**

![Select input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/sellect-input.webp?v=1743407118)

`configs` **details:**

| Property  | Type                | Description                                                     | Required |
| --------- | ------------------- | --------------------------------------------------------------- | -------- |
| `options` | `Array<OptionType>` | An array containing all options. Each option must be an object. | ✅        |
| ↳ `value` | `string`            | A unique value for the option.                                  | ✅        |
| ↳ `label` | `string`            | Displayed text for the option.                                  | ✅        |

### `toggle-group`

The toggle group input allows merchants to make a selection from a group of toggleable options (**only one choice is
allowed**).

While it functions similarly to the **`select`** input, its UI is distinct, showcasing options as toggle buttons. This
makes it particularly useful and user-friendly for cases with fewer options, allowing for a more intuitive selection
process.

**Return**: `string` - The chosen option's value.

**Example (Display as Text):**

```tsx
{
  type: "toggle-group",
  label: "Image aspect ratio",
  name: "imageAspectRatio",
  configs: {
    options: [
      { value: "auto", label: "Adapt to image" },
      { value: "1/1", label: "1/1" },
      { value: "3/4", label: "3/4" },
      { value: "4/3", label: "4/3" },
    ]
  },
  defaultValue: "auto"
}
```

**Output:**

![Toggle group text input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/toggle-group-input.webp?v=1743407874)

**Example (Display as Icon):**

```tsx
{
  type: "toggle-group",
  name: "loading",
  label: "Background image loading",
  configs: {
    options: [
      {label: "Eager", value: "eager", icon: "facebook"},
      {label: "Lazy", value: "lazy", icon: "github"},
    ],
  },
  defaultValue: "eager",
  helpText: 'Learn more about <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading" target="_blank" rel="noopener noreferrer">image loading strategies</a>.',
}
```

**Output:**

![Toggle group icon input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/toggle-group-icon-input.webp?v=1743407119)

**`configs` details**

| Property   | Type                | Description                                                                                                                                | Required |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `options`  | `Array<OptionType>` | An array of **`OptionType`** objects. See below for the details of each property on an option.                                             | ✅        |
| ↳ `value`  | `string`            | A unique value for the option.                                                                                                             | ✅        |
| ↳ `label`  | `string`            | Displayed text for the option.                                                                                                             | ✅        |
| ↳ `icon`   | `string`            | Displayed icon for the option. When an **`icon`** is set, the **`label`** will act as its `tooltip`.                                       | ➖        |
| ↳ `weight` | `string`            | An optional weight for the icon, which can be one of the following values: `thin` \| `light` \| `regular` \| `bold` \| `fill` \| `duotone` | ➖        |

💡 **Note for icons:**

- We use [Lucide Icons](https://lucide.dev/) library for the icons.

- The value is the Icon name (e.g: [mail-search](https://lucide.dev/icons/mail-search), [bar-chart-horizontal](https://lucide.dev/icons/bar-chart-horizontal)...)

- Not all icons are supported yet. Please contact us if you need an icon that is missing from your configs.

### `richtext`

The **`richtext`** input allows merchants to craft content using a rich text editor, providing flexibility and more
advanced text formatting options.

**Return**: `string` - A string containing rich-text (**HTML**) formatted content.

**Example:**

```tsx
{
  type: "richtext",
  label: "Promotion details",
  name: "promotionDetails",
  defaultValue: "<p>We're excited to announce our <strong>limited-time</strong> savings event. From <em>October 15th to November 15th</em>, enjoy exclusive discounts and offers.</p>"
}
```

**Output:**

![Rich text input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/rich-text-input.webp?v=1743407119)

🌟 **Pro Tip**: our **`richtext`** input comes with **AI-powered** content generation capabilities, allowing merchants to
effortlessly craft top-notch content, from descriptions to promotional texts and more.

![Rich text AI-powered input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/rich-text-ai-input.webp?v=1743407119)

### `image`

The **`image`** input offers merchants the ability to select or upload images.

Here's how it works:

- **Media Manager**: on open, it displays the Media Manager modal with all images from
  the [Files page](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads#upload-a-file) of
  the merchant's Shopify Admin.

- **Uploading Images**: any image a merchant uploads through this input is saved to the Files page as well.

- **Enhancing SEO**: merchants can edit the alt text of the images they've uploaded.

**Return**: `object` - A **`WeaverseImage`** object with the following structure:

```tsx
type WeaverseImage = {
  id: string
  url: string
  altText: string
  width: number
  height: number
  previewSrc: string
}
```

**Example:**

```tsx
{
  type: "image",
  name: "authorImage",
  label: "Author image",
  defaultValue: {
    url: "https://cdn.shopify.com/s/files/1/0669/0262/2504/files/linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg?v=1697429747",
    altText: "Man standing beside wall",
    width: 689,
    height: 1034,
  },
  /* The following `defaultValue` are acceptable as well:
     defaultValue: {
       url: "https://cdn.shopify.com/s/files/1/0669/0262/2504/files/linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg?v=1697429747",
     },
     defaultValue: "https://cdn.shopify.com/s/files/1/0669/0262/2504/files/linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg?v=1697429747",
   */
}
```

**📌 Note:** The `defaultValue` in the input configuration can either be:

- an object of the `WeaverseImage` type (where all properties are **optional** except for the `url`)

- or a `string` representing the image URL

**Output:**

![Image input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/image-input.webp?v=1743407119)

**Usage**

We highly recommend developers to utilize the [`Image`](https://shopify.dev/docs/api/hydrogen/2023-07/components/image)
component from the **`@shopify/hydrogen`** package to render images. It's optimized to work with the data returned from
the **`image`** input, ensuring efficient image delivery.

Here's a simple example:

```tsx
import { Image } from '@shopify/hydrogen'
import type { HydrogenComponentProps, WeaverseImage } from '@weaverse/hydrogen'
import { forwardRef } from 'react'

interface ImageGalleryItemProps extends HydrogenComponentProps {
  source: WeaverseImage
}

let ImageGalleryItem = forwardRef<HTMLImageElement, ImageGalleryItemProps>(
  (props, ref) => {
    let { source, ...rest } = props
    /*
      Pass the object returned from the `image` input (name it as you like, e.g., `source`)
      directly to the `data` prop of the `Image` component.
      This will automatically generate all the necessary attributes for the image element.
    */
    return (
      <Image
        ref={ref}
        {...rest}
        data={source}
        sizes={`(min-width: 45em) 50vw, 100vw`}
      />
    )
  },
)

export default ImageGalleryItem
```

### `video`

The **`video`** input offers merchants the ability to select or upload videos.

Here's how it works:

- **Media Manager**: on open, it displays the Media Manager modal with all videos from
  the [Files page](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads#upload-a-file) of the merchant's Shopify Admin.

- **Uploading Videos**: any video a merchant uploads through this input is saved to the Files page as well.

- **Enhancing SEO**: merchants can edit the alt text of the videos they've uploaded.

**Return**: `object` - A **`WeaverseVideo`** object with the following structure:

```tsx
type WeaverseVideo = {
  id: string
  url: string
  altText: string
  width: number
  height: number
  previewSrc: string
}
```

**Example:**

```tsx
{
  type: "video",
  name: "video",
  label: "Video",
},
```

**Output:**

![Video input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_video_input.png?v=1722415681)

### `color`

The **`color`** input type allows merchants to select a color using a color picker. This can be handy for design-related
settings, such as background color, text color, border color, etc.

**Return:** `string` - A color in `hex` format (e.g., **`#RRGGBB`** or **`#RRGGBBAA`** if alpha is set).
**Example:**

```tsx
{
  type: "color",
  label: "Background color",
  name: "backgroundColor",
  defaultValue: "#FFFFFF",
}
```

**Output:**

![Color input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/color-input.webp?v=1743407119)

### `datepicker`

The `datepicker` input type provides merchants with a way to select a specific date and time, making it ideal for
scheduling content, setting event dates, or determining promotional periods.

**Return:** `number` - A **timestamp** of the selected date and time.

**Example:**

```tsx
{
  type: "datepicker",
  label: "Start date",
  name: "startDate",
  defaultValue: "2024-01-01"
}
```

**Output:**

![Date picker input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/date-picker-input.webp?v=1743407119)

💡 **Parsing:** The returned timestamp should be transformed into a readable date-time string, for example:

```tsx
// Get the `timestamp` from Weaverse Component props
let timestamp = 1704067200000
let date = new Date(timestamp)

// Parsing examples:
console.log(date.toISOString().split('T')[0]) // => "2024-01-01"
console.log(
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
) // => "January 1, 2024"
```

### `map-autocomplete`

🚧 - Experimental feature, may not work as expected.

The `map-autocomplete` input provides merchants with a location-based autocomplete functionality. As merchants type in
the input, a dropdown list of suggested places appears.

**Return:** `string` - The selected location or place name from the dropdown suggestions.

**Example:**

```tsx
{
  type: "map-autocomplete",
  name: "address",
  label: "Business address",
  defaultValue: "San Francisco, CA"
}
```

**Output:**

![Map autocomplete input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/map-input.webp?v=1743407119)

### `position`

The **`position`** input enables merchants to select a content alignment from a predefined subset of positions using
intuitive directional arrows.

**Return**: `string` - The selected content position from the following allowed values:
- `top left` | `top center` | `top right`
- `center left` | `center center` | `center right`
- `bottom left` | `bottom center` | `bottom right`

**Example:**

```tsx
{
  type: "position",
  name: "contentPosition",
  label: "Content position",
  defaultValue: "center center"
}
```

**Output:**

![Position input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_position_input.png?v=1722416367)

### `swatches`

The **`swatches`** input provides merchants with a color palette selection interface, allowing them to choose from predefined color options.

**Return**: `string` - The selected color value in hex format.

**Example:**
```tsx
{
  type: "swatches",
  label: "Color palette",
  name: "colorPalette",
  configs: {
    options: [
      { value: "#FF0000", label: "Red" },
      { value: "#00FF00", label: "Green" },
      { value: "#0000FF", label: "Blue" }
    ]
  },
  defaultValue: "#FF0000"
}
```

### `blog`

The `blog` input provides merchants with an intuitive search and select interface to choose a specific blog from their store.

**Return:** `object` - A `WeaverseBlog` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```tsx
{
  type: "blog",
  name: "blog",
  label: "Blog",
}
```

**Output:**

![Blog input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/blog-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting a blog. Please use the `handle` or `id` of the selected blog to fetch the full blog data.

### `metaobject`

The **`metaobject`** input provides merchants with an intuitive search and select interface to choose a specific metaobject definition from their store.

**Return**: `object` - A **`WeaverseMetaobject`** object with the following structure:

```tsx
type WeaverseMetaobject = {
  id: number
  handle: string
}
```

**Example:**
```tsx
{
  type: "metaobject",
  name: "teamMember",
  label: "Team Member"
}
```

**Output:**
![Metaobject input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_metaobject_input.png?v=1722477096)

Similar to other resource picker inputs, when selecting a metaobject definition, the preview will automatically revalidate and run the `loader` function. Use the `handle` or `id` of the selected metaobject to fetch the full data from the Storefront API.

### `collection`

The `collection` input provides merchants with an intuitive search and select interface to choose a specific collection from their store.

**Return:** `object` - A `WeaverseCollection` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```tsx
{
  type: "collection",
  name: "collection",
  label: "Collection",
}
```

**Output:**

![Collection input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/collection-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting a collection. Please use the `handle` or `id` of the selected collection to fetch the full collection data.

### `collection-list`

The `collection-list` input provides merchants with an intuitive search and select interface to choose multiple collections from their store.

**Return:** `array` - An array of `WeaverseCollection` object with their respective IDs and handles.

**Example:**

```tsx
{
  type: "collection-list",
  name: "collections",
  label: "Select collections",
}
```

**Output:**

![Collection list input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/collection-list-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting collections. Please use the `handle` or `id` of the selected collection to fetch the full collection data.

## Querying Storefront Data

After using the Resource Picker inputs, you might notice that the returned data is limited, typically just the `id` and `handle` of the selected resource. In most cases, you'll need more detailed data for your components or routes.

This is where the **Weaverse** client comes in handy. Using its **`storefront.query`** function, you can fetch the full set of data related to your selection from [Shopify's Storefront API](https://shopify.dev/docs/api/storefront).

To learn more about how to effectively fetch and utilize data within Weaverse, refer to our dedicated section on [Data Fetching & Caching](/docs/guides/data-fetching-and-caching#querying-storefront-data-inside-weaverses-component).

## Resource Picker Inputs

### `url`

The **`url`** input allows merchants to enter a URL or select a page from their store using the internal link picker.

**Return:** `string` - The entered URL or the selected page's URL.

**Example:**

```tsx
{
  type: "url",
  label: "Button link",
  name: "buttonLink",
  defaultValue: "/products"
}
```

**Output:**

![URL input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/url_input.png?v=1712823900)

### `product`

The **`product`** input provides merchants with an intuitive search and select interface to choose a specific product from their store.

**Return:** `object` - A `WeaverseProduct` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```tsx
{
  type: "product",
  name: "product",
  label: "Featured product",
}
```

**Output:**

![Product input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/product-input.webp?v=1743407119)

When selecting a product, the preview will automatically revalidate and run the `loader` function.
The `loader` function will read the `handle` or `id` of the selected product and fetch all the product data from the Storefront API. Here's an example of how to use the `loader` function:

```tsx
// <root>/app/sections/single-product/index.tsx

export let loader = async (args: ComponentLoaderArgs<SingleProductData>) => {
  let { weaverse, data } = args
  let { storefront } = weaverse
  if (!data?.product) {
    return null
  }
  let productHandle = data.product.handle
  let { product, shop } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions: [],
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  })
  let variants = await storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  })

  return {
    product,
    variants,
    storeDomain: shop.primaryDomain.url,
  }
}
```

### `product-list`

The `product-list` input provides merchants with an intuitive search and select interface to choose multiple products from their store.

**Return:** `array` - An array of `WeaverseProduct` object with their respective IDs and handles.

**Example:**

```tsx
{
  label: "Select products",
  name: "products",
  type: "product-list",
}
```

**Output:**

![Product list input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/product-list-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting products. Please use the `handle` or `id` of the selected product to fetch the full product data.

### `collection`

The `collection` input provides merchants with an intuitive search and select interface to choose a specific collection from their store.

**Return:** `object` - A `WeaverseCollection` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```tsx
{
  type: "collection",
  name: "collection",
  label: "Collection",
}
```

**Output:**

![Collection input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/collection-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting a collection. Please use the `handle` or `id` of the selected collection to fetch the full collection data.

### `collection-list`

The `collection-list` input provides merchants with an intuitive search and select interface to choose multiple collections from their store.

**Return:** `array` - An array of `WeaverseCollection` object with their respective IDs and handles.

**Example:**

```tsx
{
  type: "collection-list",
  name: "collections",
  label: "Select collections",
}
```

**Output:**

![Collection list input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/collection-list-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting collections. Please use the `handle` or `id` of the selected collection to fetch the full collection data.

### `blog`

The `blog` input provides merchants with an intuitive search and select interface to choose a specific blog from their store.

**Return:** `object` - A `WeaverseBlog` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```tsx
{
  type: "blog",
  name: "blog",
  label: "Blog",
}
```

**Output:**

![Blog input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/blog-input.webp?v=1743407119)

Similar to the `product` input, the preview will automatically revalidate and run the `loader` function when selecting a blog. Please use the `handle` or `id` of the selected blog to fetch the full blog data.

### `metaobject`

The **`metaobject`** input provides merchants with an intuitive search and select interface to choose a specific metaobject definition from their store.

**Return**: `object` - A **`WeaverseMetaobject`** object with the following structure:

```tsx
type WeaverseMetaobject = {
  id: number
  handle: string
}
```

**Example:**
```tsx
{
  type: "metaobject",
  name: "teamMember",
  label: "Team Member"
}
```

**Output:**
![Metaobject input example](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_metaobject_input.png?v=1722477096)

Similar to other resource picker inputs, when selecting a metaobject definition, the preview will automatically revalidate and run the `loader` function. Use the `handle` or `id` of the selected metaobject to fetch the full data from the Storefront API.

## Querying Storefront Data

After using the Resource Picker inputs, you might notice that the returned data is limited, typically just the `id` and `handle` of the selected resource. In most cases, you'll need more detailed data for your components or routes.

This is where the **Weaverse** client comes in handy. Using its **`storefront.query`** function, you can fetch the full set of data related to your selection from [Shopify's Storefront API](https://shopify.dev/docs/api/storefront).

To learn more about how to effectively fetch and utilize data within Weaverse, refer to our dedicated section on [Data Fetching & Caching](/docs/guides/data-fetching-and-caching#querying-storefront-data-inside-weaverses-component).

## Next Steps

Now that you have a solid understanding of Input Settings, let's learn how to render a Weaverse page in the next article: [Rendering a Weaverse Page](/docs/guides/rendering-page).