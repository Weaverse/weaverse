import type { CountdownTimeKey } from '~/types'

export function getTime(_seconds: number): {
  [key in CountdownTimeKey]: number
} {
  let ONE_MINUTE = 60 * 1000
  let ONE_HOUR = 60 * ONE_MINUTE
  let ONE_DAY = 24 * ONE_HOUR
  let days = Math.floor(_seconds / ONE_DAY)
  let hours = Math.floor((_seconds - days * ONE_DAY) / ONE_HOUR)
  let minutes = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE
  )
  let seconds = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR - minutes * ONE_MINUTE) / 1000
  )
  return { days, hours, minutes, seconds }
}

export function getYoutubeEmbedId(url: string) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
  )
  return match ? match[1] : null
}

export function getVimeoId(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/)
  return match ? match[1] : null
}
