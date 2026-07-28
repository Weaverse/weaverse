/** Documented interface. */
export interface DocumentedInterface {
  /** Documented interface property. */
  value: string
}

/** Documented type alias. */
export type DocumentedAlias = {
  /** Documented alias property. */
  value: string
}

/** Public constant using a documented named type. */
export declare const documentedValue: DocumentedInterface

/** Public function using documented named types. */
export declare function transformNamed(
  value: DocumentedInterface
): DocumentedAlias
