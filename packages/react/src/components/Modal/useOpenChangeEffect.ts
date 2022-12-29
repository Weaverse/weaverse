import type { DialogProps } from '@radix-ui/react-dialog'
import { useContext, useEffect } from 'react'
import { WeaverseContext } from '~/index'

export function useOpenChangeEffect(props: DialogProps) {
  let { open, defaultOpen, onOpenChange } = props
  let rootCtx = useContext(WeaverseContext)

  let toggleRootzIndex = (open?: boolean) => {
    let { contentRootElement } = rootCtx
    if (contentRootElement) {
      if (open) {
        contentRootElement.classList.add('modal-open')
      } else {
        contentRootElement.classList.remove('modal-open')
      }
    }
  }

  useEffect(() => {
    let isOpen = open || defaultOpen
    toggleRootzIndex(isOpen)
  }, [open, defaultOpen])

  let handleOpenChange = (open: boolean) => {
    toggleRootzIndex(open)
    onOpenChange?.(open)
  }

  return handleOpenChange
}
