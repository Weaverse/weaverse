---
title: Tutorial (20m)
description: A comprehensive guide to Weaverse, the first-ever Theme Customizer & CMS for Shopify Hydrogen.
publishedAt: March 28, 2024
updatedAt: March 28, 2024
order: 2
published: true
---


# Weaverse Hydrogen Tutorial

Welcome to this step-by-step guide on setting up a Weaverse Hydrogen project using the pre-made "Pilot" theme. Aimed at providing a hands-on experience, this tutorial is structured to guide you from installation through to deployment, ensuring you're ready to launch your Shopify store with a custom theme. Whether you're coding along or just browsing, expect to spend about 20 minutes on this guide.

## Prerequisites

This tutorial is built for developers with a foundational understanding of several key technologies. If you're unfamiliar with any of the following, please refer to the provided links before proceeding:

- [React](https://react.dev)
- [Remix](https://remix.run/docs/en/main/start/tutorial)
- [Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started)
- [Shopify Theme Architecture](https://shopify.dev/docs/themes/architecture)
- [TailwindCSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

## Installation Steps

### Install Weaverse App

Weaverse can be installed directly from the Shopify App Store. After installation, access it from your Shopify Admin Dashboard. [Install Weaverse App](https://apps.shopify.com/weaverse?utm_source=tutorial)

### Create a New Project

With Weaverse installed, create a new project by selecting the "Create Project" button. By default, the Pilot theme is selected. Follow the on-screen instructions to finalize the project setup.

![Create Project in Weaverse](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/create_weaverse_hydrogen_project.webp?width=1400&crop=center)


### Theme Editor Exploration

After project creation, dive into the theme editor to customize your theme, from adding new sections and blocks to previewing changes in real-time.
![Weaverse Studio](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Pilot_v2_4_0__Dec_06__-_Project_Editor_-_Weaverse_Hydrogen.jpg?v=1712225542)




### **Setup Local Development**

To kickstart your local development with the Weaverse Hydrogen project, there are several methods to clone or set up the project on your local machine. Here's how you can proceed with the Pilot theme, available at: [Pilot Theme GitHub Repository](https://github.com/weaverse/pilot).

#### **Method 1: Using Weaverse CLI**

The Weaverse CLI simplifies the setup process by configuring the project directly in your workspace.

1. **Install Weaverse CLI**: Execute the following command in your terminal:
    ```bash
    npx @weaverse/cli@latest create --template=pilot --project-id=<your-project-id> --project-name=<your-project-name>
    ```
   Replace `<your-project-id>` and `<your-project-name>` with your project's actual ID and name. This will set up the Pilot theme in the specified directory.

#### **Method 2: Cloning from GitHub**

Directly cloning the GitHub repository allows you to work with the latest version of the Pilot theme.

1. **Clone Repository**: Use the clone command to copy the Pilot theme repository to your local machine.
    ```bash
    git clone https://github.com/weaverse/pilot.git <your-project-name>
    ```
   Substitute `<your-project-name>` with the desired name for your project directory.

#### **Method 3: Downloading and Extracting ZIP**

For those who prefer not to use Git, downloading the project as a ZIP file is a straightforward alternative.

1. **Download ZIP**: Navigate to the [Pilot theme's GitHub page](https://github.com/weaverse/pilot) and click the "Code" dropdown button, then select "Download ZIP".
2. **Extract Files**: After downloading, extract the ZIP file into your preferred project location.

#### **Method 4: Using GitHub as a Template**

GitHub's repository template feature offers an easy way to create a new repository based on the Pilot theme.

1. **Generate from Template**: Visit the [Pilot theme's GitHub page](https://github.com/weaverse/pilot) and click the "Use this template" button. Follow GitHub's prompts to create a new repository.
2. **Clone Your New Repository**: Once your repository is set up, clone it to your local machine:
    ```bash
    git clone <your-new-repository-url>
    ```
   Replace `<your-new-repository-url>` with the URL of your newly created repository.




### **Next Steps for Local Development Setup**

After selecting one of the setup methods for your project, follow these steps to get your local development environment ready, ensuring to properly configure environment variables for a smooth workflow:

1. **Navigate to Your Project Directory**:
  - Switch to your project's directory with:
    ```bash
    cd <your-project-name>
    ```
    


2. **Setting Up Environment Variables**:
  - Create a `.env` file in the root of your project directory.
  - Populate the `.env` file with necessary environment variables. Here are examples for both the demo setup and a setup with real store data.

    **For a demo setup using `mock.shop`:**
    ```plaintext
    SESSION_SECRET="your-randomly-generated-secret"
    PUBLIC_STORE_DOMAIN="mock.shop"
    WEAVERSE_PROJECT_ID="your-weaverse-project-id"
    ```

    **For a setup with real store data:**
    ```plaintext
    SESSION_SECRET="your-randomly-generated-secret"
    PUBLIC_STOREFRONT_API_TOKEN="your-public-storefront-api-token"
    PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
    WEAVERSE_PROJECT_ID="your-weaverse-project-id"
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-customer-account-api-client-id"
    PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://your-shopify-store.myshopify.com/api/2022-01/graphql"
    
    ### Optional:
    #PRIVATE_STOREFRONT_API_TOKEN="your-private-storefront-api-token" # Optional
    #PUBLIC_STOREFRONT_API_VERSION="unstable" # Optional, defaults to Hydrogen's version
    #WEAVERSE_API_KEY="your-weaverse-api-key" # Optional
    #WEAVERSE_HOST="https://studio.weaverse.io" # Optional, defaults to Weaverse's studio URL
    ```

  - 📌 **Important**: To safeguard sensitive information, do not commit the `.env` file to version control. Instead, use an `.env.example` file to share the structure of environment variables without revealing the actual values.

3. **Install Dependencies**:
  - Run the following command to install all required dependencies for your project:
    ```bash
    npm install
    ```

4. **Start the Development Server**:
  - With dependencies installed, launch your local development server:
    ```bash
    npm run dev
    ```
  - Your project will now be accessible at `http://localhost:3456`, allowing you to view and interact with it in real-time.
![Weaverse Local Development](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/pilot_development_server.png?v=1712226407)

5. **Update Weaverse Preview URL**:
  - In Weaverse Studio, update the Project Preview URL to `http://localhost:3456` to preview your local development changes within the Weaverse environment.
![Weaverse Preview URL](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/update_preview_url.png?v=1712226429)


## Learning and Customizing the Pilot Theme

The Pilot theme serves as a fully functional base for your Shopify Hydrogen store, complete with necessary components and structures for quick customization.

### Project Structure Overview

Your project structure will include several directories and files crucial for theme customization, notably within the `app/weaverse` and `app/sections` folders.


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

### Adding Customizable Sections

Creating customizable sections enriches the user experience. Let's add a new section called `UserProfiles` to display user profiles, utilizing Shopify's Metaobject for data storage.

### Implementing `UserProfiles`

1. **Create `UserProfiles` Section**: In `app/sections`, create a `user-profiles` folder and add an `index.tsx` file. Implement the `UserCard` component from the provided code snippet (which I found from [V0.dev](https://v0.dev/t/AokCsMvkYGf)).

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
        style={{aspectRatio: '320/320', objectFit: 'cover'}}
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
  );
};
```

2. **Define `UserProfiles` Component**: Incorporate the `UserCard` component within `UserProfiles`, exporting it as the default component.

```tsx
interface UserProfilesProps extends HydrogenComponentProps {}
const UserProfiles = forwardRef<HTMLDivElement, UserProfilesProps>((props, ref) => {
  return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <UserCard />
          </div>
  );
})

export default UserProfiles;
```


3. **Schema Definition**: Define a basic schema for `UserProfiles` to ensure proper rendering and integration with the Weaverse theme editor.

```tsx
export const schema: HydrogenComponentSchema = {
  title: 'User Profiles',
  type: 'user-profiles',
  inspector: [
    
  ]
};
```

4. **Registration**: Register `UserProfiles` in `app/weaverse/components.ts` for it to appear in the Weaverse Studio, enabling its addition to pages.


```tsx
import * as UserProfiles from '~/sections/user-profiles'

export let components: HydrogenComponent[] = [
  // ...other components
        UserProfiles
];
```

Upon completion, you should be able to add and preview the `UserProfiles` section within Weaverse Studio, marking the beginning of your theme's customization journey.

![Weaverse User Profiles Preview](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/user_profile_demo1.png?v=1712226694)


## Next Steps: Defining Shopify MetaObject

Shopify MetaObjects offer a powerful way to add custom data to your Shopify store, enabling you to store additional information beyond the standard fields provided by Shopify. This feature is particularly useful for themes and apps that require custom data fields for products, customers, and other resources.


#### **Creating a MetaObject for User Profiles**

To incorporate custom data for user profiles in your Weaverse Hydrogen project, you need to define a MetaObject in Shopify Admin. Here's how to set up a `UserProfile` MetaObject:

1. **Navigate to Shopify Admin**: Access your store's admin panel and go to `Settings` > `Custom data`.
2. **Add a MetaObject Definition**:
  - In the "Metaobject definitions" section, click "Add definition".
  - Enter a definition name, such as `UserProfile`, to start creating your custom data structure.
3. **Define Fields for UserProfile**:

- `name` (Single line text): The user's full name.
- `avatar` (File): Choose the File type and accept only image file types for the user's avatar.
- `role` (Single line text): The user's role or position.
- `description` (Multiple line text): A detailed bio or user description.

![Shopify MetaObject Definition](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition1.png?v=1712226924)

4. **Save and Apply Changes**: After defining the fields, save the MetaObject definition and apply it to your store.


### **Adding Sample Entries to UserProfile MetaObject**

1. **Access Shopify Admin**: Go to `Settings` > `Custom data`.

2. **Find MetaObjects**: Click on `MetaObjects`, then select your `UserProfile` definition.

3. **Add Sample Entry**:
  - Click “Add entry”.
  - Fill in the fields: `Name`, `Avatar` (image file), `Role`, and `Description`.

4. **Save Entry**: Ensure each entry is saved.

5. **Repeat**: Add more entries to test various data presentations.

![Shopify MetaObject Entries](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_entry.png?v=1712227679)
