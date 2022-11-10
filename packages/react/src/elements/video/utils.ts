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
