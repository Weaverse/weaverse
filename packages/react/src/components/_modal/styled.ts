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
  backgroundColor: 'rgba(0, 0, 0, .3)',
  position: 'fixed',
  zIndex: 99999,
  inset: 0,
  animation: `${overlayShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
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
  padding: 24,
  animation: `${contentShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 99999,
  maxWidth: '90vw',
  width: 'auto',
  '*': {
    maxWidth: '100%',
  },
  '&:focus': { outline: 'none' },
  '&[data-size="fullscreen"]': {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    borderRadius: 0,
  },
  '@media (max-width: 768px)': {
    width: '90vw',
    padding: 12,
    '&[data-size="fullscreen"]': {
      width: '100vw',
    },
  },
})

export let StyledCloseIcon = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 32,
  width: 32,
  padding: 4,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgb(55, 65, 81)',
  position: 'absolute',
  top: 8,
  right: 8,
  '&:hover': {
    backgroundColor: 'rgba(112, 112, 112, .1)',
  },
  svg: {
    width: 24,
    height: 24,
  },
})
