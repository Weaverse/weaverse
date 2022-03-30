// make the css data formatted to correct order (desktop, tablet, mobile)
export let shortCssObject = (css: { [key: string]: any }) => {
  return {
    '@desktop': css[`@desktop`],
    '@tablet': css[`@tablet`],
    '@mobile': css[`@mobile`],
  }
}
