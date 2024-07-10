import type { DialogProps } from '@radix-ui/react-dialog'
import { WeaverseContext } from '@weaverse/react'
import { useContext, useEffect } from 'react'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultOpen])

  let handleOpenChange = (open: boolean) => {
    toggleRootzIndex(open)
    onOpenChange?.(open)
  }

  return handleOpenChange
}
