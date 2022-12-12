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
    "@keyframes pulse": {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.5 },
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
    "[data-wv-placeholder]": {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(236, 236, 236, 0.5)",
      backgroundClip: "content-box",
      padding: "10px",
    },
    body: {
      "&.wv-modal-open": {
        ".weaverse-content-root": {
          zIndex: 9999,
          '[data-wv-type="product-details"]': {
            zIndex: 999,
          },
        },
      },
    },
    ".weaverse-content-root": {
      position: "relative",
      zIndex: 0,
      "*": {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "auto",
        textRendering: "optimizeLegibility",
        boxSizing: "border-box",
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
      select: {
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        outline: "none",
        boxShadow: "none",
        color: "currentColor",
        verticalAlign: "middle",
        backgroundColor: "transparent",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url(https://ucarecdn.com/4bb6a6e7-1ce8-4201-8f2d-da00a50105f3/)",
        backgroundSize: "10px",
        backgroundPositionX: "calc(100% - 12px)",
        paddingLeft: "12px",
        paddingRight: "35px !important",
        cursor: "pointer",
      },
      button: {
        outline: "none",
        boxShadow: "none",
        cursor: "pointer",
        border: "none",
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
      },
      ".animate-pulse": {
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
    ".wv-error-boundary": {
      textAlign: "center",
      padding: "32px 0",
      button: {
        cursor: "pointer",
        fontSize: "14px",
        padding: "4px 10px",
      },
    },
  })
  globalStyles()
}
