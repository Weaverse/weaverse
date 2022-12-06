export function addProductToCart(
  productForm: HTMLFormElement,
  onFinish: () => void
) {
  let { cart_add_url = '/cart/add.js' } =
    window.weaverseShopifyConfigs?.shopData?.routes || {}
  fetch(cart_add_url, {
    method: 'POST',
    body: new FormData(productForm),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 422) {
        throw new Error(data.description)
      } else {
        window?.weaverseCartHelpers?.notify('on_item_added', data)
      }
    })
    .catch((err) =>
      console.error(`Error adding product to cart: ${err.message}`)
    )
    .finally(onFinish)
}
