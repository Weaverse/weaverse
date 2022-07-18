import React, { FC, forwardRef, useContext, useEffect } from 'react'
import { WeaverseElementSchema } from '@weaverse/core'
import { WeaverseContext } from '../../context'
import { getTime } from './utils'
import TimerBlock from './timer-block'

const Countdown: FC = forwardRef((props, ref) => {
  const { isDesignMode } = useContext(WeaverseContext)
  let {
    type,
    startTime,
    endTime,
    periods,
    redirectUrl,
    openInNewTab,
    showColon,
    showLabel,
  } = props
  const [remaining, setRemaining] = React.useState(0)
  if (typeof endTime !== 'number') {
    endTime = Number.parseInt(endTime)
  }
  useEffect(() => {
    const flag = setInterval(() => {
      const remainingTime = Math.max(
        (type === 'specific'
          ? new Date(endTime).getTime()
          : new Date(startTime) + periods * 60 * 1000) - Date.now(),
        0
      )
      if (
        !isDesignMode &&
        redirectUrl &&
        remainingTime > 0 &&
        remainingTime < 1000
      ) {
        window.open(redirectUrl, openInNewTab ? '_blank' : '_self')
      }
      setRemaining(remainingTime)
    }, 1000)
    return () => {
      clearInterval(flag)
    }
  }, [startTime, endTime, periods, type])
  // const remainingTime = (type === 'specific' ? new Date(endTime).getTime() : (new Date(startTime) + periods * 60 * 1000)) - Date.now()
  const timer = getTime(remaining)
  return (
    <div ref={ref} {...props}>
      <TimerBlock value={timer.days} label={showLabel && 'days'} />
      <span className={!showColon && 'hidden'}>:</span>
      <TimerBlock value={timer.hours} label={showLabel && 'hours'} />
      <span className={!showColon && 'hidden'}>:</span>
      <TimerBlock value={timer.mins} label={showLabel && 'minutes'} />
      <span className={!showColon && 'hidden'}>:</span>
      <TimerBlock value={timer.secs} label={showLabel && 'seconds'} />
    </div>
  )
})

Countdown.defaultProps = {
  type: 'specific',
  startTime: Date.now(),
  endTime: 1661140528000,
  redirectUrl: '',
  openInNewTab: false,
  showLabel: true,
  showColon: true,
}

export const schema: WeaverseElementSchema = {
  title: 'Countdown',
  type: 'countdown',
  parentType: 'container',
  toolbar: [
    {
      type: 'delete',
    },
    {
      type: 'duplicate',
    },
    {
      type: 'link',
    },
    {
      type: 'color',
    },
  ],
  data: {
    css: {
      '@desktop': {
        fontFamily: 'Inter',
        fontSize: 36,
        fontWeight: 500,
        display: 'grid',
        gridAutoFlow: 'column',
        gap: 10,
        '& > div': {
          width: 48,
          textAlign: 'center',
        },
        '& .wv-countdown-label': {
          fontSize: 10,
        },
        '& > span': {
          lineHeight: '100%',
        },
        '& .hidden': {
          visibility: 'hidden',
        },
      },
    },
  },
  flags: {
    draggable: true,
  },
}

export default Countdown
