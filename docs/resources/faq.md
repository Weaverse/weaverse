---
title: Frequently Asked Questions
description: Comprehensive answers to common questions about Weaverse development, deployment, and usage.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 3
published: true
---

# Frequently Asked Questions

Find comprehensive answers to the most common questions about Weaverse development, deployment, and usage. This FAQ covers everything from basic concepts to advanced implementation details.

## Table of Contents

- [Getting Started & Basics](#getting-started--basics)
- [Technical Architecture](#technical-architecture)
- [Development Workflow](#development-workflow)
- [Merchant/Studio Questions](#merchantstudio-questions)
- [Performance & SEO](#performance--seo)
- [Migration & Compatibility](#migration--compatibility)
- [Shopify Integration](#shopify-integration)
- [Deployment & DevOps](#deployment--devops)
- [Troubleshooting](#troubleshooting)
- [Support & Resources](#support--resources)

---

## Getting Started & Basics

### What is Weaverse and how is it different from Shopify Liquid themes?

Weaverse is a visual page builder and CMS designed specifically for Shopify Hydrogen storefronts. Unlike traditional Liquid themes:

- **Modern Architecture**: Built with React Router v7, TypeScript, and modern React patterns
- **Visual Editing**: Drag-and-drop interface for merchants with zero runtime JavaScript overhead
- **Developer Control**: Full component-level customization while maintaining merchant usability
- **Performance First**: Server-side rendered, statically optimized, and edge-ready
- **Headless Integration**: Native Shopify Storefront API integration with advanced caching

### Do I need React/TypeScript knowledge to use Weaverse?

**For Merchants**: No coding knowledge required. Weaverse Studio provides an intuitive visual interface for building pages, managing content, and customizing designs.

**For Developers**: Yes, building custom components requires:
- React knowledge (hooks, components, props)
- Basic TypeScript understanding
- Familiarity with Shopify Hydrogen and React Router v7
- Understanding of modern CSS (Tailwind recommended)

### What's the difference between Weaverse Studio and the SDK?

- **Weaverse Studio**: Shopify app (installed from App Store) that provides a visual page builder interface for merchants to create and edit content
- **Weaverse SDK**: Development packages (@weaverse/core, @weaverse/react, @weaverse/hydrogen) that developers use to create custom components and themes
- **Integration**: Developers build components with the SDK, then merchants use Studio to visually arrange and configure these components

### Can I use Weaverse without the visual editor?

While the SDK packages can technically be used independently, Weaverse is designed as a complete visual page building solution. The primary value comes from the combination of:
- Developer-built components (SDK)
- Merchant-friendly visual editing (Studio)
- Seamless integration between both

Using just the SDK would require building your own content management interface, which defeats the purpose of Weaverse's no-code editing experience.

### What are the system requirements?

**Development Environment**:
- Node.js 22+ (required)
- npm/pnpm package manager
- Git for version control
- Modern code editor (VS Code/Cursor recommended)

**Browser Support**:
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers with ES2020 support

**Shopify Requirements**:
- Any Shopify plan (Basic to Plus)
- Storefront API access
- Hydrogen app (for production deployment)

### How much does Weaverse cost?

Weaverse offers different pricing tiers to suit various business needs. For the most up-to-date pricing information, features, and subscription plans, please visit:

- **Official Pricing**: [weaverse.io/pricing](https://weaverse.io/pricing)
- **Shopify App Store**: Check the app listing for current pricing
- **Enterprise Solutions**: Contact sales for custom enterprise pricing

Pricing may vary based on features, usage, and business requirements.

### Is Weaverse production-ready?

Yes! Weaverse powers production storefronts with:
- React Router v7 stable release support
- Comprehensive TypeScript coverage
- Extensive testing and performance optimization
- Enterprise-grade security and scalability
- Active maintenance and regular updates

### What's included in the Pilot theme?

The Pilot theme is a comprehensive starter theme including:
- Complete e-commerce sections (product grids, featured collections, hero sections)
- Responsive design system with Tailwind CSS
- Advanced product pages with variant selection
- Cart and checkout integration
- SEO optimization and structured data
- Multi-language and multi-market support
- Performance optimizations and Core Web Vitals compliance

### How does Weaverse compare to other page builders?

Weaverse offers unique advantages:

**Technical Architecture**:
- ✅ React Router v7 (SSR) for optimal performance
- ✅ TypeScript support for better developer experience
- ✅ Component-based architecture for reusability
- ✅ No runtime JavaScript bloat

**Developer Experience**:
- ✅ Modern development workflow with hot reload
- ✅ Custom component creation with schemas
- ✅ Git-based version control integration
- ✅ Extensive TypeScript definitions

**Merchant Experience**:
- ✅ Intuitive drag-and-drop interface
- ✅ Real-time preview
- ✅ Shopify-native integration
- ✅ Mobile-responsive editing

### Can I try Weaverse before committing?

Yes! Several ways to evaluate Weaverse:
- **Studio Demo**: Try the visual editor at [studio.weaverse.io/demo](https://studio.weaverse.io/demo)
- **Live Storefront**: Browse the Pilot theme at [pilot.weaverse.dev](https://pilot.weaverse.dev)
- **Free SDK**: Download and test development packages locally
- **5-minute Quickstart**: Follow our installation guide
- **Community Support**: Get help in our [Slack community](https://wvse.cc/weaverse-slack)

---

## Technical Architecture

### How does Weaverse work with React Router v7 (formerly Remix)?

Weaverse v5 fully supports React Router v7:
- **Route Loaders**: Standard React Router data loading patterns
- **Component Loaders**: Weaverse-specific data loading at the component level
- **Type Generation**: `npx react-router typegen` for type safety
- **File-based Routing**: Standard React Router v7 route conventions
- **SSR & Hydration**: Seamless server-side rendering with client hydration

Migration from older Remix versions is handled through our [v5 Migration Guide](/docs/migration-advanced/v5-migration).

### What's the difference between @weaverse/core, @weaverse/react, and @weaverse/hydrogen?

- **@weaverse/core**: Framework-agnostic foundation with core logic and utilities
- **@weaverse/react**: React-specific components, hooks, and utilities
- **@weaverse/hydrogen**: Shopify Hydrogen integration with e-commerce specific features

**Dependency Chain**: `@weaverse/hydrogen` → `@weaverse/react` → `@weaverse/core`

### How does server-side rendering work in Weaverse?

Weaverse components are fully server-side rendered:
1. **Build Time**: Static page data is fetched and cached
2. **Request Time**: Server renders React components with data
3. **Client Hydration**: Minimal JavaScript for interactivity
4. **Navigation**: Client-side routing with React Router v7
5. **Data Loading**: Progressive enhancement for dynamic content

This ensures fast initial page loads and SEO optimization.

### What's the difference between component loaders and route loaders?

**Route Loaders** (React Router v7):
```typescript
// app/routes/products.$handle.tsx
export async function loader({ params, context }: LoaderArgs) {
  // Provides data to entire route
}
```

**Component Loaders** (Weaverse):
```typescript
// app/sections/featured-product.tsx
export async function loader({ weaverse, data }: ComponentLoaderArgs) {
  // Provides data only to this component
}
```

**Key Differences**:
- Route loaders: Entire route scope, accessed via `useLoaderData()`
- Component loaders: Component scope, accessed via `props.loaderData`

### How does the createSchema() function validate schemas?

```typescript
import { createSchema } from '@weaverse/hydrogen';

export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    // Validated at build time using Zod
  ]
});
```

**Validation Features**:
- Runtime schema validation with Zod
- TypeScript inference and autocompletion
- Build-time error checking
- Consistent validation rules across components

### Do I need forwardRef for components in React 19?

**React 19 (Current)**: `forwardRef` is no longer needed! Components automatically forward refs:
```typescript
interface Props {
  title: string;
  className?: string;
}

function MyComponent(props: Props) {
  return <section {...props}>{props.title}</section>;
}
```

**React 18 and Earlier** (legacy pattern):
```typescript
const MyComponent = forwardRef<HTMLElement, Props>((props, ref) => {
  return <section ref={ref} {...props} />;
});
```

**Weaverse Compatibility**:
- ✅ React 19 components work seamlessly with Weaverse Studio
- ✅ Automatic ref forwarding through props spreading
- ✅ No migration needed for existing forwardRef components
- ✅ Both patterns supported for backward compatibility

### How does Weaverse handle hydration and client-side navigation?

1. **Initial Load**: Server renders complete HTML
2. **Hydration**: React attaches to existing DOM
3. **Navigation**: React Router handles client-side routing
4. **Data Loading**: Progressive data fetching for new routes
5. **Component Updates**: Real-time updates from Studio

**Hydration Mismatch Prevention**:
- Consistent server/client rendering
- Proper data serialization
- Environment-aware components

### What's the data flow between Studio and local development?

1. **Local Development**: Components register with Weaverse config
2. **Studio Connection**: WebSocket connection to localhost:3456
3. **Live Preview**: Studio renders local components in iframe
4. **Data Sync**: Changes in Studio update local component props
5. **Build Output**: Production builds include optimized static data

### Can I use React Context, Redux, or Zustand with Weaverse?

**React Context**: ✅ Full support
```typescript
const ThemeContext = createContext();

function MyComponent() {
  const theme = useContext(ThemeContext);
  // Use context in Weaverse components
}
```

**State Management Libraries**: ✅ Compatible
- Redux Toolkit
- Zustand  
- Jotai
- Valtio

**Best Practices**:
- Use React Context for theme/configuration
- State management for complex app logic
- Weaverse handles content/page state

### How does component state management work?

**Local State**: Standard React patterns
```typescript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  // Local component state
}
```

**Global State**: Via hooks and context
```typescript
function MyComponent() {
  const weaverse = useWeaverse(); // Weaverse global state
  const settings = useThemeSettings(); // Theme settings
}
```

**Persistent State**: Through Weaverse Studio
- Component props persisted in Weaverse
- Theme settings saved globally
- Page data managed by Studio

### What's the build process for Weaverse projects?

**Standard Hydrogen Build Process**:
1. **Component Registration**: Weaverse discovers and registers your components
2. **React Router Build**: Standard Vite/React Router compilation
3. **Type Generation**: `npx react-router typegen` for route types
4. **Asset Optimization**: Vite handles CSS, images, and bundling

**Development**: 
```bash
npm run dev  # Hot reload with Weaverse component sync
```

**Production**:
```bash
npm run build  # Optimized build with code splitting
```

**Weaverse-Specific Steps**:
- Component schemas are validated at build time
- Studio connection established for live editing
- Static page data is generated and cached

### How does code splitting work with Weaverse components?

**Automatic Code Splitting**:
- Route-based splitting via React Router v7
- Dynamic imports for heavy components
- Component-level splitting for large sections

**Manual Code Splitting**:
```typescript
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./heavy-component'));

// Use with Suspense boundary
```

**Optimization Features**:
- Automatic bundle analysis
- Critical CSS inlining
- Progressive loading strategies

---

## Development Workflow

### How do I create a custom component from scratch?

1. **Create Component File**:
```typescript
// app/sections/my-section.tsx
import { createSchema } from '@weaverse/hydrogen';

interface MyComponentProps {
  title?: string;
  description?: string;
}

function MyComponent(props: MyComponentProps) {
  const { title, description, ...rest } = props;
  
  return (
    <section {...rest} className="py-12 px-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {description && <p className="mt-4 text-gray-600">{description}</p>}
    </section>
  );
}

export default MyComponent;

export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    {
      group: 'Content',
      inputs: [
        { type: 'text', name: 'title', label: 'Title' },
        { type: 'textarea', name: 'description', label: 'Description' }
      ]
    }
  ]
});
```

2. **Register Component**:
```typescript
// app/weaverse/components.ts
import * as MyComponent from '~/sections/my-section';

export const components = [
  MyComponent,
  // Other components...
];
```

### What's the difference between components and sections?

**Components**: Small, reusable UI elements
```typescript
// Button component
export let schema = createSchema({
  type: 'button',
  title: 'Button',
  // Simple, focused functionality
});
```

**Sections**: Page-level building blocks
```typescript
// Hero section
export let schema = createSchema({
  type: 'hero-section',
  title: 'Hero Section',
  childTypes: ['heading', 'paragraph', 'button'], // Can contain components
  // Complex layout functionality
});
```

**Usage Guidelines**:
- Components: Buttons, cards, forms, media elements
- Sections: Headers, heroes, product grids, feature areas

### Can I use TypeScript strict mode?

**Current Limitation**: Weaverse disables strict mode by default for compatibility with Shopify Hydrogen patterns.

**Workarounds**:
- Use strict type checking in individual files
- Enable strict mode for specific directories
- Use ESLint rules for additional type safety

**Future Support**: React Router v7 improvements will enable stricter TypeScript support.

### How do I debug Weaverse components?

**Development Debugging**:
```typescript
function MyComponent(props) {
  console.log('Props:', props); // Basic logging
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return <div>...</div>;
}
```

**React DevTools**: Full support for component inspection

**Studio Debugging**:
- Check browser console for Studio connection issues
- Inspect WebSocket messages in Network tab
- Use Studio's component inspector

**Production Debugging**:
- Source maps enabled in development builds
- Performance profiling with React DevTools
- Error boundaries for graceful failure handling

### Can I use custom CSS/Sass/CSS-in-JS?

**Tailwind CSS** (recommended):
```typescript
<div className="bg-blue-500 text-white p-4 rounded-lg">
```

**Custom CSS**:
```typescript
// Import in component
import './styles.css';

<div className="my-custom-class">
```

**CSS-in-JS**:
```typescript
import styled from 'styled-components';

const StyledComponent = styled.div`
  background: blue;
  padding: 1rem;
`;
```

**Sass/SCSS**: Full support via Vite configuration

### How do I handle responsive design?

**Tailwind Responsive Classes**:
```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  <h2 className="text-xl md:text-2xl lg:text-3xl">
    Responsive heading
  </h2>
</div>
```

**CSS Custom Properties**:
```typescript
const style = {
  '--mobile-size': '1rem',
  '--desktop-size': '1.5rem',
} as CSSProperties;

<div style={style} className="text-[var(--mobile-size)] md:text-[var(--desktop-size)]">
```

**Schema Configuration**:
```typescript
{
  type: 'range',
  name: 'mobileSize',
  label: 'Mobile Size',
}
```

### What testing strategies work with Weaverse?

**Unit Testing**:
```typescript
// With Vitest
import { render, screen } from '@testing-library/react';
import MyComponent from './my-component';

test('renders component correctly', () => {
  render(<MyComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

**Component Testing**:
- Test component rendering with various props
- Test schema validation
- Test data loading functionality

**E2E Testing**:
- Playwright for Studio integration testing
- Test visual editing workflows
- Test production deployment flows

### How do I organize components in large projects?

**Recommended Structure**:
```
app/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements
│   └── forms/           # Form components
├── sections/            # Page sections
│   ├── header/          # Header variants
│   ├── hero/            # Hero sections
│   └── product/         # Product sections
├── layouts/             # Layout components
└── utils/               # Shared utilities
```

**Component Organization**:
- Group related components in folders
- Use barrel exports (index.ts files)
- Share common utilities
- Maintain consistent naming conventions

### Can I use GitHub Copilot/AI assistants with Weaverse?

**Full AI Assistant Support**:
- GitHub Copilot works excellently with Weaverse patterns
- Claude Code integration via MCP server
- TypeScript IntelliSense for better AI suggestions

**Weaverse MCP Server**:
```bash
npm install -g @weaverse/mcp
# Provides AI assistants access to Weaverse documentation
```

**AI-Friendly Patterns**:
- Well-documented component schemas
- Consistent TypeScript patterns
- Clear component structure

### How does hot reload work during development?

**Development Server**:
```bash
npm run dev  # Starts both Studio and Remix servers
```

**Hot Reload Features**:
- Component changes refresh instantly
- Schema updates reload Studio
- CSS changes apply without refresh
- TypeScript errors show in real-time

**Studio Integration**:
- Live preview updates automatically
- Component registration changes reflect immediately
- Error boundaries prevent crashes during development

---

## Merchant/Studio Questions

### Can non-technical users really build pages?

**Yes!** Weaverse Studio is designed for non-technical users:

**Visual Interface**:
- Drag-and-drop section placement
- Inline text editing
- Visual property controls
- Real-time preview

**No Code Required**:
- Point-and-click customization
- Form-based content entry
- Media upload and management
- Color and typography controls

**Merchant-Friendly Features**:
- Undo/redo functionality
- Save as you go
- Preview across device sizes
- Guided onboarding


### Can multiple team members work simultaneously?

**Current Status**: Weaverse Studio currently supports single-editor mode per page to prevent conflicts.

**Available Collaboration Features**:
- Multiple team members can access the same project
- Different team members can work on different pages simultaneously
- Change history tracking for accountability
- Project sharing capabilities

**Best Practices for Team Collaboration**:
- Coordinate page assignments to avoid conflicts
- Use clear naming conventions for pages and components
- Communicate changes through your team's usual channels
- Consider development/staging workflows for major changes

### What happens if I break something in the editor?

**Current Safety Features**:
- **Error Prevention**: The editor validates changes and prevents invalid configurations
- **Manual Save**: Remember to save your changes regularly using the save button

**Planned Features** (coming soon):
- **Auto-save**: Automatic saving of changes as you work
- **Undo/Redo**: Full action history with Ctrl+Z/Cmd+Z support
- **Version History**: Restore previous versions of your pages
- **Change Tracking**: Detailed history of all modifications

**Current Recovery Options**:
1. Make sure to save your work frequently to prevent data loss
2. Ask for help in our [Slack community](https://wvse.cc/weaverse-slack)
3. For developers: changes can be reverted through your git workflow if needed

### How do I handle seasonal campaigns?

**Campaign Management Strategies**:
- Create dedicated campaign pages in Weaverse Studio
- Build reusable campaign components (banners, CTAs, product showcases)
- Plan content updates in advance
- Use consistent branding and messaging

**Best Practices**:
- Create campaign-specific pages ahead of time
- Use consistent branding and messaging across campaign elements
- Test campaign layouts before going live
- Keep campaign assets organized in your component library
- Document campaign components for easy reuse

**Technical Implementation**:
- Build flexible banner and promotion components
- Use Weaverse's component settings for easy campaign customization
- Leverage Shopify's discount and promotion features alongside visual elements

### Can I A/B test different layouts?

**Current Status**: Built-in A/B testing functionality is not currently available in Weaverse.

**Alternative Approaches**:
- Create multiple page versions manually and compare performance
- Use external A/B testing tools at the application level
- Implement feature flags in your custom components
- Leverage Shopify's built-in analytics to compare page performance

**Future Development**: A/B testing capabilities are being considered for future releases. Stay updated:
- Join our [Slack community](https://wvse.cc/weaverse-slack) for the latest news
- Join our [Slack community](https://wvse.cc/weaverse-slack) for feature updates
- Ask questions in our [Slack community](https://wvse.cc/weaverse-slack)

**Workarounds**:
- Create duplicate pages with different layouts
- Use URL parameters or routing to serve different versions
- Monitor conversion metrics through Shopify Analytics or Google Analytics

### How do I backup/restore my designs?

**Automatic Backups**:
- Version history in Studio
- Daily automated snapshots
- Change logging and tracking

**Manual Backups**:
- Export page data as JSON
- Code repository contains component definitions
- Database backups include content data

**Restoration Process**:
1. Access version history in Studio
2. Select restore point
3. Confirm restoration
4. Verify content integrity

### Is there a mobile app for editing?

**Current Status**: Web-based editor optimized for desktop/tablet use

**Mobile Considerations**:
- Studio works on tablets (iPad, Android tablets)
- Mobile browsers have limited functionality
- Responsive preview available in all views

**Roadmap**:
- Native mobile app under consideration
- PWA improvements planned
- Enhanced mobile editing capabilities

---

## Performance & SEO

### Does Weaverse add JavaScript bloat?

**No runtime overhead!** Weaverse is designed for optimal performance:

**Build Time**:
- Components pre-rendered to static HTML
- Data fetched and cached during build
- CSS optimized and purged

**Runtime**:
- Zero page builder JavaScript
- Standard React hydration only
- Minimal client-side code

**Bundle Analysis**:
```bash
npm run build  # Includes bundle analysis
# Weaverse components add ~0KB runtime JavaScript
```

### How does it compare to Liquid in performance?

**Script Loading & Bundle Optimization**:
- **Liquid**: Each app adds separate scripts with different frameworks/libraries → script conflicts and bloated sites
- **Weaverse**: Single React-based bundle optimized with Vite → unified framework, no conflicts, optimized loading

**Performance Advantages**:
- ✅ **Unified Bundle**: All components share React framework - no duplicate libraries
- ✅ **Vite Optimization**: Tree-shaking, code splitting, and modern bundling
- ✅ **Server-Side Rendering**: Faster initial page loads with React Router v7
- ✅ **Static Generation**: Pre-computed HTML and CSS
- ✅ **Zero Runtime JS**: Weaverse components add ~0KB runtime JavaScript
- ✅ **Image Optimization**: Automatic WebP/AVIF conversion

**Architecture Comparison**:
- **Liquid Apps**: Multiple scripts + different frameworks = bloated, conflict-prone
- **Weaverse**: Single React bundle + Vite optimization = lean, fast, cohesive

**Real-world Results**:
- Eliminates script conflicts between different page builder apps
- 40-60% faster initial page loads
- 90+ Lighthouse performance scores
- Improved Core Web Vitals metrics

### What's the impact on Core Web Vitals?

**Optimizations for Core Web Vitals**:

**LCP (Largest Contentful Paint)**:
- Above-the-fold content prioritized
- Critical CSS inlined
- Image optimization with proper sizing
- Preload key resources

**FID (First Input Delay)**:
- Minimal JavaScript execution
- Event handler optimization
- Non-blocking resource loading

**CLS (Cumulative Layout Shift)**:
- Proper image dimensions
- Font loading optimization
- Skeleton loading states
- Reserved space for dynamic content

**Typical Scores**: 90+ on all Core Web Vitals metrics

### How does image optimization work?

**Shopify Native Image Handling**:
- **Shopify Images**: Weaverse uses Shopify's native image system directly
- **Media Manager**: Upload and manage images through Shopify's media manager
- **Shopify CDN**: Images served from Shopify's global CDN infrastructure
- **Built-in Optimization**: Shopify handles format conversion and compression

**Implementation**:
```typescript
import { Image } from '@shopify/hydrogen';

// Example GraphQL query for image data
const IMAGE_QUERY = `#graphql
  query {
    product {
      featuredImage {
        altText
        url
        height
        width
      }
    }
  }
`;

export default function ProductImage({product}) {
  if (!product.featuredImage) {
    return null;
  }

  return (
    <Image
      data={product.featuredImage}
      sizes="(min-width: 45em) 50vw, 100vw"
      aspectRatio="4/5"
    />
  );
}
```

**Shopify Image Features**:
- Automatic WebP/AVIF format delivery
- Responsive image generation with srcset
- Global CDN delivery
- Built-in lazy loading support
- SEO-optimized alt text and structured data

**Learn More**: [Shopify Image Component](https://shopify.dev/docs/api/hydrogen/latest/components/media/image)

### Can I use CDN and edge caching?

**Shopify Oxygen (Primary Deployment)**:
- ✅ **Built on Cloudflare Workers**: Global edge network with 200+ data centers
- ✅ **Zero Configuration**: Deploy directly from Shopify CLI
- ✅ **Automatic CDN**: Global distribution included
- ✅ **Edge Caching**: Built-in caching strategies

**Deployment to Oxygen**:
```bash
# Deploy Hydrogen project to Shopify Oxygen
shopify hydrogen deploy

# Automatic benefits:
# - Global Cloudflare Worker deployment
# - Edge caching at 200+ locations
# - Built-in performance optimization
```


**Edge Caching Features (Oxygen)**:
- Automatic static asset caching
- Shopify API response caching
- Geographic content distribution
- Sub-100ms response times globally

### What's the typical build time?

**Build Performance**:
- **Small Project** (10-20 components): 30-60 seconds
- **Medium Project** (50-100 components): 2-4 minutes  
- **Large Project** (200+ components): 5-10 minutes

**Build Optimization**:
- Parallel component processing
- Incremental builds in development
- Cached dependency resolution
- Optimized TypeScript compilation

**CI/CD Considerations**:
- Implement incremental deployments
- Utilize persistent build machines
- Optimize build processes for Shopify Oxygen

### How do I implement lazy loading?

**Built-in Lazy Loading**:
```typescript
// Images lazy load by default
<WeaverseImage loading="lazy" />

// Components can lazy load
const LazyComponent = lazy(() => import('./heavy-component'));

<Suspense fallback={<ComponentSkeleton />}>
  <LazyComponent />
</Suspense>
```

**Section-Level Lazy Loading**:
```typescript
export let schema = createSchema({
  type: 'heavy-section',
  lazyLoad: true,  // Loads when in viewport
  settings: [...]
});
```

**Custom Implementations**:
- Intersection Observer API
- React hooks for viewport detection
- Progressive content loading

### Does Weaverse support SSG/ISR?

**Dependency Chain**: Weaverse → Shopify Hydrogen → React Router v7

**Static Site Generation**: ✅ Via React Router v7
- Pages pre-generated at build time through React Router's SSG capabilities
- Content cached for fast delivery via Shopify Oxygen
- Dynamic sections rendered on-demand

**Server-Side Rendering**: ✅ Via Shopify Hydrogen
- Real-time rendering for dynamic content
- Seamless hydration on the client
- Powered by React Router v7's SSR architecture

**Implementation**:
```typescript
// React Router v7 static generation
export async function loader({ params, context }) {
  // Data fetched at build time for SSG
  // Or at request time for SSR
  return {
    product: await context.storefront.query(PRODUCT_QUERY, {
      variables: { handle: params.handle }
    })
  };
}
```

**Note**: SSG/ISR capabilities depend on React Router v7 features, which Shopify Hydrogen leverages and Weaverse inherits.

---

## Migration & Compatibility

### How do I migrate from Online Store 2.0?

**Weaverse Migration Service**: We recommend contacting our Weaverse team directly for migration assistance.

**What We Provide**:
- ✅ **Full-Service Migration**: Complete migration from any store project to Hydrogen with Weaverse
- ✅ **Expert Consultation**: Assessment of your current theme and migration strategy
- ✅ **Component Conversion**: Professional conversion of Liquid sections to React components
- ✅ **Content Migration**: Seamless transfer of all content, settings, and customizations
- ✅ **Testing & QA**: Thorough testing before go-live
- ✅ **Training & Support**: Team training on Weaverse workflow

**Migration Process**:
1. **Initial Consultation**: Review your current store and requirements
2. **Migration Planning**: Custom strategy based on your specific needs  
3. **Component Development**: Convert and enhance your existing functionality
4. **Content Transfer**: Migrate all pages, settings, and data
5. **Testing & Launch**: Comprehensive testing and smooth deployment

**Contact for Migration**:
- Join our [Slack community](https://wvse.cc/weaverse-slack) to discuss your migration
- Get migration help in our [Slack community](https://wvse.cc/weaverse-slack)
- We handle migrations from any platform to Hydrogen + Weaverse

### Can I migrate from other Hydrogen themes?

**Yes!** Migration from existing Hydrogen themes is straightforward:

**Component Migration**:
```typescript
// Existing Hydrogen component
function ProductCard({ product }) {
  return <div>...</div>;
}

// Weaverse-enabled version
const ProductCard = forwardRef((props, ref) => {
  return <div ref={ref} {...props}>...</div>;
});

export let schema = createSchema({
  type: 'product-card',
  // Add schema configuration
});
```

**Key Changes**:
- Add Weaverse schema exports
- Implement forwardRef patterns
- Update component registration
- Add Studio configuration

### What happens to my metafields and custom data?

**Full Compatibility**: Weaverse maintains complete compatibility with Shopify metafields:

**Metafield Access**:
```typescript
// In component loaders
export const loader = async ({ weaverse }) => {
  const { storefront } = weaverse;
  
  const product = await storefront.query(PRODUCT_QUERY, {
    variables: { handle: 'product-handle' }
  });
  
  // Access metafields normally
  const customData = product.metafields;
  return { product, customData };
};
```

**Custom Data Integration**:
- Product metafields: Full access
- Collection metafields: Complete support  
- Customer metafields: Available in customer routes
- Store metafields: Global access via settings

### Can I run Weaverse and traditional themes simultaneously?

**Hybrid Approach**: Yes, with proper configuration:

**Use Cases**:
- Gradual migration strategy
- A/B testing new vs. old
- Feature-specific implementations
- Risk mitigation during transition

**Implementation**:
1. Deploy Weaverse on subdomain (shop-new.example.com)
2. Use URL-based routing for specific pages
3. Gradually migrate sections of the site
4. Maintain both themes during transition

**Considerations**:
- SEO implications of split traffic
- Analytics tracking setup
- Customer experience consistency
- Maintenance overhead

### How do I handle URL redirects?

**Built-in Redirect Handling**:
```typescript
// In route loaders
export const loader = ({ request }) => {
  const url = new URL(request.url);
  
  // Handle legacy URLs
  if (url.pathname.startsWith('/old-path/')) {
    throw redirect('/new-path/' + url.pathname.slice(11));
  }
};
```

**Redirect Configuration (Shopify Oxygen/Cloudflare Workers)**:
```typescript
// Handle redirects in your React Router loader
export async function loader({ request, params }) {
  const url = new URL(request.url);
  
  // Legacy URL redirects
  if (url.pathname.startsWith('/old-path/')) {
    return redirect(url.pathname.replace('/old-path/', '/new-path/'), 301);
  }
  
  // Product handle redirects
  if (params.handle === 'old-product-handle') {
    return redirect('/products/new-product-handle', 301);
  }
  
  // Continue with normal loading...
}
```

**Migration Strategy**:
1. Document all current URLs
2. Map old URLs to new structure
3. Implement redirect rules
4. Test redirect chains
5. Monitor 404 errors post-migration

### Is Weaverse compatible with Shopify's checkout extensibility?

**Full Compatibility**: ✅ Weaverse works seamlessly with Shopify's modern checkout:

**Checkout Extensions**:
- Payment customizations
- Shipping method modifications
- Order summary enhancements
- Custom validation rules

**Implementation**:
```typescript
// Checkout extension integration
const checkoutUrl = await storefront.checkoutURL({
  lineItems: cartItems,
  extensions: {
    'checkout-ui-extension': extensionData
  }
});
```

**Features Supported**:
- Shopify Functions integration
- Custom checkout fields
- Third-party payment providers
- Post-purchase extensions

### Can I migrate content from other page builders?

**Professional Migration Service**: Contact our Weaverse team for assistance migrating from any platform to Weaverse Hydrogen.

**We Handle Migrations From**:
- ✅ **Shopify Page Builders**: PageFly, Shogun, GemPages, etc.
- ✅ **WordPress**: Elementor, Gutenberg, WooCommerce sites
- ✅ **Other Platforms**: Webflow, Squarespace, Magento, custom builds
- ✅ **Legacy Shopify**: Online Store 2.0, older Liquid themes
- ✅ **Existing Hydrogen**: Convert any Hydrogen project to use Weaverse

**What's Included**:
- Complete content and layout migration
- Component recreation and optimization
- SEO preservation and enhancement
- Training on Weaverse workflow
- Post-migration support

**Get Started**: Join our [Slack community](https://wvse.cc/weaverse-slack) or contact support to discuss your migration needs.

### What about existing Shopify Plus customizations?

**Full Plus Support**: All Shopify Plus features remain functional:

**Plus Features**:
- ✅ Shopify Scripts (Discount/Payment/Shipping)
- ✅ Flow automation integration
- ✅ B2B wholesale functionality
- ✅ Multi-market and internationalization
- ✅ Advanced analytics and reporting
- ✅ Custom checkout processes

**Script Integration**:
```typescript
// Shopify Scripts remain functional
// Hydrogen cart integrates with Plus features
const { cart } = await storefront.cartQuery({
  // Plus-specific configurations work normally
});
```

**Advanced Plus Workflows**:
- Bulk order management
- Custom pricing rules  
- Inventory management integration
- Advanced customer segmentation

---

## Shopify Integration

### Which Shopify APIs does Weaverse use?

**Primary APIs**:
- **Storefront API**: Product data, cart operations, customer data
- **Admin API**: Store configuration, webhook management (when needed)
- **Webhooks**: Real-time updates for product/inventory changes
- **GraphQL**: Primary query language for all API interactions

**API Usage Patterns**:
```typescript
// Storefront API usage
const { products } = await storefront.query(PRODUCTS_QUERY, {
  variables: { first: 20, query: 'available:true' }
});

// Webhook integration
export const webhookHandler = async (topic, shop, body) => {
  // Handle product updates, order notifications, etc.
};
```

**Rate Limiting**: Built-in handling with exponential backoff and caching strategies.

### Can I use Shopify apps with Weaverse?

**App Compatibility**: Most Shopify apps work seamlessly:

**Fully Compatible**:
- ✅ Payment apps (PayPal, Stripe, etc.)
- ✅ Shipping apps (ShipStation, Easyship)
- ✅ Marketing apps (Klaviyo, Mailchimp)
- ✅ Analytics apps (Google Analytics, Hotjar)
- ✅ Review apps (Yotpo, Judge.me)

**Integration Required**:
- 🔧 Theme-dependent apps (may need component recreation)
- 🔧 Liquid-based apps (require React conversion)
- 🔧 Checkout apps (use Shopify Functions instead)

**Implementation Example**:
```typescript
// Integrating review app
const ProductReviews = ({ productId }) => {
  const reviews = useReviews(productId); // Custom hook for app API
  return <ReviewDisplay reviews={reviews} />;
};
```

### How does checkout work?

**Checkout Options**:

**1. Shopify Checkout (Recommended)**:
```typescript
// Redirect to Shopify's optimized checkout
const checkoutUrl = cart.checkoutUrl;
window.location.href = checkoutUrl;
```

**2. Custom Checkout Implementation**:
```typescript
// Build custom checkout with Storefront API
const checkout = await storefront.checkoutCreate({
  lineItems: cartItems
});
```

**Features**:
- Mobile-optimized checkout flow
- Multiple payment providers
- Conversion optimization
- Security and PCI compliance
- International payment methods

### Does it support Shopify Markets and B2B?

**Full Markets Support**: ✅
- Multi-currency pricing
- Localized content and URLs  
- Region-specific shipping
- Tax calculation by market
- Payment method localization

**Implementation**:
```typescript
// Market-aware pricing
const { products } = await storefront.query(PRODUCTS_QUERY, {
  variables: { 
    country: market.country,
    language: market.language 
  }
});
```

**B2B Functionality**: ✅
- Wholesale pricing tiers
- Custom catalog access
- Volume discounts
- Net payment terms
- Purchase order integration

**B2B Implementation**:
```typescript
// B2B customer detection
const isB2BCustomer = customer?.tags?.includes('B2B');
const pricing = isB2BCustomer ? wholesalePricing : retailPricing;
```

### Can I use Shopify Flow and Scripts?

**Shopify Flow**: ✅ Full compatibility
- Automation triggers work normally
- Webhook integrations maintained
- Customer segmentation supported
- Inventory management flows

**Shopify Scripts**: ✅ Complete support
```ruby
# Discount scripts work unchanged
if cart.line_items.size > 2
  discount = cart.subtotal_price * 0.1
end
```

**Integration Points**:
- Cart calculations respect Scripts
- Checkout flow includes Script modifications
- Shipping calculations use configured Scripts
- Payment method filtering via Scripts

### How do customer accounts work?

**Account Management**:
```typescript
// Customer authentication
export const loader = async ({ context }) => {
  const customer = await context.session.get('customer');
  if (!customer) {
    return redirect('/account/login');
  }
  
  return json({ customer });
};
```

**Features Supported**:
- Customer login/registration
- Order history and tracking
- Address management
- Wishlist functionality
- Account preferences

**Custom Account Pages**:
- Order detail views
- Profile management
- Subscription management
- Reward program integration

### Does it work with Shopify POS?

**POS Integration**: ✅ Full support

**Shared Features**:
- Unified inventory management
- Synchronized customer data
- Consistent pricing across channels
- Order fulfillment coordination

**Implementation Considerations**:
- Inventory updates reflect immediately
- Customer accounts work across channels
- Promotions and discounts synchronized
- Analytics consolidated across touchpoints

### Can I use native Shopify search?

**Search Options**:

**1. Native Shopify Search**: ✅ Default implementation
```typescript
const { products } = await storefront.query(SEARCH_QUERY, {
  variables: { query: searchTerm }
});
```

**2. Enhanced Search Solutions**:
- ✅ Algolia integration
- ✅ Elasticsearch implementation
- ✅ Custom search APIs
- ✅ AI-powered search (Shopify Magic)

**Search Features**:
- Predictive search suggestions
- Faceted filtering
- Search analytics
- Typo tolerance
- Merchandising controls

### How do I handle subscriptions?

**Subscription App Integration**:
```typescript
// ReCharge/Bold integration example
const SubscriptionOptions = ({ productId }) => {
  const subscriptionPlans = useSubscriptionPlans(productId);
  
  return (
    <div>
      {subscriptionPlans.map(plan => (
        <SubscriptionPlan key={plan.id} plan={plan} />
      ))}
    </div>
  );
};
```

**Popular Subscription Apps**:
- ReCharge (full integration support)
- Bold Subscriptions (React components available)
- Shopify Subscriptions (native support)

**Implementation Features**:
- Subscription plan selection
- Billing frequency options
- Pause/skip functionality
- Customer portal integration

### What about Shopify Functions?

**Full Functions Support**: ✅

**Function Types**:
- ✅ Discount functions
- ✅ Shipping customization
- ✅ Payment customization  
- ✅ Cart validation
- ✅ Fulfillment constraints

**Implementation Example**:
```typescript
// Discount function integration
export const applyDiscount = async (cart) => {
  const discountAmount = await callShopifyFunction(
    'discount-function-id',
    { cart: cart.data }
  );
  
  return discountAmount;
};
```

**Development Workflow**:
- Functions developed separately from theme
- Integration via GraphQL API calls
- Testing in development stores
- Deployment via Shopify CLI

---

## Deployment & DevOps

### Where can I deploy?

**Supported Deployment Options**:

**Shopify Oxygen** (Primary & Recommended):
```bash
# Deploy to Oxygen
npx shopify hydrogen deploy
```
- ✅ **Full Weaverse Support**: Complete integration with Weaverse Studio
- ✅ **Native Shopify Integration**: Seamless Shopify API access
- ✅ **Cloudflare Workers**: Global edge network (200+ data centers)
- ✅ **Zero Configuration**: Deploy directly from Shopify CLI
- ✅ **Automatic Scaling**: Handle traffic spikes automatically



**Recommendation**: Use Shopify Oxygen for all production deployments to ensure full Weaverse functionality.

### How do I set up staging environments?

**Multi-Environment Setup**:

**1. Environment Configuration**:
```bash
# Production .env
PUBLIC_STORE_DOMAIN=production-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=prod_token
WEAVERSE_PROJECT_ID=prod_project_id

# Staging .env.staging
PUBLIC_STORE_DOMAIN=staging-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=staging_token
WEAVERSE_PROJECT_ID=staging_project_id
```

**2. Deployment Pipeline**:
```yaml
# GitHub Actions example for Shopify Oxygen
name: Deploy to Staging
on:
  push:
    branches: [staging]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Shopify Oxygen Staging
        run: |
          npm ci
          npm run build
          npx shopify hydrogen deploy --environment staging
        env:
          SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN: ${{ secrets.STAGING_SHOPIFY_TOKEN }}
```

**3. Branch Strategy**:
- `main` → Production
- `staging` → Staging environment
- `feature/*` → Preview deployments
- `develop` → Development environment


### How do I set up CI/CD pipelines?

**GitHub Actions Example**:
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          npm ci
          npm run build
          npx shopify hydrogen deploy
        env:
          SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN: ${{ secrets.SHOPIFY_TOKEN }}
```

**Pipeline Features**:
- Automated testing
- Type checking
- Build verification
- Preview deployments
- Production deployment
- Rollback capabilities



**Container Features**:
- Multi-stage builds
- Optimized image size
- Security scanning
- Health check endpoints
- Horizontal scaling
- Load balancer integration

### How do I handle environment variables?

**Environment Configuration**:

**Development (.env.local)**:
```bash
# Shopify Configuration
PUBLIC_STORE_DOMAIN=dev-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=dev_storefront_token
SESSION_SECRET=dev_session_secret

# Weaverse Configuration
WEAVERSE_PROJECT_ID=dev_project_id

# Optional Services
GOOGLE_ANALYTICS_ID=GA-DEV-ID
KLAVIYO_API_KEY=dev_klaviyo_key
```

**Production Security**:
- Use platform secret management
- Rotate secrets regularly
- Limit access permissions
- Audit secret usage
- Monitor for leaks

**Shopify Oxygen**:
```bash
# Set environment variables in Shopify CLI
shopify hydrogen env set SECRET_NAME "secret-value" --environment production
```


### How do I monitor production performance?

**Performance Monitoring**:

**1. Built-in Analytics**:
- Shopify Analytics (built into Oxygen)
- Core Web Vitals reporting
- Oxygen performance metrics
- Edge cache analytics

**2. Third-party Solutions**:
```typescript
// Sentry error tracking
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// DataDog APM
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.DD_APPLICATION_ID,
  clientToken: process.env.DD_CLIENT_TOKEN,
});
```

**Metrics to Track**:
- Core Web Vitals (LCP, FID, CLS)
- Error rates and types
- API response times
- Conversion funnel metrics
- User session recordings

**Alerting Setup**:
- Performance degradation alerts
- Error rate thresholds
- Uptime monitoring
- Security incident notifications

---

## Troubleshooting

### Components not showing in Studio

**Common Causes & Solutions**:

**1. Component Registration Issues**:
```typescript
// ❌ Incorrect - component not exported properly
export MyComponent;

// ✅ Correct - proper component export
export default MyComponent;
export let schema = createSchema({...});
```

```typescript
// ❌ Incorrect - missing from components array
export const components = [
  // MyComponent missing here
];

// ✅ Correct - component included
export const components = [
  * as MyComponent,
];
```

**2. Schema Validation Errors**:
```typescript
// ❌ Incorrect - invalid schema structure
export let schema = {
  type: 'my-component', // Missing createSchema wrapper
};

// ✅ Correct - proper schema validation
export let schema = createSchema({
  type: 'my-component',
  title: 'My Component'
});
```

**3. TypeScript Compilation Errors**:
- Check browser console for TypeScript errors
- Run `npm run typecheck` to identify issues
- Ensure all imports resolve correctly
- Verify props interface matches component usage

**Debugging Steps**:
1. Check browser console for errors
2. Verify component appears in network requests
3. Test component registration with `console.log`
4. Validate schema with createSchema function
5. Restart development server

### Build errors and TypeScript issues

**Common Build Errors**:

**1. TypeScript Configuration Issues**:
```bash
# Error: Cannot find module '@weaverse/hydrogen'
npm install @weaverse/hydrogen @weaverse/react @weaverse/core

# Error: Type definitions missing
npm run typecheck  # Identify specific type issues
```

**2. Import Resolution Problems**:
```typescript
// ❌ Incorrect - wrong import path
import { createSchema } from 'weaverse';

// ✅ Correct - proper import path
import { createSchema } from '@weaverse/hydrogen';
```

**3. React Router v7 Type Issues**:
```typescript
// ❌ Incorrect - old Remix imports
import type { LoaderArgs } from '@remix-run/node';

// ✅ Correct - React Router v7 types
import type { Route } from './+types/route-name';
export const loader = ({ params }: Route.LoaderArgs) => {};
```

**Resolution Steps**:
1. Clear all caches: `rm -rf node_modules .react-router dist`
2. Reinstall dependencies: `npm install`
3. Generate types: `npx react-router typegen`
4. Check for version conflicts: `npm ls`
5. Update TypeScript configuration if needed

### Studio not loading/connecting

**Connection Issues**:

**1. Development Server Problems**:
```bash
# Verify dev server is running
npm run dev  # Should start both studio and remix servers

# Check port availability
lsof -i :3456  # Weaverse default port
netstat -an | grep :3456
```

**2. CORS Configuration**:
```typescript
// vite.config.ts - Add CORS headers if needed
export default defineConfig({
  server: {
    cors: {
      origin: 'https://studio.weaverse.io',
      credentials: true
    }
  }
});
```

**3. Environment Variable Issues**:
```bash
# Verify required environment variables
echo $WEAVERSE_PROJECT_ID
echo $PUBLIC_STORE_DOMAIN
echo $PUBLIC_STOREFRONT_API_TOKEN

# Check .env file exists and is properly formatted
cat .env
```

**4. Browser/Network Issues**:
- Clear browser cache and cookies
- Disable ad blockers/extensions
- Check firewall settings
- Try incognito/private browsing mode
- Verify internet connectivity

**Debugging Tools**:
- Browser Developer Tools (Network tab)
- Check WebSocket connections
- Inspect Console for error messages
- Test direct localhost access

### Performance problems

**Performance Diagnosis**:

**1. Bundle Size Issues**:
```bash
# Analyze bundle size
npm run build  # Check build output for large chunks
npx vite-bundle-analyzer dist  # Visual bundle analysis
```

**2. Image Optimization Problems**:
```typescript
// ❌ Incorrect - unoptimized images
<img src="/large-image.png" />

// ✅ Correct - optimized Weaverse images
<WeaverseImage 
  src="/large-image.png"
  width={800}
  height={600}
  loading="lazy"
/>
```

**3. Component Performance Issues**:
```typescript
// ❌ Incorrect - expensive operations in render
function MyComponent() {
  const expensiveValue = expensiveCalculation(); // Runs every render
  return <div>{expensiveValue}</div>;
}

// ✅ Correct - memoized expensive operations
function MyComponent() {
  const expensiveValue = useMemo(() => expensiveCalculation(), []);
  return <div>{expensiveValue}</div>;
}
```

**Performance Monitoring Tools**:
- React DevTools Profiler
- Chrome Lighthouse
- WebPageTest.org
- Core Web Vitals extension

### Hydration mismatches

**Common Hydration Issues**:

**1. Server/Client Content Differences**:
```typescript
// ❌ Incorrect - different content on server/client
function MyComponent() {
  return <div>{Date.now()}</div>; // Different on server vs client
}

// ✅ Correct - consistent content
function MyComponent() {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  
  useEffect(() => {
    setTimestamp(Date.now()); // Set after hydration
  }, []);
  
  return <div>{timestamp || 'Loading...'}</div>;
}
```

**2. Conditional Rendering Issues**:
```typescript
// ❌ Incorrect - browser-only checks during SSR
function MyComponent() {
  if (typeof window !== 'undefined') {
    return <ClientOnlyComponent />;
  }
  return <ServerComponent />;
}

// ✅ Correct - consistent rendering
function MyComponent() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient ? <ClientOnlyComponent /> : <ServerComponent />;
}
```

**Prevention Strategies**:
- Use `useEffect` for client-only code
- Implement proper loading states
- Avoid server/client content differences
- Test SSR builds thoroughly

### API rate limiting

**Rate Limit Issues**:

**1. Shopify Storefront API Limits**:
- **Rate**: 1000 requests per minute per IP
- **Burst**: Up to 100 requests in 20 seconds
- **Solutions**: Implement caching, batch requests, use webhooks

```typescript
// Implement exponential backoff
async function retryWithBackoff(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2 ** (3 - retries) * 1000));
      return retryWithBackoff(fn, retries - 1);
    }
    throw error;
  }
}
```

**2. Weaverse API Limits**:
```typescript
// Use built-in caching
export const loader = async ({ context }) => {
  const data = await context.weaverse.fetchWithCache(
    'api-endpoint',
    { method: 'GET' },
    CacheLong() // Cache for 1 day
  );
};
```

**Best Practices**:
- Implement request caching
- Use CDN for static assets
- Batch API requests when possible
- Monitor rate limit headers
- Implement graceful degradation

### CORS and security issues

**CORS Resolution**:

**1. Development CORS Issues**:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }
});
```

**2. Production CORS Configuration**:
```typescript
// server.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://studio.weaverse.io']
    : true,
  credentials: true
}));
```

**Security Best Practices**:
- Use HTTPS in production
- Implement proper Content Security Policy
- Sanitize user inputs
- Validate API requests
- Use environment variables for secrets
- Regular security audits

### Component data not updating

**Data Update Issues**:

**1. Cache Invalidation Problems**:
```typescript
// ❌ Incorrect - stale cache not invalidated
const data = await fetchWithCache('api', {}, CacheLong());

// ✅ Correct - proper cache invalidation
const data = await fetchWithCache(
  'api',
  {},
  CacheShort(), // Use shorter cache for frequently updated data
  {
    tags: ['product-data'], // Cache tags for invalidation
  }
);
```

**2. Component State Synchronization**:
```typescript
// ❌ Incorrect - component doesn't respond to prop changes
function MyComponent({ data }) {
  const [internalData] = useState(data); // Won't update when data prop changes
  return <div>{internalData}</div>;
}

// ✅ Correct - component updates with prop changes
function MyComponent({ data }) {
  const [internalData, setInternalData] = useState(data);
  
  useEffect(() => {
    setInternalData(data); // Update when prop changes
  }, [data]);
  
  return <div>{internalData}</div>;
}
```

**3. WebSocket Connection Issues**:
```typescript
// Check WebSocket connection in Studio
// Look for connection errors in browser console
// Verify development server is running correctly
```

**Debugging Steps**:
1. Check component props in React DevTools
2. Verify API responses in Network tab
3. Test cache invalidation manually
4. Restart development server
5. Clear browser cache

---

## Support & Resources

### Where do I get help?

**Community Support** (Free):

**1. Slack Community**:
- [Join our Slack](https://wvse.cc/weaverse-slack)
- Real-time chat with developers and the Weaverse team
- Technical support and Q&A
- Feature requests and feedback
- Component showcase and sharing
- Migration assistance discussions

**2. GitHub Resources**:
- [Documentation Repository](https://github.com/Weaverse/weaverse)
- [GitHub Discussions](https://github.com/orgs/Weaverse/discussions)
- Code examples and issue tracking

**Professional Support** (Paid):

**1. Priority Support**:
- Email support with guaranteed response times
- Technical consultation sessions
- Custom component development
- Migration assistance

**2. Enterprise Support**:
- Dedicated account management
- Custom training sessions
- SLA guarantees
- Priority feature development

### How do I report bugs?

**Bug Reporting Process**:

**1. Check Existing Issues**:
- Search [GitHub Issues](https://github.com/Weaverse/weaverse/issues)
- Check our [Slack community](https://wvse.cc/weaverse-slack) for similar problems
- Review documentation for known limitations

**2. Create Detailed Bug Report**:
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Weaverse version: 5.3.4
- Node.js version: 22.0.0
- Browser: Chrome 120
- OS: macOS 14

## Code Sample
```typescript
// Minimal code example that reproduces the issue
```

**3. Include Relevant Information**:
- Screenshots or screen recordings
- Console error messages
- Network requests (if relevant)
- Configuration files
- Steps already attempted

**Bug Report Quality**: High-quality bug reports get faster resolutions!

### Can I request features?

**Yes!** We actively welcome feature requests:

**Feature Request Process**:

**1. Community Discussion**:
- Ask in our [Slack community](https://wvse.cc/weaverse-slack) first
- Gauge interest from other developers
- Refine the feature concept
- Consider implementation approaches

**2. GitHub Feature Request**:
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?
What problem does it solve?

## Proposed Implementation
Ideas for how it could work

## Examples
Similar features in other tools
Mock-ups or wireframes (if applicable)
```

**3. Feature Development Priority**:
- Community upvotes and comments
- Alignment with product roadmap
- Technical feasibility
- Resource availability

**Popular Feature Categories**:
- New input types for schemas
- Enhanced Studio capabilities
- Performance optimizations
- Integration improvements
- Developer experience enhancements

### Is there professional support?

**Professional Support Options**:

**1. Development Services**:
- Custom component development
- Theme customization and optimization
- Migration from other platforms
- Performance auditing and optimization
- SEO optimization

**2. Training Programs**:
- Developer onboarding sessions
- Team training workshops
- Best practices consultation
- Architecture review sessions

**3. Enterprise Solutions**:
- Priority technical support
- Service Level Agreements (SLAs)
- Dedicated account management
- Custom feature development
- White-label solutions

**Support Channels**:
- Email: support@weaverse.io
- Scheduled consultation calls
- Screen sharing technical sessions
- Custom documentation creation

**Pricing**: Contact sales team for professional support pricing based on specific needs.

### Where's the community?

**Primary Community Platform**:

**Slack Community**:
- [Join our Slack](https://wvse.cc/weaverse-slack)
- Real-time discussions with the Weaverse team
- Technical support and troubleshooting
- Feature requests and feedback
- Component sharing and showcase
- Migration help and best practices
- Developer networking and collaboration

**Additional Resources**:
- [GitHub Organization](https://github.com/Weaverse) for code and issues
- [GitHub Discussions](https://github.com/orgs/Weaverse/discussions) for technical discussions
- Official documentation and guides

**Community Guidelines**:
- Be respectful and constructive
- Share knowledge and help others
- Provide detailed information when asking for help
- Contribute to open source projects
- Follow code of conduct

**Getting Involved**:
- Join our [Slack community](https://wvse.cc/weaverse-slack) and help others
- Share components and templates in Slack
- Report bugs via GitHub Issues
- Suggest improvements in GitHub Discussions
- Participate in beta testing discussions on Slack

---

## Still Have Questions?

If you can't find your answer in this comprehensive FAQ:

**Quick Help Options**:
- 🔍 [Search Documentation](/docs) for detailed guides
- 💬 [Join our Slack](https://wvse.cc/weaverse-slack) for community support and real-time help
- 🐛 [GitHub Issues](https://github.com/Weaverse/weaverse/issues) for bug reports
- 💡 [GitHub Discussions](https://github.com/orgs/Weaverse/discussions) for feature requests

**Professional Support**:
- 📧 Email support@weaverse.io for business inquiries
- 📅 Schedule a consultation for complex projects
- 🏢 Enterprise support with dedicated account management

**Learning Resources**:
- 📚 [Complete Tutorial](/docs/resources/tutorials/tutorial) (20-minute walkthrough)
- 🎥 Video tutorials and walkthroughs
- 📖 [Development Guide](/docs/development-guide) for advanced topics
- 🧪 [Example Components](/docs/resources/examples/example-components) for inspiration

We're always here to help you build amazing Shopify storefronts with Weaverse! 🚀