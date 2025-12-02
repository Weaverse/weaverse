import type { VimeoElementProps } from '~/types/components'

export function Vimeo(props: VimeoElementProps) {
  let { vimeoId, controls, autoPlay, loop, muted } = props
  let params = `autoplay=${autoPlay}&loop=${loop}&controls=${controls}&muted=${muted}`
  let vimeoSrc = `https://player.vimeo.com/video/${vimeoId}?${params}`
  return (
    <iframe
      allowFullScreen
      height="100%"
      src={vimeoSrc}
      title="Vimeo embed video"
      width="100%"
    />
  )
}
