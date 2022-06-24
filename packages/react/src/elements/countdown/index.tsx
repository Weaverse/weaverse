import React, {FC, forwardRef, useContext, useEffect} from 'react'
import {WeaverseElementSchema} from '@weaverse/core'
import {WeaverseContext} from '../../context'
import {getTime} from './utils'
import TimerBlock from './timer-block'


const Countdown: FC = forwardRef((props, ref) => {
  const {isDesignMode} = useContext(WeaverseContext)
  let {type, startTime, endTime, periods, redirectUrl, openInNewTab} = props
  const [remaining, setRemaining] = React.useState(0)
  if (typeof endTime !== 'number') {
    endTime = Number.parseInt(endTime)
  }
  useEffect(() => {
    const flag = setInterval(() => {
      const remainingTime = Math.max((type === 'specific' ? new Date(endTime).getTime() : (new Date(startTime) + periods * 60 * 1000)) - Date.now(), 0 )
      if (!isDesignMode && redirectUrl && remainingTime > 0 && remainingTime < 1000) {
        window.open(redirectUrl, openInNewTab ? "_blank": "_self")
      }
      setRemaining(remainingTime)
    }, 1000)
    return () => {
      clearInterval(flag)
    }
  }, [startTime, endTime, periods, type])
  // const remainingTime = (type === 'specific' ? new Date(endTime).getTime() : (new Date(startTime) + periods * 60 * 1000)) - Date.now()
  const timer = getTime(remaining)
  return <div ref={ref} {...props}>
    <TimerBlock value={timer.days} label="days"/>
    <span>:</span>
    <TimerBlock value={timer.hours} label="hours"/>
    <span>:</span>
    <TimerBlock value={timer.mins} label="minutes"/>
    <span>:</span>
    <TimerBlock value={timer.secs} label="seconds"/>
  </div>
})

Countdown.defaultProps = {
  type: "specific",
  startTime: Date.now(),
  endTime: 1661140528000,
  redirectUrl: "",
  openInNewTab: false

}

export const schema: WeaverseElementSchema = {
  title: 'Countdown',
  type: "countdown",
  parentType: "container",
  styles: [
    {
      type: 'dimensions'
    },
    {
      type: 'alignment'
    },
    {
      type: 'border'
    },
    {
      type: 'background'
    },
    {
      type: 'spacing'
    },
  ],
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
  data: {
    css: {
      '@desktop': {
        fontFamily: 'Inter',
        fontSize: "36px",
        fontWeight: 500,
        display: "grid",
        gridAutoFlow: "column",
        gap: "10px",
        "& > div": {
          width: "48px",
          textAlign: "center"
        },
        "& .wv-countdown-label": {
          fontSize: "10px"
        },
        "& > span": {
          lineHeight: "100%"
        }
      }
    }
  },
  flags: {
    draggable: true
  }
}

export default Countdown