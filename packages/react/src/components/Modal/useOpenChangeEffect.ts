import type { DialogProps } from '@radix-ui/react-dialog'
import { useEffect } from 'react'

export function useOpenChangeEffect(props: DialogProps) {
  let { open, defaultOpen, onOpenChange } = props

  useEffect(() => {
    let isOpen = open || defaultOpen
    if (isOpen) {
      document.body.classList.add('wv-modal-open')
    } else {
      document.body.classList.remove('wv-modal-open')
    }
  }, [open, defaultOpen])

  let handleOpenChange = (open: boolean) => {
    if (open) {
      document.body.classList.add('wv-modal-open')
    } else {
      document.body.classList.remove('wv-modal-open')
    }
    onOpenChange?.(open)
  }

  return handleOpenChange
}
