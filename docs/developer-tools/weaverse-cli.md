---
title: Weaverse CLI
description: The Weaverse CLI facilitates tasks such as project setup, theme scaffolding, and other common developer operations.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 0
published: true
---

For developers crafting Weaverse Hydrogen themes, the Weaverse CLI is a simple yet powerful aid, streamlining project
setup and management tasks directly from the command line.

## Installation & Usage

You can run the CLI directly using **`npx`** to ensure you're always using the latest version:

```txt data-line-numbers=false
npx @weaverse/cli@latest [command]
```

To view available commands and options:

```txt data-line-numbers=false
npx @weaverse/cli@latest --help
```

## Available Commands

### `create`

The `create` command is essential for starting new Weaverse Hydrogen projects. It:

- Creates a new project directory
- Downloads and extracts the selected template
- Sets up environment variables
- Installs necessary dependencies (optional)
- Starts the development server (optional)

#### Available Templates

Weaverse CLI currently supports the following templates:

| Template | Description |
| --- | --- |
| **pilot** | A modern and clean template for your Weaverse store |
| **naturelle** | A beautiful and elegant template for your Weaverse store |

#### Options

| Option | Description | Required | Default |
| --- | --- | --- | --- |
| **`--template`** | Template name (`pilot` or `naturelle`) | Yes | - |
| **`--project-id`** | Your Weaverse project ID | Yes | - |
| **`--project-name`** | Name for your project directory | No | my-weaverse-hydrogen-project |
| **`--commit`** | Specific Git commit hash to use | No | Latest from main branch |
| **`--no-install`** | Skip dependency installation and dev server start | No | false |

#### Usage Examples

**Basic usage with the Pilot template:**

```txt data-line-numbers=false
npx @weaverse/cli@latest create --template=pilot --project-id=clocwvm3y08j2r79n3c44uhjh --project-name=my-store
```

**Using the Naturelle template:**

```txt data-line-numbers=false
npx @weaverse/cli@latest create --template=naturelle --project-id=clocwvm3y08j2r79n3c44uhjh --project-name=naturelle-store
```

**Using a specific commit version:**

```txt data-line-numbers=false
npx @weaverse/cli@latest create --template=pilot --project-id=clocwvm3y08j2r79n3c44uhjh --commit=a1b2c3d4
```

**Creating project without installing dependencies:**

```txt data-line-numbers=false
npx @weaverse/cli@latest create --template=pilot --project-id=clocwvm3y08j2r79n3c44uhjh --no-install
```

## Workflow

When you run the `create` command, the CLI will:

1. Download the selected template from GitHub
2. Extract the template to your specified project directory
3. Configure environment variables (including your Weaverse project ID)
4. Install dependencies using npm (unless `--no-install` is specified)
5. Start the development server (unless `--no-install` is specified)

After completion, you'll see instructions for the next steps to take.

## Best Practices

It is recommended to create your project within the Weaverse app first. Doing so will allow you to copy the
full command, complete with the project ID and project name, ensuring accuracy.

![](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/CLI-newProject.png?v=1743412008)

## Troubleshooting

### Common Issues

**Template Download Fails**
- Check your internet connection
- Verify that the specified commit hash is valid (if using `--commit`)
- Try again with the default template without specifying a commit

**Dependency Installation Fails**
- Try running `npm install --legacy-peer-deps` manually in the project directory
- Ensure you have the latest version of Node.js installed (v16+)
- Check for errors in your project's package.json

**Development Server Won't Start**
- Make sure all required environment variables are set
- Check that you've pulled Shopify environment variables with `npx shopify hydrogen env pull`
- Verify port 3456 is available on your system
