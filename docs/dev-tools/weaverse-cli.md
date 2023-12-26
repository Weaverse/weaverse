---
title: Weaverse CLI
description: The Weaverse CLI facilitates tasks such as project setup, theme scaffolding, and other common developer operations.
publishedAt: 11-20-2023
updatedAt: 11-20-2023
order: 0
---

For developers crafting Weaverse Hydrogen themes, the Weaverse CLI is a simple yet powerful aid, streamlining project
setup and management tasks directly from the command line.

Usage
-----

You can run it directly using **`npx`** to ensure you're always using the latest version:

```txt data-line-numbers=false
npx @weaverse/cli@latest [command]
```

Commands
--------

#### `create`

The \`create\` command in the Weaverse CLI is essential for starting new Weaverse Hydrogen projects. It creates a new
project directory, sets it up with a basic template, and installs necessary dependencies. After setting up, it
initializes the project and starts the development server, making sure your project is ready for development
immediately.

**Options**

* **`--template`**: Specifies the template to be used when creating the project. Currently, the only supported template
  is **`'pilot'`**.

* **`--project-id`**: This is the unique identifier for your project, which should correspond with the project ID in the
  Weaverse app.

* **`--project-name`**: Defines the name of your project, used as the directory name and within configuration files.

**Usage**

To create a new project, you would use a command like this:

```txt data-line-numbers=false
npx @weaverse/cli@latest create --template=pilot --project-id=clocwvm3y08j2r79n3c44uhjh --project-name=my-hydrogen-storefront
```

**Best Practices**

It is recommended to create your project within the Weaverse app first. Doing so will allow you to copy the full
command, complete with the project ID and project name, ensuring accuracy.

![](https://downloads.intercomcdn.com/i/o/848671954/f560c61a70f6c75f88567e78/image.png)
