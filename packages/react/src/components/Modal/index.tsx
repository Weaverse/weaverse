import type {
  DialogCloseProps,
  DialogContentProps,
} from '@radix-ui/react-dialog'
import { Close, Portal, Root, Trigger } from '@radix-ui/react-dialog'
import React, { forwardRef } from 'react'
import {
  StyledCloseIcon,
  StyledContent,
  StyledOverlay,
  StyledTitle,
} from './styled'

export let Modal = Root
export let ModalTrigger = Trigger
export let ModalHeader = StyledTitle

export let ModalContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    let { children, ...rest } = props
    return (
      <Portal>
        <StyledOverlay />
        <StyledContent
          {...rest}
          onCloseAutoFocus={(e) => e.preventDefault()}
          ref={ref}
        >
          <ModalClose />
          <div>{children}</div>
        </StyledContent>
      </Portal>
    )
  }
)

export let ModalClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  (props, ref) => {
    let { asChild, children, ...rest } = props
    let closeIcon = (
      <StyledCloseIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
