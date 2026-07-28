/** Public example. */
export declare class Example {
  private constructor(options: {
    undocumentedConstructorOption: string
  })
  private hidden
  protected get internal(): {
    undocumentedNestedMember: string
  }
  protected method(options: { undocumentedNestedOption: string }): void
  /** Visible value. */
  visible: string
}
