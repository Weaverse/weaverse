export const stichesUtils = {
  // Abbreviated margin properties
  m: (value) => ({
    margin: value
  }),
  mt: (value) => ({
    marginTop: value
  }),
  mr: (value) => ({
    marginRight: value
  }),
  mb: (value) => ({
    marginBottom: value
  }),
  ml: (value) => ({
    marginLeft: value
  }),
  mx: (value) => ({
    marginLeft: value,
    marginRight: value
  }),
  my: (value) => ({
    marginTop: value,
    marginBottom: value
  }),

  // A property for applying width/height together
  size: (value) => ({
    width: value,
    height: value
  }),
  // Abbreviated padding properties
  px: (value) => ({
    paddingLeft: value,
    paddingRight: value
  })

}