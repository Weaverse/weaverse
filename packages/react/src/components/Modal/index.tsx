import type { DialogCloseProps, DialogTitleProps } from '@radix-ui/react-dialog'
import { Close, Portal, Root, Trigger } from '@radix-ui/react-dialog'
import React, { forwardRef } from 'react'
import type { ModalContentProps } from '~/types'
import {
  StyledCloseIcon,
  StyledContent,
  StyledOverlay,
  StyledTitle,
} from './styled'

export let Modal = Root
export let ModalTrigger = Trigger
export let ModalHeader = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    let { children, ...rest } = props
    return (
      <StyledTitle ref={ref} {...rest} data-wv-modal-header>
        {children}
      </StyledTitle>
    )
  }
)

export let ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (props, ref) => {
    let { children, size, portal, ...rest } = props
    let modalContent = (
      <>
        <StyledOverlay />
        <StyledContent
          {...rest}
          onCloseAutoFocus={(e) => e.preventDefault()}
          data-wv-modal
          data-size={size}
          ref={ref}
        >
          <ModalClose />
          <div className="wv-modal-content">{children}</div>
        </StyledContent>
      </>
    )

    if (portal) {
      return <Portal>{modalContent}</Portal>
    }
    return modalContent
  }
)

ModalContent.defaultProps = {
  size: 'auto',
  portal: false,
}

export let ModalClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  (props, ref) => {
    let { asChild, children, ...rest } = props
    let closeIcon = (
      <StyledCloseIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none" />
          <line
            x1="200"
            y1="56"
            x2="56"
            y2="200"
            fill="none"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="12"
          />
          <line
            x1="200"
            y1="200"
            x2="56"
            y2="56"
            fill="none"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="12"
          />
        </svg>
      </StyledCloseIcon>
    )
    return (
      <Close asChild {...rest} ref={ref}>
        {asChild ? children : closeIcon}
      </Close>
    )
  }
)
