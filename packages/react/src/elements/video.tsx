import {WeaverseElementSchema} from '@weaverse/core'
import * as React from 'react'

const Video = React.forwardRef((props, ref) => {
  const {src, type} = props
  return <video ref={ref} {...props}>
    <source src={src} type={type || "video/mp4"} controlsList="nodownload" disablePictureInPicture/>
  </video>
})

Video.defaultProps = {
  src: "https://ucarecdn.com/7cae0dab-8966-4484-9998-602728c360ca/IMG_0048.MOV",
  poster: "https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png",
  loop: false,
  type: "video/mp4",
  controls: false,
  autoplay: true,
  muted: true,
  width: 100%,
  height: "auto"
}

export const schema: WeaverseElementSchema = {
  title: 'Video',
  type: "video",
  toolbar: [
    {
      type: 'delete'
    },
    {
      type: 'duplicate'
    },
    {
      type: 'link',
    },
    {
      type: 'color'
    }
  ],
}

export default Video