import { Components } from '@weaverse/react'
import React from 'react'
import type { ProductDescriptionViewDetailsProps } from '~/types'

let { Modal, ModalTrigger, ModalHeader, ModalContent } =
  Components.ModalComponents

export function ViewDetails(props: ProductDescriptionViewDetailsProps) {
  let { viewDetailsText, children } = props
  return (
    <Modal>
      <ModalTrigger asChild>
        <button type="button" className="wv-view-details-button">
          {viewDetailsText}
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>Product decription</ModalHeader>
        <div className="wv-modal-content-wrapper">{children}</div>
      </ModalContent>
    </Modal>
  )
}
