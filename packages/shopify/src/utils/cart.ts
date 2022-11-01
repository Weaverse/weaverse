export function addProductToCart(
  productForm: HTMLFormElement,
  onFinish: () => void
) {
  fetch('/cart/add.js', {
    method: 'post',
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
