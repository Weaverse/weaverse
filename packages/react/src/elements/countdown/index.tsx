import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef, useContext, useEffect } from 'react'
import { WeaverseContext } from '~/context'
import type { CountdownElementProps } from '~/types'
import { TimerBlock } from './timer-block'
import { getTime, times } from './utils'

const Countdown = forwardRef<HTMLDivElement, CountdownElementProps>(
  (props, ref) => {
    const { isDesignMode } = useContext(WeaverseContext)
    let {
      timerType,
      startTime,
      endTime,
      periods,
      redirectUrl,
      openInNewTab,
      showColon,
      showLabel,
      ...rest
    } = props
    const [remaining, setRemaining] = React.useState(0)
    if (typeof endTime !== 'number') {
      endTime = Number.parseInt(endTime)
    }

    useEffect(() => {
      const flag = setInterval(() => {
        const remainingTime = Math.max(
          (timerType === 'fixed-time'
            ? new Date(endTime).getTime()
            : new Date(startTime).getTime() + periods * 60 * 1000) - Date.now(),
          0
        )
        if (
          !isDesignMode &&
          redirectUrl &&
          remainingTime > 0 &&
          remainingTime < 1000
        ) {
          window.open(redirectUrl, openInNewTab ? '_blank' : '_self')
          clearInterval(flag)
        }
        setRemaining(remainingTime)
      }, 1000)
      return () => {
        clearInterval(flag)
      }
    }, [startTime, endTime, periods, timerType])

    const timer = getTime(remaining)
    return (
      <div ref={ref} {...rest}>
        {times.map((time) => {
          return (
            <React.Fragment key={time}>
              <TimerBlock label={showLabel ? time : ''} value={timer[time]} />
              {time !== 'seconds' && (
                <div>
                  <span className={`wv-cd-number ${showColon ? '' : 'hidden'}`}>
                    :
                  </span>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    fontFamily: 'Inter',
    fontSize: '36px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    gap: 10,
    lineHeight: 'initial',
    '.wv-cd-block': {
      width: 48,
      textAlign: 'center',
    },
    '.wv-cd-label': {
      fontSize: 10,
    },
    '& > span': {
      lineHeight: '100%',
    },
    '& .hidden': {
      visibility: 'hidden',
    },
  },
}

Countdown.defaultProps = {
  timerType: 'fixed-time',
  startTime: Date.now(),
  endTime: 1666756528000,
  periods: 90,
  redirectUrl: 'https://myshop.com',
  openInNewTab: false,
  showLabel: true,
  showColon: true,
}

export default Countdown
