---
title: Example Weaverse Components
description: Explore real-world examples of Weaverse components with detailed implementation guides.
publishedAt: April 14, 2025
updatedAt: April 14, 2025
order: 4
published: true
---

# Example Weaverse Components

This guide provides real-world examples of Weaverse components, showcasing different patterns and best practices. Each example includes the complete implementation, schema definition, and explanations of key concepts.

## Table of Contents
- [Hero Image](#hero-image)
- [Featured Product](#featured-product)
- [Team Members](#team-members)
- [Review List](#review-list)
- [Image with Text](#image-with-text)

## Hero Image

A versatile hero section component that supports different heights, content positions, and background styles.

### Implementation

```tsx
// app/sections/hero-image.tsx
import {
  type HydrogenComponentSchema,
  IMAGES_PLACEHOLDERS,
  useThemeSettings,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import type { SectionProps } from "~/components/section";
import { Section, layoutInputs } from "~/components/section";

// Define variants using CVA
const variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "",
    },
    enableTransparentHeader: {
      true: "",
      false: "",
    },
    contentPosition: {
      "top left": "justify-start items-start [&_.paragraph]:[text-align:left]",
      "top center": "justify-start items-center [&_.paragraph]:[text-align:center]",
      "top right": "justify-start items-end [&_.paragraph]:[text-align:right]",
      "center left": "justify-center items-start [&_.paragraph]:[text-align:left]",
      "center center": "justify-center items-center [&_.paragraph]:[text-align:center]",
      "center right": "justify-center items-end [&_.paragraph]:[text-align:right]",
      "bottom left": "justify-end items-start [&_.paragraph]:[text-align:left]",
      "bottom center": "justify-end items-center [&_.paragraph]:[text-align:center]",
      "bottom right": "justify-end items-end [&_.paragraph]:[text-align:right]",
    },
  },
  compoundVariants: [
    {
      height: "full",
      enableTransparentHeader: true,
      className: "h-screen",
    },
    {
      height: "full",
      enableTransparentHeader: false,
      className: "h-screen-no-nav",
    },
  ],
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

export interface HeroImageProps extends VariantProps<typeof variants> {}

const HeroImage = forwardRef<HTMLElement, HeroImageProps & SectionProps>(
  (props, ref) => {
    const { children, height, contentPosition, ...rest } = props;
    const { enableTransparentHeader } = useThemeSettings();
    
    return (
      <Section
        ref={ref}
        {...rest}
        containerClassName={variants({
          contentPosition,
          height,
          enableTransparentHeader,
        })}
      >
        {children}
      </Section>
    );
  },
);

export default HeroImage;

export const schema: HydrogenComponentSchema = {
  type: "hero-image",
  title: "Hero image",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        ...layoutInputs.filter(
          (inp) => inp.name !== "divider" && inp.name !== "borderRadius",
        ),
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    height: "large",
    contentPosition: "center center",
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 40,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Hero image with text overlay",
        as: "h2",
        color: "#ffffff",
        size: "default",
      },
      {
        type: "paragraph",
        content:
          "Use this text to share information about your brand with your customers.",
        color: "#ffffff",
      },
    ],
  },
};
```

### Key Features

1. **CVA Variants**:
   - Maps schema select inputs to CSS classes
   - Handles responsive design through variant definitions
   - Uses compound variants for special cases

2. **Schema Design**:
   - Groups related inputs logically
   - Provides sensible defaults
   - Supports child components
   - Includes preset content

3. **Component Structure**:
   - Uses `forwardRef` for editor integration
   - Leverages theme settings
   - Maintains clean prop handling
   - Supports flexible content positioning

## Featured Product

A component that displays a featured product with its details and purchase options.

### Implementation

```tsx
// app/sections/featured-product/index.tsx
import type { ComponentLoaderArgs, HydrogenComponentProps, HydrogenComponentSchema } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { PRODUCT_QUERY } from '~/graphql/queries';

interface FeaturedProductData {
  productHandle: string;
}

export const loader = async (args: ComponentLoaderArgs<FeaturedProductData>) => {
  const { weaverse, data } = args;
  const { storefront } = weaverse;
  
  if (!data?.productHandle) {
    return null;
  }
  
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: data.productHandle,
    },
  });

  return { product };
};

type FeaturedProductProps = HydrogenComponentProps<Awaited<ReturnType<typeof loader>>> & FeaturedProductData;

const FeaturedProduct = forwardRef<HTMLElement, FeaturedProductProps>((props, ref) => {
  const { loaderData, productHandle, ...rest } = props;
  const product = loaderData?.product;
  
  if (!product) {
    return <div>Select a product in the editor</div>;
  }
  
  return (
    <section ref={ref} {...rest}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      {/* Product details */}
    </section>
  );
});

export default FeaturedProduct;

export const schema: HydrogenComponentSchema = {
  type: 'featured-product',
  title: 'Featured Product',
  settings: [
    {
      group: 'Product',
      inputs: [
        {
          type: 'product',
          name: 'productHandle',
          label: 'Product',
        },
      ],
    },
  ],
};
```

### Key Features

1. **Data Loading**:
   - Uses component loader for product data
   - Handles missing product gracefully
   - Type-safe data fetching

2. **Schema Design**:
   - Simple product selection input
   - Clear grouping of related settings

3. **Component Structure**:
   - Proper error handling
   - Clean prop destructuring
   - Type-safe props interface

## Team Members

A component that displays team members with their profiles and social links.

### Implementation

```tsx
// app/sections/our-team/team-members.tsx
import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import { Link } from "@remix-run/react";
import {
  type HydrogenComponentProps,
  type HydrogenComponentSchema,
  type WeaverseImage,
  useParentInstance,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import type { OurTeamQuery } from "storefront-api.generated";
import { Image } from "~/components/image";

type MemberType = {
  name: string;
  title: string;
  bio: string;
  avatar: WeaverseImage;
  github_url: string;
  linkedin_url: string;
  x_url: string;
};

const TeamMembers = forwardRef<HTMLDivElement, HydrogenComponentProps>(
  (props, ref) => {
    const parent = useParentInstance();
    const { metaobjects }: OurTeamQuery = parent.data.loaderData || {};
    
    if (metaobjects?.nodes?.length) {
      const members = metaobjects.nodes;
      return (
        <div
          ref={ref}
          {...props}
          className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2 pt-4"
        >
          {members.map(({ id, fields }) => {
            const member: Partial<MemberType> = {};
            for (const { key, value, reference } of fields) {
              // @ts-ignore
              member[key] = key === "avatar" ? reference?.image : value;
            }
            const { name, title, bio, avatar, github_url, linkedin_url, x_url } = member;
            return (
              <div key={id} className="items-center bg-gray-50 sm:flex">
                {avatar && (
                  <Image
                    data={avatar}
                    sizes="auto"
                    className="w-full h-auto sm:w-48 sm:h-48"
                    aspectRatio="1/1"
                    width={500}
                  />
                )}
                <div className="p-5">
                  <div className="text-xl font-semibold tracking-tight">
                    {name}
                  </div>
                  <span className="text-gray-600">{title}</span>
                  {bio && (
                    <p className="mt-3 mb-4 font-light text-gray-600">{bio}</p>
                  )}
                  <ul className="flex space-x-3">
                    {linkedin_url && (
                      <li>
                        <Link
                          to={linkedin_url}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <LinkedinLogo className="w-6 h-6" />
                        </Link>
                      </li>
                    )}
                    {github_url && (
                      <li>
                        <Link
                          to={github_url}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <GithubLogo className="w-6 h-6" />
                        </Link>
                      </li>
                    )}
                    {x_url && (
                      <li>
                        <Link
                          to={x_url}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-900"
                        >
                          <XLogo className="w-6 h-6" />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return <div ref={ref} {...props} />;
  },
);

export default TeamMembers;

export const schema: HydrogenComponentSchema = {
  type: "team-members",
  title: "Team Members",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout",
          configs: {
            options: [
              { value: "grid", label: "Grid" },
              { value: "list", label: "List" },
            ],
          },
          defaultValue: "grid",
        },
      ],
    },
  ],
};
```

### Key Features

1. **Data Integration**:
   - Uses parent instance data
   - Handles metaobjects data structure
   - Maps fields to component properties

2. **UI Components**:
   - Responsive image handling
   - Social media icons
   - Flexible layout options

3. **Accessibility**:
   - Semantic HTML structure
   - Proper link attributes
   - Clear visual hierarchy

## Review List

A component that displays product reviews with ratings and filtering options.

### Implementation

```tsx
// app/sections/ali-reviews/review-list.tsx
import {
  type HydrogenComponentProps,
  type HydrogenComponentSchema,
  useParentInstance,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { StarRating } from "~/components/star-rating";
import type { AliReviewsLoaderData } from ".";
import { ReviewBar } from "./review-bar";
import type { AliReview, ReviewItemData } from "./review-item";
import { ReviewItem } from "./review-item";

type AliReviewsProps = ReviewItemData & {
  showAvgRating: boolean;
  showReviewsCount: boolean;
  showReviewsProgressBar: boolean;
  reviewsToShow: number;
  showReviewWithMediaOnly: boolean;
};

const ReviewList = forwardRef<
  HTMLDivElement,
  AliReviewsProps & HydrogenComponentProps
>((props, ref) => {
  const {
    children,
    showAvgRating,
    showReviewsCount,
    showReviewsProgressBar,
    reviewsToShow,
    showReviewWithMediaOnly,
    showCountry,
    showDate,
    showVerifiedBadge,
    verifiedBadgeText,
    showStar,
    ...rest
  } = props;
  const parent = useParentInstance();
  const allReviews: AliReviewsLoaderData = parent.data.loaderData;
  
  if (allReviews?.length) {
    const { totalReviews, avgRating, reviewsByRating } =
      getReviewsSummary(allReviews);
    let reviewsToRender = Array.from(allReviews);
    
    if (showReviewWithMediaOnly) {
      reviewsToRender = reviewsToRender.filter((rv) => rv.media.length > 0);
    }
    reviewsToRender = reviewsToRender.slice(0, reviewsToShow);

    return (
      <div
        ref={ref}
        {...rest}
        className="md:flex md:gap-16 space-y-8 md:space-y-0"
      >
        <div className="my-6 space-y-6 md:my-8 shrink-0" data-motion="slide-in">
          <div className="shrink-0 flex gap-4">
            {showAvgRating && (
              <div className="text-6xl font-bold leading-none">
                {avgRating.toFixed(1)}
              </div>
            )}
            <div className="flex flex-col gap-1.5 justify-center">
              <StarRating rating={avgRating} />
              {showReviewsCount && (
                <div className="text-sm font-medium leading-none text-gray-500">
                  {totalReviews} reviews
                </div>
              )}
            </div>
          </div>
          {showReviewsProgressBar && (
            <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
              {Object.entries(reviewsByRating)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([rating, ratingData]) => (
                  <ReviewBar
                    key={rating}
                    rating={Number(rating)}
                    {...ratingData}
                  />
                ))}
            </div>
          )}
        </div>
        <div
          className="mt-6 divide-y divide-gray-200 grow"
          data-motion="slide-in"
        >
          {reviewsToRender.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              showCountry={showCountry}
              showDate={showDate}
              showVerifiedBadge={showVerifiedBadge}
              verifiedBadgeText={verifiedBadgeText}
              showStar={showStar}
            />
          ))}
        </div>
      </div>
    );
  }
  return <div ref={ref} {...rest} />;
});

export default ReviewList;

export const schema: HydrogenComponentSchema = {
  type: "review-list",
  title: "Review List",
  settings: [
    {
      group: "Display",
      inputs: [
        {
          type: "toggle",
          name: "showAvgRating",
          label: "Show average rating",
          defaultValue: true,
        },
        {
          type: "toggle",
          name: "showReviewsCount",
          label: "Show reviews count",
          defaultValue: true,
        },
        {
          type: "toggle",
          name: "showReviewsProgressBar",
          label: "Show rating distribution",
          defaultValue: true,
        },
        {
          type: "number",
          name: "reviewsToShow",
          label: "Number of reviews to show",
          defaultValue: 5,
        },
        {
          type: "toggle",
          name: "showReviewWithMediaOnly",
          label: "Show reviews with media only",
          defaultValue: false,
        },
      ],
    },
  ],
};
```

### Key Features

1. **Data Processing**:
   - Calculates review statistics
   - Filters and sorts reviews
   - Handles media content

2. **UI Components**:
   - Star rating display
   - Review progress bars
   - Responsive layout

3. **Configuration**:
   - Flexible display options
   - Customizable review count
   - Media filtering

## Image with Text

A versatile component that combines images with text content in various layouts.

### Implementation

```tsx
// app/sections/image-with-text/index.tsx
import type { HydrogenComponentProps, HydrogenComponentSchema } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { ImageWithTextContent } from './content';
import { ImageWithTextImage } from './image';

interface ImageWithTextProps extends HydrogenComponentProps {
  imagePosition: 'left' | 'right';
  imageWidth: 'small' | 'medium' | 'large';
}

const ImageWithText = forwardRef<HTMLElement, ImageWithTextProps>(
  (props, ref) => {
    const { children, imagePosition, imageWidth, ...rest } = props;
    
    return (
      <section
        ref={ref}
        {...rest}
        className={`flex flex-col md:flex-row gap-8 ${
          imagePosition === 'right' ? 'md:flex-row-reverse' : ''
        }`}
      >
        <ImageWithTextImage width={imageWidth} />
        <ImageWithTextContent>{children}</ImageWithTextContent>
      </section>
    );
  },
);

export default ImageWithText;

export const schema: HydrogenComponentSchema = {
  type: 'image-with-text',
  title: 'Image with Text',
  settings: [
    {
      group: 'Layout',
      inputs: [
        {
          type: 'select',
          name: 'imagePosition',
          label: 'Image position',
          configs: {
            options: [
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ],
          },
          defaultValue: 'left',
        },
        {
          type: 'select',
          name: 'imageWidth',
          label: 'Image width',
          configs: {
            options: [
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ],
          },
          defaultValue: 'medium',
        },
      ],
    },
  ],
  childTypes: ['subheading', 'heading', 'paragraph', 'button'],
};
```

### Key Features

1. **Layout Options**:
   - Flexible image positioning
   - Adjustable image width
   - Responsive design

2. **Component Structure**:
   - Separated content and image components
   - Clean prop handling
   - Type-safe interfaces

3. **Schema Design**:
   - Logical input grouping
   - Child component support
   - Sensible defaults

## Conclusion

These examples demonstrate various patterns and best practices for building Weaverse components:

1. **Data Integration**: Different approaches to fetching and handling data
2. **Component Structure**: Clean, maintainable component organization
3. **Schema Design**: Intuitive and flexible configuration options
4. **Styling**: Responsive and customizable layouts
5. **Accessibility**: Semantic HTML and proper ARIA attributes

Use these examples as inspiration for your own components, adapting the patterns to your specific needs while maintaining the core principles of clean, maintainable, and user-friendly component design. 