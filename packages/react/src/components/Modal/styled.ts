import { Content, Overlay, Title } from '@radix-ui/react-dialog'
import { keyframes, styled } from '@stitches/react'

let overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

let contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

export let StyledOverlay = styled(Overlay, {
  display: 'block !important',
  backgroundColor: 'rgb(112 112 112 / 40%)',
  position: 'fixed',
  zIndex: 9999,
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
})

export let StyledTitle = styled(Title, {
  margin: '0 0 24px',
  fontWeight: 500,
  fontSize: 24,
  '@media (max-width: 768px)': {
    margin: '0 0 16px',
    fontSize: 20,
  },
})

export let StyledContent = styled(Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  width: 'auto',
  padding: 24,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': { outline: 'none' },
  zIndex: 9999,
  '.wv-modal-content-wrapper': {
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  '@media (max-width: 768px)': {
    width: '90vw',
    padding: 12,
  },
  '*': {
    maxWidth: '100%',
  },
})

export let StyledCloseIcon = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  padding: 2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgb(55, 65, 81)',
  position: 'absolute',
  top: 10,
  right: 10,
  '&:hover': {
    backgroundColor: 'rgb(112 112 112 / 10%)',
  },
  svg: {
    width: 18,
    height: 18,
  },
})
