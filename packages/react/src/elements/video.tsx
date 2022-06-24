import {WeaverseElementSchema} from '@weaverse/core'
import React, {FC, forwardRef, useContext} from 'react'
import {WeaverseContext} from '../context'

const Video: FC = forwardRef((props, ref) => {
  const {isDesignMode} = useContext(WeaverseContext)
  let {src, type, controls, autoPlay, loop, muted, ...rest} = props

  if (isDesignMode) {
    controls = false
    autoPlay = false
  }
  console.info("9779 props", props, isDesignMode)
  return <video ref={ref} controls={controls} autoPlay={autoPlay} loop={loop} muted={true} {...rest}>
    <source src={src} type={type || "video/mp4"} controlsList="nodownload" disablePictureInPicture/>
  </video>
})

Video.defaultProps = {
  src: "https://ucarecdn.com/7cae0dab-8966-4484-9998-602728c360ca/IMG_0048.MOV",
  poster: "https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png",
  loop: false,
  type: "video/mp4",
  controls: false,
  autoPlay: true,
  muted: true,
  width: "100%",
  height: "auto"
}

export const schema: WeaverseElementSchema = {
  title: 'Video',
  type: "video",
  parentType: "layout",
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
  flags: {
    resizable: true,
    draggable: true,
    sortable: true,
  }
}

export default Video