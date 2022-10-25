import type Stitches from "@stitches/core/types/stitches"

export let stichesUtils = {
  // Abbreviated margin properties
  m: (value: string) => ({
    margin: value,
  }),
  mt: (value: string) => ({
    marginTop: value,
  }),
  mr: (value: string) => ({
    marginRight: value,
  }),
  mb: (value: string) => ({
    marginBottom: value,
  }),
  ml: (value: string) => ({
    marginLeft: value,
  }),
  mx: (value: string) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value: string) => ({
    marginTop: value,
    marginBottom: value,
  }),

  // A property for applying width/height together
  size: (value: string) => ({
    width: value,
    height: value,
  }),
  // Abbreviated padding properties
  px: (value: string) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: (value: string) => ({
    paddingTop: value,
    paddingBottom: value,
  }),
}

export function createGlobalStyles(stitches: Stitches) {
  let globalStyles = stitches.globalCss({
    "@keyframes spin": {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },
    input: {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&[type=number]": {
        "-moz-appearance": "textfield",
      },
    },
    ".wv-spinner-wrapper": {
      position: "absolute",
      inset: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "inherit",
      ".wv-spinner": {
        width: "20px",
        height: "20px",
        animation: "spin .75s linear infinite",
      },
    },
  })
  globalStyles()
}
