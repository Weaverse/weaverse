import React, { forwardRef } from 'react'
import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog'
import type { DialogContentProps } from '@radix-ui/react-dialog'
import { styled, keyframes } from '@stitches/react'

export let Modal = Root
export let ModalTrigger = Trigger

export let ModalHeader = styled(Title, {
  margin: 0,
  fontWeight: 500,
  color: '#ededef',
  fontSize: 17,
})

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
          <div>
            <ModalClose />
            <div>{children}</div>
          </div>
        </StyledContent>
      </Portal>
    )
  }
)

export let ModalClose = Close
ModalClose.defaultProps = {
  asChild: true,
}

let overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

let contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

let StyledOverlay = styled(Overlay, {
  backgroundColor: '#707070',
  position: 'fixed',
  zIndex: 9999,
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
})

let StyledContent = styled(Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': { outline: 'none' },
  zIndex: 9999,
})
