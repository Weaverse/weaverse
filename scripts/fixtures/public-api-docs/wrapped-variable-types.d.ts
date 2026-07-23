/** Union-wrapped public value. */
export declare const unionValue:
  | string
  | {
      undocumentedUnionMember: string
    }

/** Intersection-wrapped public value. */
export declare const intersectionValue: {
  /** Documented intersection member. */
  documentedPart: string
} & {
  undocumentedIntersectionMember: string
}

/** React component with inline props. */
export declare const InlineComponent: React.FC<{
  undocumentedReactProp: string
}>

/** Public array with inline elements. */
export declare const inlineArray: Array<{
  undocumentedArrayElement: string
}>

/** Public value wrapped by an arbitrary generic. */
export declare const genericValue: GenericWrapper<{
  undocumentedGenericMember: string
}>

/** Public promise with an inline result. */
export declare const promisedValue: Promise<{
  undocumentedPromiseMember: string
}>

/** Non-Zod generic whose name merely starts with the same letters. */
export declare const zodiacValue: Zodiac<{
  undocumentedZodiacMember: string
}>
