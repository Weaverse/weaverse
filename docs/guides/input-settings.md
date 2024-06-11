---
title: Input Settings
description: Input settings to allow section components customizable via Weaverse Theme Customizer.
publishedAt: September 27, 2023
updatedAt: January 17, 2024
order: 5
published: true
---

## Anatomy

**Input** allows developers to specify a set of configurations that merchants can adjust to customize a component. Each
setting provides a specific control, from simple text inputs to complex selectors.

Input settings are generally composed of standard attributes. We can classify them into two main categories:

- [Basic Inputs](/docs/guides/input-settings#basic-inputs)

- [Resource Picker Inputs](/docs/guides/input-settings#resource-picker-inputs)

#### Overview

A quick look at an `input` configs type:

```tsx
type Input = {
  type: InputType
  name: string
  defaultValue: string | number | boolean | Partial<WeaverseImage>
  label?: string
  placeholder?: string
  configs?: AdditionalInputConfigs
  condition?: string
  helpText?: string
}
```

#### Attributes Details

Here's a breakdown of the available attributes in an input setting:

| Attribute      | Type                                                 | Description                                                                                                           | Required |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| `type`         | `InputType`                                          | Specifies the kind of UI control the merchant will interact with.                                                     | ✅       |
| `name`         | `string`                                             | The key of the value in the component's data. E.g., "title" binds to `component.data.title`.                          | ✅       |
| `defaultValue` | `string` \| `number` \| `boolean` \| `WeaverseImage` | Sets initial values for inputs and initial data for the component.                                                    | ➖       |
| `label`        | `string`                                             | A label for the input to show in the Weaverse Studio's Inspector                                                      | ➖       |
| `placeholder`  | `string`                                             | A placeholder text to show when the input is empty.                                                                   | ➖       |
| `configs`      | `AdditionalInputConfigs`                             | Additional options for inputs require more configuration. (Available for `select`, `toggle-group`, and `range` input) | ➖       |
| `condition`    | `string`                                             | Only displays the input if the specified condition matches.                                                           | ➖       |
| `helpText`     | `string`                                             | Provides additional information or instructions for the input setting (**HTML** format supported).                    | ➖       |

- `condition`

  The **`condition`** attribute enables developers to define conditions under which an input will be displayed. It
  supports the following operators:

- **`eq`**: equals

- **`ne`**: not equals

- **`gt`**: greater than

- **`gte`**: greater than or equal to

- **`lt`**: less than

- **`lte`**: less than or equal to

  The format is as follows: **`bindingName.conditionalOperator.value`**.

  **Examples**:

  - `clickAction.eq.openLink` - Displays the input if the **`clickAction`** is set to **`openLink`**.

  - `imagesPerRow.gt.1` - Displays the input if the number of **`imagesPerRow`** is greater than 1.

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

  <img alt="example" src="https://downloads.intercomcdn.com/i/o/853117817/24e20664c5cc4668c0a7a4ca/image.png" width="300"/>

## Basic Inputs

#### `text`

The text input allows merchants to enter a single line of plain text. It's frequently used for capturing headings,
button text, or short promotional messages.

**Return**: `string` - The inputted text value.

**Example:**

```txt
{
  type: "text",
  label: "Heading",
  name: "heading",
  defaultValue: "Testimonials",
  placeholder: "Enter section heading",
}
```

**Output:**

<img alt='text_attribute_example' src="https://downloads.intercomcdn.com/i/o/853523424/b36bfc7fe1d4cc5e95953423/image.png" width="300"/>

#### `textarea`

The textarea input provides a multi-line text box suitable for longer descriptions, like testimonials, user reviews, or
shipping and return policies.

**Return**: `string` - The inputted multiline text value.

**Example:**

```txt
{
  type: "textarea",
  label: "Customer testimonial",
  name: "customerTestimonial",
  defaultValue: "The shipping was fast, and the packaging was eco-friendly. I love shopping here!",
  placeholder: "Share customer shopping experience..."
}
```

**Output:**

<img alt="textarea_attribute_example" src="https://downloads.intercomcdn.com/i/o/853526819/4cd07fba93f159e18ec1c671/image.png" width="300"/>
#### `switch`

The switch input provides a toggle option. This can be useful for enabling or disabling product availability,
promotional features, or customer reviews.

**Return**: `boolean` - Indicates whether the switch is turned on (**`true`**) or off (**`false`**).

**Example:**

```txt
{
  type: "switch",
  label: "Enable discount",
  name: "enableDiscount",
  defaultValue: true,
}
```

**Output:**

<img alt="switch_attribute_example" src="https://downloads.intercomcdn.com/i/o/853527375/2de182c3854357176a717e51/image.png" width="300"/>

#### `range`

The range input lets merchants select a value within a set range. This can be used for adjusting quantities, setting
percentages, or customizing display sizes.

**Return**: `number` - The selected value within the defined range.

**Example:**

```txt
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

<img alt="range_attr_example" src="https://downloads.intercomcdn.com/i/o/853529726/f21af857ecba39099bd8fca6/image.png" width="300"/>

**`configs` details:**

| Property | Type     | Description                                                                                   | Required |
| -------- | -------- | --------------------------------------------------------------------------------------------- | -------- |
| `min`    | `number` | The minimum value the range input can have.                                                   | ✅       |
| `max`    | `number` | The maximum value the range input can have.                                                   | ✅       |
| `step`   | `number` | The intervals between values in the range.                                                    | ✅       |
| `unit`   | `string` | A unit of measure displayed next to the value (e.g., `px`, `%`). Purely for display purposes. | ➖       |

#### `select`

The select input provides a dropdown list, allowing merchants to select one option from a predefined list of options.

**Return**: `string` - The selected option's value.

**Example:**

```txt
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

<img alt="aspect_ratio_select_0" src="https://downloads.intercomcdn.com/i/o/853536003/389c8a3340b9dba42c539e73/image.png" width="300"/>

<img alt="aspect_ratio_select_1" src="https://downloads.intercomcdn.com/i/o/853536156/7ff5f0a96a77d7ef2b48f7c3/image.png" width="300"/>

`configs` **details:**

| Property  | Type                | Description                                                     | Required |
| --------- | ------------------- | --------------------------------------------------------------- | -------- |
| `options` | `Array<OptionType>` | An array containing all options. Each option must be an object. | ✅       |
| ↳ `value` | `string`            | A unique value for the option.                                  | ✅       |
| ↳ `label` | `string`            | Displayed text for the option.                                  | ✅       |

#### `toggle-group`

The toggle group input allows merchants to make a selection from a group of toggleable options (**only one choice is
allowed**).

While it functions similarly to the **`select`** input, its UI is distinct, showcasing options as toggle buttons. This
makes it particularly useful and user-friendly for cases with fewer options, allowing for a more intuitive selection
process.

**Return**: `string` - The chosen option's value.

**Example (Display as Text):**

```txt
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

<img alt="display_as_text" src="https://downloads.intercomcdn.com/i/o/853548031/e61ae5709eba893c8f58e375/image.png" width="300"/>

**Example (Display as Icon):**

```txt
{
  type: "toggle-group",
  name: "loading",
  label: "Background image loading",
  configs: {
    options: [
      {label: "Eager", value: "eager", icon: "Lightning"},
      {label: "Lazy", value: "lazy", icon: "SpinnerGap"},
    ],
  },
  defaultValue: "eager",
  helpText: 'Learn more about <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading" target="_blank" rel="noopener noreferrer">image loading strategies</a>.',
}
```

**Output:**

<img alt="display_as_icon" src="https://downloads.intercomcdn.com/i/o/853553481/2622731c03fb54b97d93cc50/image.png" width="300"/>

**`configs` details**

| Property   | Type                | Description                                                                                                                               | Required |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `options`  | `Array<OptionType>` | An array of **`OptionType`** objects. See below for the details of each property on an option.                                            | ✅       |
| ↳ `value`  | `string`            | A unique value for the option.                                                                                                            | ✅       |
| ↳ `label`  | `string`            | Displayed text for the option.                                                                                                            | ✅       |
| ↳ `icon`   | `string`            | Displayed icon for the option. When an **`icon`** is set, the **`label`** will act as its `tooltip`.                                      | ➖       |
| ↳ `weight` | `string`            | An optional weight for the icon, which can be one of the following values: `thin` \| `light` \| `regular` \| `bold` \| `fill` \| `duotone` | ➖       |

💡 **Note for icons:**

- We use [Lucide Icons](https://lucide.dev/) library for the icons.

- The value is the Icon name (e.g: [mail-search](https://lucide.dev/icons/mail-search), [bar-chart-horizontal](https://lucide.dev/icons/bar-chart-horizontal)...)

- Not all icons are supported yet. Please contact us if you need an icon that is missing from your configs.

#### `richtext`

The **`richtext`** input allows merchants to craft content using a rich text editor, providing flexibility and more
advanced text formatting options.

**Return**: `string` - A string containing rich-text (**HTML**) formatted content.

**Example:**

```txt
{
  type: "richtext",
  label: "Promotion details",
  name: "promotionDetails",
  defaultValue: "<p>We're excited to announce our <strong>limited-time</strong> savings event. From <em>October 15th to November 15th</em>, enjoy exclusive discounts and offers.</p>"
}
```

**Output:**

<img alt="richtext_output" src="https://downloads.intercomcdn.com/i/o/853955513/d0657f49a2d017ac0a01ecb1/image.png" width="300"/>

🌟 **Pro Tip**: our **`richtext`** input comes with **AI-powered** content generation capabilities, allowing merchants to
effortlessly craft top-notch content, from descriptions to promotional texts and more.

<img alt="richtext_power_ai_output" src="https://downloads.intercomcdn.com/i/o/853957251/aed40de2d47ce9e232f6f5f0/image.png" width="300"/>

#### `image`

The **`image`** input offers merchants the ability to select or upload images.

Here's how it works:

- **Media Manager**: on open, it displays the Media Manager modal with all images from
  the [Files page](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads#upload-a-file) of
  the merchant's Shopify Admin.

- **Uploading Images**: any image a merchant uploads through this input is saved to the Files page as well.

- **Enhancing SEO**: merchants can edit the alt text of the images they've uploaded.

**Return**: `object` - A **`WeaverseImage`** (type can be imported from **`@weaverse/hydrogen`** package).

**`WeaverseImage`** type definition:

```txt
type WeaverseImage = {
  id: string
  url: string
  altText: string
  width: number
  height: number
}
```

**Example:**

```txt
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

<img alt="image_attr" src="https://downloads.intercomcdn.com/i/o/854078553/0287d7d2d96404caf442954a/image.png" width="300"/>

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

let ImageGalleryItem = forwardRef<HTMLImageElement, ImageGalleryItemProps>((props, ref) => {
  let { source, ...rest } = props
  /*
      Pass the object returned from the `image` input (name it as you like, e.g., `source`)
      directly to the `data` prop of the `Image` component.
      This will automatically generate all the necessary attributes for the image element.
    */
  return <Image ref={ref} {...rest} data={source} sizes={`(min-width: 45em) 50vw, 100vw`} />
})

export default ImageGalleryItem
```

#### `color`

The **`color`** input type allows merchants to select a color using a color picker. This can be handy for design-related
settings, such as background color, text color, border color, etc.

**Return:** `string` - A color in `hex` format (e.g., **`#RRGGBB`** or **`#RRGGBBAA`** if alpha is set).
**Example:**

```txt
{
  type: "color",
  label: "Background color",
  name: "backgroundColor",
  defaultValue: "#FFFFFF",
}
```

**Output:**

<img alt="color_attr" src="https://downloads.intercomcdn.com/i/o/854847973/ec48b59238cd31ccd212ee09/image.png" width="300"/>

#### `datepicker`

The `datepicker` input type provides merchants with a way to select a specific date and time, making it ideal for
scheduling content, setting event dates, or determining promotional periods.

**Return:** `number` - A **timestamp** of the selected date and time.

**Example:**

```txt
{
  type: "datepicker",
  label: "Start date",
  name: "startDate",
  defaultValue: "2024-01-01"
}
```

**Output:**

<img alt="datapicker_attr" src="https://downloads.intercomcdn.com/i/o/855105562/73bcbd974a3b74d986450806/image.png" width="300"/>

💡 **Parsing:** The returned timestamp should be transformed into a readable date-time string, for example:

```tsx
// Get the `timestamp` from Weaverse Component props
let timestamp = 1704067200000
let date = new Date(timestamp)

// Parsing examples:
console.log(date.toISOString().split('T')[0]) // => "2024-01-01"
console.log(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })) // => "January 1, 2024"
```

#### `map-autocomplete`

The `map-autocomplete` input provides merchants with a location-based autocomplete functionality. As merchants type in
the input, a dropdown list of suggested places appears.

**Return:** `string` - The selected location or place name from the dropdown suggestions.

**Example:**

```txt
{
  type: "map-autocomplete",
  name: "address",
  label: "Business address",
  defaultValue: "San Francisco, CA"
}
```

**Output:**

<img alt="map_autocomplete_attr" src="https://downloads.intercomcdn.com/i/o/855138136/aca08efac8fecde1f5d74fa8/image.png" width="300"/>

#### `position`

The **`position`** input enables merchants to select a content alignment from a predefined subset of positions using
intuitive directional arrows.

**Return:** `string` - The selected content position from the available choices.

The position can be one of the following
values: `top left` | `top center` | `top right` | `center left` | `center center` | `center right` | `bottom left` | `bottom center` | `bottom right`

**Example:**

```txt
{
  type: "position",
  name: "contentPosition",
  label: "Content position",
  defaultValue: "center center"
}
```

**Output:**

<img alt="position_attr" src="https://downloads.intercomcdn.com/i/o/855185102/10d0807cd47ee9e9e60bc1d6/image.png" width="300"/>

## Resource Picker Inputs

#### `url`

The **`url`** input allows merchants to enter a URL or select a page from their store using the internal link picker.

**Return:** `string` - The entered URL or the selected page's URL.

**Example:**

```txt
{
  type: "url",
  label: "Button link",
  name: "buttonLink",
  defaultValue: "/products"
}
```

**Output:**

<img alt="product_attr" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/url_input.png?v=1712823900" width="300"/>

#### `product`

The **`product`** input provides merchants with an intuitive search and select interface to choose a specific product
from their store.

**Return:** `object` **-** A `WeaverseProduct` object (type can be imported from `@weaverse/hydrogen` package).

`WeaverseProduct` type definition:

```txt
type WeaverseProduct = {
  id: number
  handle: string
}
```

**Example:**

```txt
{
  type: "product",
  name: "product",
  label: "Featured product",
}

```

**Output:**

<img alt="product_attr" src="https://downloads.intercomcdn.com/i/o/856020670/e25984f0879ed95300da690b/image.png" width="300"/>

#### `product-list`

The `product-list` input provides merchants with an intuitive search and select interface to choose multiple products
from their store.

**Return:** `array` **-** An array of `WeaverseProduct` object with their respective IDs and handles.

**Example:**

```txt
{
  label: "Select products",
  name: "products",
  type: "product-list",
}
```

**Output:**

<img alt="product_list_attr" src="https://downloads.intercomcdn.com/i/o/856048741/4a8bed2630a0f1f454047e80/image.png" width="300"/>

#### `collection`

The `collection` input provides merchants with an intuitive search and select interface to choose a specific collection
from their store.

**Return:** `object` **-** A `WeaverseCollection` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```txt
{
  type: "collection",
  name: "collection",
  label: "Collection",
}
```

**Output:**

<img alt="collection_attr" src="https://downloads.intercomcdn.com/i/o/856069172/ee5a9e5e663fc816ac837127/image.png" width="300"/>

#### `collection-list`

The `collection-list` input provides merchants with an intuitive search and select interface to choose multiple
collections from their store.

**Return:** `array` **-** An array of `WeaverseCollection` object with their respective IDs and handles.

**Example:**

```txt
{
  type: "collection-list",
  name: "collections",
  label: "Select collections",
}
```

**Output:**

<img alt="collection_list_attr" src="https://downloads.intercomcdn.com/i/o/856071108/d3baad59f89283e788ce04cc/image.png" width="300"/>

#### `blog`

The `blog` input provides merchants with an intuitive search and select interface to choose a specific blog from their
store.

**Return:** `object` **-** A `WeaverseBlog` object (type can be imported from `@weaverse/hydrogen` package).

**Example:**

```txt
{
  type: "blog",
  name: "blog",
  label: "Blog",
}
```

**Output:**

<img alt="blog_attr" src="https://downloads.intercomcdn.com/i/o/856089471/83cf34f9ba89fa9043db3293/image.png" width="300"/>

## Querying Storefront Data

After using the Resource Picker inputs, you might notice that the returned data is limited, typically just the `id`
and `handle` of the selected resource. In most cases, you'll need more detailed data for your components or routes.

This is where the **Weaverse** client comes in handy. Using its **`storefront.query`** function, you can fetch the full
set of data related to your selection from [Shopify's Storefront API](https://shopify.dev/docs/api/storefront).

To learn more about how to effectively fetch and utilize data within Weaverse, refer to our dedicated section
on [Data Fetching & Caching](/docs/guides/data-fetching-and-caching#querying-storefront-data-inside-weaverses-component).

## Next Steps

Now that you have a solid understanding of Input Settings, let's learn how to render a Weaverse page in the next
article: [Rendering a Weaverse Page](/docs/guides/rendering-page).
