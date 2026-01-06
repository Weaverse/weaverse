import { AdvancedGroupType, AdditionalInputConfigs as AdditionalInputConfigs$1, BasicInput as BasicInput$1, InputType as InputType$1, ToolbarAction as ToolbarAction$1, ElementData as ElementData$1, ElementCSS, ElementSchema as ElementSchema$1, WeaverseElement as WeaverseElement$1, WeaverseProjectDataType, WeaverseCoreParams, WeaverseElementProps, WeaverseResourcePickerData, Weaverse, PlatformTypeEnum, WeaverseItemStore } from '@weaverse/react';
export { AdvancedGroupType, ElementCSS, RangeInputConfigs, SelectInputConfigs, ToggleGroupConfigs, WeaverseCSSProperties, WeaverseProjectDataType } from '@weaverse/react';
import { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { HTMLAttributes, CSSProperties } from 'react';

declare let Circle: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let CircleNotch: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let X: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Minus: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Plus: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let CaretLeft: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let CaretRight: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let ArrowLeft: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let ArrowRight: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Image: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let ShoppingCart: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Storefront: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Package: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let HandBag: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Tag: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Backpack: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Newspaper: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;
declare let Eye: (props: HTMLAttributes<SVGElement>) => react_jsx_runtime.JSX.Element;

declare const PhosphorIcons_ArrowLeft: typeof ArrowLeft;
declare const PhosphorIcons_ArrowRight: typeof ArrowRight;
declare const PhosphorIcons_Backpack: typeof Backpack;
declare const PhosphorIcons_CaretLeft: typeof CaretLeft;
declare const PhosphorIcons_CaretRight: typeof CaretRight;
declare const PhosphorIcons_Circle: typeof Circle;
declare const PhosphorIcons_CircleNotch: typeof CircleNotch;
declare const PhosphorIcons_Eye: typeof Eye;
declare const PhosphorIcons_HandBag: typeof HandBag;
declare const PhosphorIcons_Image: typeof Image;
declare const PhosphorIcons_Minus: typeof Minus;
declare const PhosphorIcons_Newspaper: typeof Newspaper;
declare const PhosphorIcons_Package: typeof Package;
declare const PhosphorIcons_Plus: typeof Plus;
declare const PhosphorIcons_ShoppingCart: typeof ShoppingCart;
declare const PhosphorIcons_Storefront: typeof Storefront;
declare const PhosphorIcons_Tag: typeof Tag;
declare const PhosphorIcons_X: typeof X;
declare namespace PhosphorIcons {
  export { PhosphorIcons_ArrowLeft as ArrowLeft, PhosphorIcons_ArrowRight as ArrowRight, PhosphorIcons_Backpack as Backpack, PhosphorIcons_CaretLeft as CaretLeft, PhosphorIcons_CaretRight as CaretRight, PhosphorIcons_Circle as Circle, PhosphorIcons_CircleNotch as CircleNotch, PhosphorIcons_Eye as Eye, PhosphorIcons_HandBag as HandBag, PhosphorIcons_Image as Image, PhosphorIcons_Minus as Minus, PhosphorIcons_Newspaper as Newspaper, PhosphorIcons_Package as Package, PhosphorIcons_Plus as Plus, PhosphorIcons_ShoppingCart as ShoppingCart, PhosphorIcons_Storefront as Storefront, PhosphorIcons_Tag as Tag, PhosphorIcons_X as X };
}

type WeaverseIcon = keyof typeof PhosphorIcons;

type OptionDisplayType = 'dropdown' | 'button' | 'color' | 'variant-image' | 'custom-image';
type OptionSize = 'sm' | 'md' | 'lg';
type OptionShape = 'square' | 'round' | 'circle';
interface OptionStyle extends CSSProperties {
    '--size'?: string;
    '--radius'?: string;
}
type OptionData = {
    id: string;
    name: string;
    displayName: string;
    type: OptionDisplayType;
    size: OptionSize;
    shape: OptionShape;
};
type ColorPresets = {
    id: string;
    name: string;
    value: string;
};
type SwatchImagePresets = ColorPresets;
type TypoPresetsValue = {
    [key: string]: string;
};
type TypoPresets = {
    id: string;
    name: string;
    value: TypoPresetsValue;
};
type PresetsData = {
    colors?: ColorPresets[];
    typography?: TypoPresets[];
    colorSwatches?: ColorPresets[];
    imageSwatches?: SwatchImagePresets[];
};
type ShopifyGlobalConfigs = {
    shopData: {
        name: string;
        currency: string;
        money_format: string;
        money_with_currency_format: string;
        products_count: number;
        product_handle: string;
        product_id: number;
        template: string;
        template_name: string;
        request: {
            design_mode: boolean;
            host: string;
            origin: string;
            page_type: string;
            path: string;
        };
        url: string;
        secure_url: string;
        domain: string;
        permanent_domain: string;
        primary_locale: string;
        shop_locale: {
            published_locales: {
                shop_locale: {
                    locale: string;
                    enabled: boolean;
                    primary: boolean;
                    published: boolean;
                };
            }[];
            current: string;
            primary: string;
        };
        routes: {
            all_products_collection_url: string;
            cart_add_url: string;
            cart_change_url: string;
            cart_clear_url: string;
            cart_update_url: string;
            cart_url: string;
            collections_url: string;
            predictive_search_url: string;
            product_recommendations_url: string;
            root_url: string;
            search_url: string;
        };
    };
    swatches: OptionData[];
    presets: PresetsData;
};
type WeaverseCartHelpers = {
    subscribe: (event: string, callback: (data: any) => void) => void;
    unsubscribe: (event: string, callback: (data: any) => void) => void;
    notify: (event: string, data: any) => void;
};

interface WeaverseElement extends WeaverseElement$1 {
    schema?: ElementSchema;
    defaultCss?: ElementCSS;
    permanentCss?: ElementCSS;
    extraData?: {
        [key: string]: unknown;
    };
}
interface ElementData extends ElementData$1 {
    childIds?: (string | number)[];
    css?: ElementCSS;
}
type CatalogGroup = 'essential' | 'composition' | 'shopify';
type ElementCatalog = {
    name: string;
    icon?: string;
    group?: CatalogGroup;
    data?: ElementDataInCatalog[];
};
type ParentType = 'container' | 'layout' | 'root' | 'product-details' | 'product-info' | 'slideshow' | 'slide';
type GridSize = {
    rowSpan: number;
    colSpan: number;
};
type ToolbarAction = ToolbarAction$1 | 'text-presets' | 'ai-assistant' | 'scale-text' | 'copy-styles' | 'paste-styles' | 'move-up' | 'move-down' | 'next-slide' | 'prev-slide' | 'change-background' | 'toggle-visibility' | 'more-actions';
type FlagType = 'draggable' | 'resizable' | 'sortable' | 'ignoreShortcutKeys' | 'hasContextMenu' | 'isSortableContext' | 'mustHaveChildren';
type ElementFlags = Partial<Record<FlagType, boolean>>;
type ChildElementSelector = string | string[];
type ChildElement = {
    label: string;
    selector: ChildElementSelector;
};
type ElementInspector = {
    settings?: (AdvancedGroup | BasicGroup)[];
    styles?: (AdvancedGroup | BasicGroup)[];
};
type AdvancedGroup = {
    groupType: AdvancedGroupType;
};
type BasicGroup = {
    groupType: 'basic';
    groupHeader: string;
    inputs: BasicInput[];
};
type InputType = InputType$1 | 'children-sort' | 'data-sort' | 'information' | 'custom.html' | 'product-swatches' | 'instagram';
type AdditionalInputConfigs = AdditionalInputConfigs$1 | ChildrenSortInputConfigs | DataSortInputConfigs;
type ChildrenSortInputConfigs = {
    actions: SortableItemAction[];
};
type SortableItemAction = 'add' | 'edit' | 'duplicate' | 'delete' | 'toggle-visibility';
type DataSortInputConfigs = {
    defaultData: object;
    inspector: string;
};
interface BasicInput<T = AdditionalInputConfigs> extends Omit<BasicInput$1, 'type' | 'configs'> {
    type: InputType;
    binding?: 'data' | 'style';
    configs?: T;
}
interface ElementSchema extends ElementSchema$1 {
    parentTypes: ParentType[];
    gridSize?: GridSize;
    inspector?: ElementInspector;
    toolbar?: (ToolbarAction | ToolbarAction[])[];
    childElements?: ChildElement[];
    catalog?: ElementCatalog;
    flags?: ElementFlags;
}
interface ElementDataInCatalog extends Omit<ElementData, 'id'> {
    id: string | number;
}
interface WeaverseShopifySectionData extends WeaverseProjectDataType {
    script?: {
        css: string;
        js: string;
    };
}
interface WeaverseShopifyParams extends Omit<WeaverseCoreParams, 'ItemConstructor'> {
    thirdPartyIntegration?: ThirdPartyIntegration[];
    elementSchemas?: ElementSchema[];
    ssrMode?: boolean;
    data: WeaverseShopifySectionData;
}

type ShopifyProductImage = {
    created_at: string;
    id: number;
    position: number;
    product_id: number;
    variant_ids: number[];
    src: string;
    width: number;
    height: number;
    updated_at: string;
    alt: string | null;
};
type ShopifyProductVariant = {
    barcode: string;
    compare_at_price: string | number | null;
    created_at: string;
    fulfillment_service: string;
    grams: number;
    id: number;
    image_id: number | null;
    inventory_item_id: number;
    inventory_management: string;
    inventory_policy: ProductVariantInventoryPolicy;
    inventory_quantity: number;
    old_inventory_quantity: number;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    presentment_prices: ShopifyProductVariantPresentmentPriceSet[];
    position: number;
    price: string | number;
    product_id: number;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    tax_code: string | null;
    title: string;
    updated_at: string;
    weight: number;
    weight_unit: ProductVariantWeightUnit;
    available: boolean;
    options: string[];
    featured_image: ShopifyProductImage;
};
type ShopifyProductVariantPresentmentPriceSet = {
    price: ShopifyMoney;
    compare_at_price: ShopifyMoney;
};
type ShopifyMoney = {
    amount: number | string;
    currency_code: string;
};
type ProductVariantInventoryPolicy = 'deny' | 'continue';
type ProductVariantWeightUnit = 'g' | 'kg' | 'oz' | 'lb';
type OptionKey = 'option1' | 'option2' | 'option3';
type ShopifyProductOption = {
    id: number;
    name: string;
    position: number;
    product_id: number;
    values: string[];
};
type ShopifyProduct = {
    body_html: string;
    created_at: string;
    handle: string;
    id: number;
    image: ShopifyProductImage;
    images: ShopifyProductImage[];
    options: ShopifyProductOption[];
    product_type: string;
    published_at: string;
    published_scope: string;
    tags: string;
    template_suffix: string | null;
    title: string;
    metafields_global_title_tag?: string;
    metafields_global_description_tag?: string;
    updated_at: string;
    variants: ShopifyProductVariant[];
    vendor: string;
    status: 'active' | 'archived' | 'draft';
    featured_image: string;
    aspect_ratio: number;
    selected_or_first_available_variant: ShopifyProductVariant;
    has_only_default_variant: boolean;
    price: string | number;
    price_max: string | number;
    price_min: string | number;
    price_varies: boolean;
    compare_at_price: string | number;
    compare_at_price_max: string | number;
    compare_at_price_min: string | number;
    compare_at_price_varies: boolean;
    url: string;
    media?: ShopifyProductImage[];
};
type ShopifyCollectionImage = {
    created_at: string;
    height: number;
    src: string;
    updated_at?: string;
    width: number;
    alt: string | null;
};
type ShopifyCollection = {
    admin_graphql_api_id: string;
    body_html: string;
    collection_type: string;
    handle: string;
    id: number;
    image: string | ShopifyCollectionImage | null;
    products_count: number;
    published_at: string;
    published_scope: string;
    sort_order: string;
    template_suffix: string | null;
    title: string;
    updated_at: string;
    url: string;
    featured_image: string | ShopifyCollectionImage | null;
};
type ShopifyArticleImage = {
    created_at: string;
    height: number;
    src: string;
    updated_at?: string;
    width: number;
    alt: string | null;
};
type ShopifyObjectMetafield = {
    key: string;
    namespace: string;
    value: string | number;
    value_type: 'string' | 'integer';
    description: string | null;
};
type ShopifyArticle = {
    author: string;
    blog_id: number;
    body_html: string;
    created_at: string;
    id: number;
    handle: string;
    image: string | ShopifyArticleImage | null;
    metafields: ShopifyObjectMetafield[];
    published: boolean;
    published_at: string;
    summary_html: string | null;
    tags: string;
    template_suffix: string | null;
    title: string;
    updated_at: string;
    user_id: number;
    url: string;
    excerpt: string | null;
};
type InformationThirdParty = {
    developer: string;
    image: string;
    rating: number;
    description: string;
    available?: string;
    hyperlink: string;
};
type CatalogThirdParty = {
    title: string;
    type: string;
    extraData?: Record<string, unknown>;
    inspector?: ElementInspector;
    flags?: ElementFlags;
    parentTypes?: ParentType[];
    toolbar?: (ToolbarAction | ToolbarAction[])[];
    gridSize?: GridSize;
    catalog?: ElementCatalog;
};
type ThirdPartyIntegration = {
    appType?: string;
    id?: string;
    name?: string;
    information?: InformationThirdParty;
    elements: CatalogThirdParty[];
    order?: number;
};

type ProductContextType = {
    product: ShopifyProduct;
    productId?: string | number;
    formRef: React.RefObject<HTMLFormElement>;
    selectedVariant: ShopifyProductVariant | null;
    setSelectedVariant: (variant: ShopifyProductVariant) => void;
    /**
     * Indicates whether the product element is ready for interaction.
     */
    ready: boolean;
};
type ProductListContextProps = {
    productId?: string | number;
};
type ProductCardProps = {
    product: ShopifyProduct;
    imageAspectRatio: AspectRatio;
    showSecondImageOnHover: boolean;
    showSaleBadge: boolean;
    showViewDetailsButton: boolean;
    viewDetailsButtonText: string;
    showQuickViewButton: boolean;
    showProductOption: boolean;
    optionName: string;
    optionLimit: number;
    className?: string;
};
type ProductCardInfoProps = Pick<ProductCardProps, 'product' | 'showProductOption' | 'optionName' | 'optionLimit'>;
type ProductCardOptionsProps = Pick<ProductCardProps, 'product' | 'optionName' | 'optionLimit'>;
interface ProductCardButtonsProps extends Pick<ProductCardProps, 'showViewDetailsButton' | 'viewDetailsButtonText' | 'showQuickViewButton'> {
    product: ShopifyProduct;
}
type ProductListSource = 'collection' | 'recommended' | 'fixedProducts';
type FixedProduct = {
    productId: string;
    productHandle: string;
};
interface ProductListProps extends WeaverseElementProps, ProductCardProps {
    source: ProductListSource;
    collectionId: number;
    collectionHandle: string;
    fixedProducts: FixedProduct[];
    layout: 'grid' | 'slider';
    productCount: number;
    productsPerRow: number;
    gap: number;
}
type CollectionCardProps = {
    collection: ShopifyCollection;
    imageAspectRatio: AspectRatio;
    showProductCount: boolean;
    zoomInOnHover: boolean;
    className?: string;
};
interface CollectionListProps extends WeaverseElementProps, CollectionCardProps {
    collections: {
        collectionId: number;
        collectionHandle: string;
    }[];
    layout: 'grid' | 'slider';
    collectionsPerRow: number;
    gap: number;
}
type ArticleCardProps = {
    article: ShopifyArticle;
    imageAspectRatio: AspectRatio;
    zoomInOnHover: boolean;
    showDate: boolean;
    dateFormat?: string;
    showAuthor: boolean;
    showExcerpt: boolean;
    excerptLineClamp: number;
    showReadMoreButton: boolean;
    readMoreButtonText: string;
    className?: string;
};
interface ArticleListProps extends WeaverseElementProps, ArticleCardProps {
    blogId: number;
    blogHandle: string;
    layout: 'grid' | 'slider';
    articleCount: number;
    articlesPerRow: number;
    gap: number;
}
interface UseProductHookInput extends Pick<ProductListProps, 'source' | 'collectionId' | 'fixedProducts'> {
    isDesignMode: boolean;
}
type ProductSkeletonProps = {
    productCount: number;
    imageAspectRatio: AspectRatio;
};
type CollectionSkeletonProps = {
    collectionCount: number;
    imageAspectRatio: AspectRatio;
};
type ArticleSkeletonProps = {
    articleCount: number;
    imageAspectRatio: AspectRatio;
};
interface ProductDetailsProps extends WeaverseElementProps {
    productId: number | 'default';
    productHandle: string;
    useDefaultProduct: boolean;
    product?: WeaverseResourcePickerData;
}
interface ProductInfoProps extends WeaverseElementProps {
}
type ProductMediaSize = 'small' | 'medium' | 'large';
type AspectRatio = 'auto' | '1/1' | '3/4' | '4/3';
interface ProductMediaProps extends WeaverseElementProps {
    mediaSize: ProductMediaSize;
    aspectRatio: AspectRatio;
    fallbackImage: string;
    allowFullscreen: boolean;
    thumbnailSlidePerView: number;
}
type ProductImageHooksInput = {
    context: ProductContextType | null;
    thumbnailSlidePerView: number;
    onSlideChanged?: (slider: KeenSliderInstance) => void;
    onSliderCreated?: (slider: KeenSliderInstance) => void;
    ResizePlugin: KeenSliderPlugin;
};
type ProductMediaArrowsProps = {
    currentSlide: number;
    instanceRef: React.MutableRefObject<KeenSliderInstance | null>;
};
type ProductMediaDotsProps = {
    currentSlide: number;
    instanceRef: React.MutableRefObject<KeenSliderInstance | null>;
};
interface ProductImageProps extends React.DOMAttributes<HTMLImageElement> {
    image: ShopifyProductImage;
    width: number;
    className?: string;
}
type MediaFullscreenSliderProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    images: ShopifyProductImage[];
};
interface ProductTitleProps extends WeaverseElementProps {
    htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    clickAction: 'none' | 'goToProductPage';
}
interface ProductDescriptionProps extends WeaverseElementProps {
    lineClamp: number;
    showViewDetailsButton: boolean;
    viewDetailsText: string;
    viewDetailsClickAction: 'viewDetails' | 'goToProductPage';
    isInsideProductQuickView: boolean;
}
type ProductDescriptionViewDetailsProps = {
    viewDetailsText: string;
    children: React.ReactNode;
};
interface ProductVendorProps extends WeaverseElementProps {
    showLabel: boolean;
    labelText: string;
    clickAction: 'none' | 'openLink';
    openInNewTab: boolean;
}
interface ProductMetaProps extends WeaverseElementProps {
    showSKU: boolean;
    showTags: boolean;
    showVendor: boolean;
    showType: boolean;
}
interface ProductPriceProps extends WeaverseElementProps {
    showCompareAt: boolean;
    showComparePriceFirst: boolean;
    showSaleBadge: boolean;
}
interface ProductBuyButtonProps extends WeaverseElementProps {
    showQuantitySelector: boolean;
    quantityLabel: string;
    buttonText: string;
    soldOutText: string;
    unavailableText: string;
}
interface ProductVariantProps extends WeaverseElementProps {
    optionsStyle: 'combined' | 'custom';
    showTooltip: boolean;
    hideUnavailableOptions: boolean;
}
type CombinedVariantProps = {
    context: ProductContextType;
};
interface OptionValuesProps extends Pick<ProductVariantProps, 'showTooltip' | 'hideUnavailableOptions'> {
    product: ShopifyProduct;
    option: ShopifyProductOption;
    type: OptionDisplayType;
    selectedValue: string | null | undefined;
    selectedOptions: string[];
    onSelect: (position: number, value: string) => void;
}
interface FormElementProps extends WeaverseElementProps {
    formType: string;
    fields: FormField[];
    submitText: string;
    submitPosition: 'left' | 'right' | 'center';
    openInNewTab: boolean;
    targetLink: string;
}
type FormFieldType = 'text' | 'email' | 'multiline';
type FormField = {
    id: string;
    type: FormFieldType;
    placeholder: string;
    showLabel: boolean;
    label: string;
    name?: string;
    required: boolean;
};
type FieldProps = {
    field: FormField;
    formId: string;
};
type CollectionContextProps = {
    [key: string]: any;
};
interface CustomHTMLProps extends WeaverseElementProps {
    content: string;
}
interface ThirdPartyProps extends WeaverseElementProps {
    snippet_code: string;
    information: unknown;
    placeholder: {
        name: string;
        content: string;
    };
}
type Hotspot = {
    id: string;
    productId: number | null;
    productHandle: string;
    offsetX: number;
    offsetY: number;
};
interface HotspotsProps extends WeaverseElementProps {
    image: string;
    aspectRatio: AspectRatio;
    icon: WeaverseIcon;
    color: 'light' | 'dark';
    hotspots: Hotspot[];
}
declare global {
    interface Window {
        createWeaverseStudioBridge: (weaverse: WeaverseShopify) => void;
        weaverseShopifyConfigs: ShopifyGlobalConfigs;
        weaverseShopifyProducts: Record<number, ShopifyProduct>;
        weaverseShopifyProductsByCollection: Record<number, number[]>;
        weaverseShopifyCollections: Record<number, ShopifyCollection>;
        weaverseShopifyArticlesByBlog: Record<number, number[]>;
        weaverseShopifyArticles: Record<number, ShopifyArticle>;
        weaverseCartHelpers: WeaverseCartHelpers;
        weaverseSlideshowInstances: Record<string, KeenSliderInstance>;
    }
}

