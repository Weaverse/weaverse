---
title: Weaverse MCP
description: The Weaverse MCP server enhances AI assistants by providing tools to search Weaverse documentation for accurate, contextual help.
publishedAt: July 20, 2024
updatedAt: July 20, 2024
order: 2
published: true
---

The Weaverse MCP (Managed Capability Provider) server enables AI assistants like Claude and GitHub Copilot to search Weaverse documentation directly, delivering accurate, context-aware assistance for developers working with Weaverse products.

## What is an MCP?

MCP stands for Managed Capability Provider - a protocol that allows AI assistants to access external tools and data sources. By implementing the MCP protocol, Weaverse provides AI models with direct access to our documentation, enabling them to give precise, up-to-date answers about Weaverse functionality.

## Setup

You can run the Weaverse MCP server easily using npx:

```txt data-line-numbers=false
npx -y @weaverse/mcp@latest
```

The server will start locally and listen for requests from compatible AI assistants.

## Integration with AI Assistants

### Cursor

To integrate Weaverse MCP with Cursor, add the following configuration to your Cursor settings:

1. Open Cursor and go to Settings (⚙️) > Extensions
2. Select "MCPs" from the sidebar
3. Add a new MCP with the following configuration:

```json data-line-numbers=false
{
  "mcpServers": {
    "weaverse-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@weaverse/mcp"
      ]
    }
  }
}
```

After saving, restart Cursor and the Weaverse MCP will be available to your AI assistant.

### Claude Desktop

To integrate with Claude Desktop:

1. Open Claude Desktop settings
2. Navigate to the MCP configuration section
3. Add the same configuration as shown above
4. Restart Claude Desktop

Refer to the Claude Desktop MCP guide for specific details on accessing and modifying the settings file.

## Available Tools

The Weaverse MCP server currently provides the following tool:

| Tool Name | Description |
| --- | --- |
| search_weaverse_docs | Search Weaverse.io documentation for specific information |

## Common Use Cases

The Weaverse MCP is particularly useful for:

- **Learning about Weaverse components**: Ask about specific Weaverse components and get documentation directly
- **Troubleshooting errors**: Share error messages to receive relevant documentation
- **Implementation guidance**: Get step-by-step instructions for implementing Weaverse features
- **API reference**: Query specific API endpoints, parameters, and return values

### Example Queries

Here are some example questions you can ask your AI assistant with the Weaverse MCP enabled:

```
How do I set up a new Weaverse Hydrogen theme?
What props does the ProductMedia component accept?
How can I customize the slideshow component in Weaverse?
What are the options for the collection-list element?
```

## How It Works

When you ask a question about Weaverse, the AI assistant:

1. Recognizes that your question is about Weaverse
2. Calls the Weaverse MCP server with your query
3. The MCP server searches the Weaverse documentation
4. Relevant documentation is returned to the AI assistant
5. The AI assistant formulates a response based on the documentation

This process ensures that responses are accurate and based on official Weaverse documentation.

## Troubleshooting

### Common Issues

**MCP Not Responding**
- Ensure the MCP server is running (you should see a confirmation in your terminal)
- Check that you've configured your AI assistant correctly
- Verify your network connection

**Irrelevant Results**
- Be specific in your queries
- Include relevant Weaverse terms like component names or specific features
- Try rephrasing your question

**Installation Problems**
- Make sure you have Node.js version 16 or higher installed
- Check for any error messages in your terminal
- Try running with the `--verbose` flag: `npx -y @weaverse/mcp@latest --verbose`

## Benefits

- **Accurate Information**: AI assistants can access up-to-date Weaverse documentation
- **Contextual Responses**: Get answers tailored to Weaverse's specific implementation and ecosystem
- **Reduced Development Time**: Quick access to accurate documentation means less time spent searching for answers
- **Seamless Integration**: Works with popular AI coding assistants with minimal configuration

## Future Enhancements

The Weaverse team is actively working on expanding MCP capabilities to include:

- Additional search filters and options
- Code example generation for common Weaverse patterns
- Theme setup assistance and troubleshooting
- Integration with project-specific configuration 