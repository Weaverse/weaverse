import { Components } from '~/components'
import type { ProductDescriptionViewDetailsProps } from '~/types'

let { Modal, ModalTrigger, ModalHeader, ModalContent } =
  Components.ModalComponents

export function ViewDetails(props: ProductDescriptionViewDetailsProps) {
  let { viewDetailsText, children } = props
  return (
    <Modal>
      <ModalTrigger asChild>
        <button className="wv-view-details-button" type="button">
          {viewDetailsText}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Product description</ModalHeader>
        {children}
      </ModalContent>
    </Modal>
  )
}
