import type { DialogContentProps } from '@radix-ui/react-dialog'

export interface ModalContentProps extends DialogContentProps {
  size?: 'auto' | 'fullscreen'
  portal?: boolean
}
