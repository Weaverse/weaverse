---
title: Tutorial (20m)
description: A comprehensive guide to Weaverse, the first-ever Theme Customizer & CMS for Shopify Hydrogen.
publishedAt: March 28, 2024
updatedAt: April 11, 2024
order: 2
published: true
---

# Weaverse Hydrogen Tutorial

Welcome to this comprehensive guide on setting up a Weaverse Hydrogen project using the pre-made "Pilot" theme. This tutorial is designed to walk you through the entire process, from installation to deployment, enabling you to launch your Shopify store with a custom theme. Whether you're following along or exploring the content, this guide should take approximately 20 minutes to complete.

## Prerequisites

Before diving into this tutorial, you should have a solid understanding of the following technologies. If you're new to any of these, we recommend reviewing the linked resources first:

- [React](https://react.dev)
- [Remix](https://remix.run/docs/en/main/start/tutorial)
- [Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started)
- [Shopify Theme Architecture](https://shopify.dev/docs/themes/architecture)
- [TailwindCSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

## Getting Started

### Installing Weaverse

Begin your journey by installing Weaverse directly from the Shopify App Store. Once installed, you can access it through your Shopify Admin Dashboard. [Install Weaverse App](https://apps.shopify.com/weaverse?utm_source=tutorial)

### Creating Your Project

After installation, create a new project by clicking the "Create Project" button. The Pilot theme will be selected by default. Follow the on-screen instructions to complete your project setup.

![Create Project in Weaverse](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/create_weaverse_hydrogen_project.webp?width=1400&crop=center)

### Exploring the Theme Editor

Once your project is created, you'll have access to the theme editor where you can customize your theme, add new sections and blocks, and preview changes in real-time.
![Weaverse Studio](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Pilot_v2_4_0__Dec_06__-_Project_Editor_-_Weaverse_Hydrogen.jpg?v=1712225542)

### Setting Up Local Development

To begin local development with your Weaverse Hydrogen project, you have several options for cloning or setting up the project. The Pilot theme is available at: [Pilot Theme GitHub Repository](https://github.com/weaverse/pilot).

#### Option 1: Using Weaverse CLI

The Weaverse CLI streamlines the setup process by automatically configuring your project:

1. **Install Weaverse CLI**: Run the following command in your terminal:
   ```bash
   npx @weaverse/cli@latest create --template=pilot --project-id=<your-project-id> --project-name=<your-project-name>
   ```
   Replace `<your-project-id>` and `<your-project-name>` with your actual project details.

#### Option 2: Cloning from GitHub

Clone the GitHub repository to work with the latest version of the Pilot theme:

1. **Clone Repository**: Use the following command:
   ```bash
   git clone https://github.com/weaverse/pilot.git <your-project-name>
   ```
   Replace `<your-project-name>` with your preferred project directory name.

#### Option 3: Downloading ZIP

For those who prefer not to use Git, downloading the project as a ZIP file is a simple alternative:

1. **Download ZIP**: Visit the [Pilot theme's GitHub page](https://github.com/weaverse/pilot), click the "Code" dropdown, and select "Download ZIP".
2. **Extract Files**: Extract the ZIP file to your desired project location.

#### Option 4: Using GitHub Template

GitHub's repository template feature provides an easy way to create a new repository based on the Pilot theme:

1. **Generate from Template**: Go to the [Pilot theme's GitHub page](https://github.com/weaverse/pilot) and click "Use this template".
2. **Clone Your Repository**: After creating your repository, clone it locally:
   ```bash
   git clone <your-new-repository-url>
   ```
   Replace `<your-new-repository-url>` with your new repository's URL.

### Configuring Your Local Environment

After setting up your project, follow these steps to prepare your local development environment:

1. **Navigate to Project Directory**:
   ```bash
   cd <your-project-name>
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file in your project root
   - Install either [Headless](https://apps.shopify.com) or [Hydrogen](https://apps.shopify.com) app on your Shopify store
   - Add the following environment variables to your `.env` file:

   For demo setup with `mock.shop`:
   ```plaintext
   SESSION_SECRET="your-randomly-generated-secret"
   PUBLIC_STORE_DOMAIN="mock.shop"
   WEAVERSE_PROJECT_ID="your-weaverse-project-id"
   ```

   For real store setup:
   ```plaintext
   SESSION_SECRET="your-randomly-generated-secret"
   PUBLIC_STOREFRONT_API_TOKEN="your-public-storefront-api-token"
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   WEAVERSE_PROJECT_ID="your-weaverse-project-id"
   PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-customer-account-api-client-id"
   PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://your-shopify-store.myshopify.com/api/2022-01/graphql"

   ### Optional Variables:
   #PRIVATE_STOREFRONT_API_TOKEN="your-private-storefront-api-token"
   #PUBLIC_STOREFRONT_API_VERSION="unstable"
   #WEAVERSE_API_KEY="your-weaverse-api-key"
   #WEAVERSE_HOST="https://studio.weaverse.io"
   ```

   📌 **Note**: Never commit your `.env` file to version control. Instead, use an `.env.example` file to share the structure without exposing sensitive information.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Your project will be available at `http://localhost:3456`.
   ![Weaverse Local Development](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/pilot_development_server.png?v=1712226407)

5. **Update Preview URL**:
   - In Weaverse Studio, set the Project Preview URL to `http://localhost:3456`
   ![Weaverse Preview URL](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/update_preview_url.png?v=1712226429)

## Understanding the Pilot Theme

The Pilot theme provides a robust foundation for your Shopify Hydrogen store, equipped with essential components and structures for rapid customization.

### Project Structure

Your project includes several key directories and files, particularly within the `app/weaverse` and `app/sections` folders:

```text data-line-numbers=false
🌳 <root>
├── 📁 app
│   ├── 📁 ...
│   ├── 📁 components
│   ├── 📁 data
│   ├── 📁 graphql
│   ├── 📁 hooks
│   ├── 📁 libs
│   ├── 📁 routes
│   ├── 📁 sections
│   ├── 📁 styles
│   ├── 📁 weaverse
│   │   └── 📄 components.ts
│   │   └── 📄 create-weaverse.server.ts
│   │   └── 📄 index.tsx
│   │   └── 📄 schema.server.ts
│   │   └── 📄 style.tsx
│   ├── 📄 entry.client.tsx
│   ├── 📄 entry.server.tsx
│   └── 📄 root.tsx
├── 📁 public
│   └── 📄 favicon.svg
├── 📄 .editorconfig
├── 📄 .env
├── 📄 package.json
├── 📄 remix.config.js
├── 📄 remix.env.d.ts
├── 📄 server.ts
├── 📄 sync-project.md
└── 📄 tailwind.config.js
└── 📄 ...
```

### Creating Custom Sections

Let's enhance your theme by adding a customizable `UserProfiles` section that displays user profiles using Shopify's MetaObject for data storage.

### Implementing the UserProfiles Section

1. **Create the Section**: In `app/sections`, create a `user-profiles` folder and add an `index.tsx` file. Implement the `UserCard` component:

```jsx
const UserCard = () => {
  return (
    <div
      className="border bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto hover:shadow-xl transition-all duration-200"
      data-v0-t="card"
    >
      <img
        alt="Profile picture"
        className="object-cover w-full"
        height="320"
        src="https://cdn.shopify.com/s/files/1/0728/0410/6547/files/medium_3.webp?v=1702346343"
        style={{ aspectRatio: '320/320', objectFit: 'cover' }}
        width="320"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold hover:text-gray-700 transition-all duration-200">
          Emily Johnson
        </h2>
        <h3 className="text-gray-500 hover:text-gray-600 transition-all duration-200">
          Front-end Developer
        </h3>
        <p className="mt-2 text-gray-600 hover:text-gray-700 transition-all duration-200">
          Passionate about creating interactive user interfaces.
        </p>
        <div className="flex mt-4 space-x-2">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-9 rounded-md px-3 w-full hover:bg-gray-700 hover:text-white transition-all duration-200">
            Follow
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent h-9 rounded-md px-3 w-full hover:border-gray-700 hover:text-gray-700 transition-all duration-200">
            Message
          </button>
        </div>
      </div>
    </div>
  )
}
```

2. **Define the Component**: Create the `UserProfiles` component that incorporates the `UserCard`:

```tsx
interface UserProfilesProps extends HydrogenComponentProps {}
const UserProfiles = forwardRef<HTMLDivElement, UserProfilesProps>(
  (props, ref) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <UserCard />
      </div>
    )
  },
)

export default UserProfiles
```

3. **Create Schema**: Define a schema for the `UserProfiles` component:

```tsx
export const schema: HydrogenComponentSchema = {
  title: 'User Profiles',
  type: 'user-profiles',
  inspector: [],
}
```

4. **Register Component**: Add `UserProfiles` to `app/weaverse/components.ts`:

```tsx
import * as UserProfiles from '~/sections/user-profiles'

export let components: HydrogenComponent[] = [
  // ...other components
  UserProfiles,
]
```

After completing these steps, you can add and preview the `UserProfiles` section in Weaverse Studio.

![Weaverse User Profiles Preview](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/user_profile_demo1.png?v=1712226694)

## Working with Shopify MetaObjects

Shopify MetaObjects provide a powerful way to extend your store's data model with custom fields. This feature is particularly valuable for themes and apps that require additional data beyond Shopify's standard fields.

### Creating a UserProfile MetaObject

To store custom data for user profiles, you'll need to create a MetaObject in your Shopify Admin:

1. **Access Shopify Admin**: Navigate to `Settings` > `Custom data`
2. **Create MetaObject Definition**:
   - Click "Add definition"
   - Name it `UserProfile`

3. **Define Fields**:
   - `name` (Single line text): User's full name
   - `avatar` (File): User's profile picture (image files only)
   - `role` (Single line text): User's position or role
   - `description` (Multiple line text): User's bio or description

![Shopify MetaObject Definition](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition1.png?v=1712226924)

4. **Save Changes**: Save your MetaObject definition

### Adding Sample Data

1. **Access MetaObjects**: Go to `Settings` > `Custom data` > `MetaObjects`
2. **Select Definition**: Choose your `UserProfile` definition
3. **Add Entries**: Click "Add entry" and fill in the fields
4. **Save and Repeat**: Save each entry and add more as needed

![Shopify MetaObject Entries](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_entry.png?v=1712227679)

## Querying MetaObject Data

To display the custom data from your UserProfile MetaObjects, you'll need to create a GraphQL query to fetch the data from Shopify's Storefront API.

### Creating the Query

Add this query to your `app/data/queries.ts` file:

```tsx
export const METAOBJECTS_QUERY = `#graphql
  query MetaObjects($type: String!, $first: Int) {
    metaobjects(type: $type, first: $first) {
      nodes {
        fields {
          key
          type
          value
          reference {
            ... on MediaImage {
              alt
              image {
                altText
                url
                width
                height
              }
            }
          }
        }
        handle
        id
        type
      }
    }
  }
`
```

### Implementing the Loader

Add the following code to your `app/sections/user-profiles/index.tsx`:

```tsx
export let schema: HydrogenComponentSchema = {
  type: 'meta-demo',
  title: 'Metaobject Demo',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'Metaobject Demo',
      inputs: [
        {
          label: 'Select metaobject definition',
          type: 'metaobject',
          name: 'metaObjectData',
          shouldRevalidate: true,
        },
        {
          label: 'Items per row',
          name: 'itemsPerRow',
          type: 'range',
          configs: {
            min: 1,
            max: 10,
          },
          defaultValue: 3,
        },
      ],
    },
  ],
}

export let loader = async (args: ComponentLoaderArgs<UserProfilesProps>) => {
  let { weaverse, data } = args
  let { storefront } = weaverse
  if (!data?.metaObjectData) {
    return null
  }
  let { metaobjects } = await storefront.query(METAOBJECTS_QUERY, {
    variables: {
      type: data.metaObjectData.type,
      first: 10,
    },
  })
  return {
    userProfiles: metaobjects.nodes,
  }
}
```

The `shouldRevalidate` property ensures the page updates when a different metaobject definition is selected.

## Finalizing the UserProfiles Section

Update your `app/sections/user-profiles/index.tsx` with this complete implementation:

```tsx
import { Image } from '@shopify/hydrogen'
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen'
import { Button } from '~/components'
import { METAOBJECTS_QUERY } from '~/data/queries'
import clsx from 'clsx'
import { forwardRef } from 'react'

const UserCard = ({ user }: { user: any }) => {
  let { fields } = user
  let image = fields.find((field: any) => field.key === 'avatar')
  let imageData = image?.reference?.image
  let name = fields.find((field: any) => field.key === 'name')?.value
  let role = fields.find((field: any) => field.key === 'role')?.value
  let description = fields.find(
    (field: any) => field.key === 'description',
  )?.value
  return (
    <div
      className="flex flex-col gap-2 items-center border bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto hover:shadow-xl transition-all duration-200"
      data-v0-t="card"
    >
      <Image
        className="object-cover w-full"
        data={imageData}
        style={{ aspectRatio: '320/320', objectFit: 'contain' }}
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold hover:text-gray-700 transition-all duration-200">
          {name}
        </h2>
        <h3 className="text-gray-500 hover:text-gray-600 transition-all duration-200">
          {role}
        </h3>
        <p className="mt-2 text-gray-600 hover:text-gray-700 transition-all duration-200">
          {description}
        </p>
        <div className="flex mt-4 space-x-2">
          <Button>Follow</Button>
          <Button variant={'secondary'}>Message</Button>
        </div>
      </div>
    </div>
  )
}

interface UserProfilesProps extends HydrogenComponentProps {
  metaObjectData: {
    id: string
    type: string
  }
  itemsPerRow: number
}

const UserProfiles = forwardRef<HTMLDivElement, UserProfilesProps>(
  (props, ref) => {
    let { loaderData, metaObjectData, itemsPerRow, className, ...rest } = props
    if (!metaObjectData) {
      return (
        <section
          className={clsx(
            'w-full px-6 py-12 md:py-24 lg:py-32 bg-amber-50 mx-auto',
            className,
          )}
          ref={ref}
          {...rest}
        >
          <p className="text-center">Please select a metaobject definition</p>
        </section>
      )
    }
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
        ref={ref}
        {...rest}
      >
        <div
          className="grid w-fit mx-auto"
          style={{
            gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
            gap: '16rem',
          }}
        >
          {loaderData?.userProfiles.map((user: any) => {
            return <UserCard key={user.id} user={user} />
          })}
        </div>
      </div>
    )
  },
)
```

To preview your user profiles in Weaverse Studio:
1. Return to Weaverse Studio
2. Add the `UserProfiles` section to your page
3. Select the `UserProfile` MetaObject definition

![Weaverse User Profiles Preview](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_metaobject_demo_tutorial.jpg?v=1712900443)

## Next Steps

You've now mastered the basics of setting up a Weaverse Hydrogen project with the Pilot theme, creating custom sections, and implementing MetaObjects for advanced data management. To further enhance your skills, explore these resources:

- [Weaverse Hydrogen Components](/docs/guides/weaverse-component)
- [Component Schema](/docs/guides/component-schema)
- [Input Settings](/docs/guides/input-settings)
- [Data Fetching and Caching](/docs/guides/fetching-and-caching)
- [Deploy to Shopify Oxygen](/docs/deployment/oxygen)
