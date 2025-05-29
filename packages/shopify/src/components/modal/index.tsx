import type {
  DialogCloseProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from '@radix-ui/react-dialog'
import { Close, Portal, Root, Trigger } from '@radix-ui/react-dialog'

import { forwardRef } from 'react'
import type { ModalContentProps } from '~/types/components'
import { Icon } from '../icons'
import {
  StyledCloseIcon,
  StyledContent,
  StyledOverlay,
  StyledTitle,
} from './styled'
import { useOpenChangeEffect } from './use-open-change-effect'

export let Modal = (props: DialogProps) => {
  let { children, open, defaultOpen, onOpenChange, ...rest } = props
  let handleOpenChange = useOpenChangeEffect(props)

  return (
    <Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      {...rest}
    >
      {children}
    </Root>
  )
}

export let ModalTrigger: React.FC<
  DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = Trigger
export let ModalHeader = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    let { children, ...rest } = props
    return (
      <StyledTitle ref={ref} {...rest} data-wv-modal-header>
        {children}
      </StyledTitle>
    )
  },
)

export let ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (props, ref) => {
    let { children, size, portal, ...rest } = props
    let modalContent = (
      <>
        <StyledOverlay />
        <StyledContent
          {...rest}
          onCloseAutoFocus={(e: Event) => e.preventDefault()}
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
  },
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
        <Icon name="X" />
      </StyledCloseIcon>
    )
    return (
      <Close asChild {...rest} ref={ref}>
        {asChild ? children : closeIcon}
      </Close>
    )
  },
)
