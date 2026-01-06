import type { TooltipProps } from '~/types/components'

export function Tooltip({ children }: TooltipProps) {
  return <span className="wv-tooltip">{children}</span>
}
