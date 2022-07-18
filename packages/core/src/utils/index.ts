export const isReactNative = typeof navigator === "object" && navigator.product === "ReactNative";
export const isBrowser = typeof window !== "undefined" && !isReactNative;
export const isIframe = isBrowser && window.top !== window.self;