/**
 * Fetch data from Weaverse API (https://weaverse.io/api/v1/project/:sectionId)
 * @param fetch {fetch} custom fetch function, pass in custom fetch function if you want to use your own fetch function
 * @param weaverseHost
 * @param sectionId
 * @param isDesignMode
 */
declare function fetchProjectData({ fetch, weaverseHost, sectionId, isDesignMode, timestamp, }: {
    fetch?: any;
    weaverseHost?: string;
    sectionId?: string;
    isDesignMode?: boolean;
    timestamp?: number;
}): Promise<any>;

declare function createWeaverseShopify(params: WeaverseShopifyParams): WeaverseShopify;
declare function ShopifyRoot({ context }: {
    context: WeaverseShopify;
}): react_jsx_runtime.JSX.Element;

declare let registerThirdPartyElements: () => void;
declare let registerShopifyElements: () => void;
declare class WeaverseShopify extends Weaverse {
    platformType: PlatformTypeEnum;
    static integrations: ThirdPartyIntegration[];
    elementSchemas: ElementSchema[];
    ssrMode: boolean;
    ItemConstructor: typeof WeaverseShopifyItem;
    data: WeaverseShopifySectionData;
    static itemInstances: Map<string, WeaverseShopifyItem>;
    static elementRegistry: Map<string, WeaverseElement>;
    constructor(params: WeaverseShopifyParams);
}
declare class WeaverseShopifyItem extends WeaverseItemStore {
    weaverse: WeaverseShopify;
    constructor(initialData: ElementData, weaverse: WeaverseShopify);
    get Element(): WeaverseElement;
    get _flags(): ElementFlags;
}

export { type AdditionalInputConfigs, type AdvancedGroup, type ArticleCardProps, type ArticleListProps, type ArticleSkeletonProps, type AspectRatio, type BasicGroup, type BasicInput, type CatalogGroup, type ChildElement, type ChildElementSelector, type ChildrenSortInputConfigs, type CollectionCardProps, type CollectionContextProps, type CollectionListProps, type CollectionSkeletonProps, type ColorPresets, type CombinedVariantProps, type CustomHTMLProps, type DataSortInputConfigs, type ElementCatalog, type ElementData, type ElementDataInCatalog, type ElementFlags, type ElementInspector, type ElementSchema, type FieldProps, type FixedProduct, type FlagType, type FormElementProps, type FormField, type FormFieldType, type GridSize, type Hotspot, type HotspotsProps, type InputType, type MediaFullscreenSliderProps, type OptionData, type OptionDisplayType, type OptionKey, type OptionShape, type OptionSize, type OptionStyle, type OptionValuesProps, type ParentType, type PresetsData, type ProductBuyButtonProps, type ProductCardButtonsProps, type ProductCardInfoProps, type ProductCardOptionsProps, type ProductCardProps, type ProductContextType, type ProductDescriptionProps, type ProductDescriptionViewDetailsProps, type ProductDetailsProps, type ProductImageHooksInput, type ProductImageProps, type ProductInfoProps, type ProductListContextProps, type ProductListProps, type ProductListSource, type ProductMediaArrowsProps, type ProductMediaDotsProps, type ProductMediaProps, type ProductMediaSize, type ProductMetaProps, type ProductPriceProps, type ProductSkeletonProps, type ProductTitleProps, type ProductVariantInventoryPolicy, type ProductVariantProps, type ProductVariantWeightUnit, type ProductVendorProps, type ShopifyArticle, type ShopifyArticleImage, type ShopifyCollection, type ShopifyCollectionImage, type ShopifyGlobalConfigs, type ShopifyMoney, type ShopifyObjectMetafield, type ShopifyProduct, type ShopifyProductImage, type ShopifyProductOption, type ShopifyProductVariant, type ShopifyProductVariantPresentmentPriceSet, ShopifyRoot, type SortableItemAction, type SwatchImagePresets, type ThirdPartyIntegration, type ThirdPartyProps, type ToolbarAction, type TypoPresets, type TypoPresetsValue, type UseProductHookInput, type WeaverseCartHelpers, type WeaverseElement, WeaverseShopify, WeaverseShopifyItem, type WeaverseShopifyParams, type WeaverseShopifySectionData, createWeaverseShopify, fetchProjectData, registerShopifyElements, registerThirdPartyElements };
