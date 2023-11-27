import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useEffect } from 'react'
import { WeaverseContext } from '@weaverse/react'

import { TimerBlock } from './timer-block'

import { COUNTDOWN_KEY, TIMES } from '~/constant'
import type { CountdownElementProps } from '~/types/components'
import { getTime } from '~/utils'

let Countdown = forwardRef<HTMLDivElement, CountdownElementProps>(
  (props, ref) => {
    const { isDesignMode } = useContext(WeaverseContext)
    let {
      timerType,
      startTime: startTimeProp,
      endTime: endTimeProp,
      periods: periodsProp,
      redirectWhenTimerStops,
      redirectUrl,
      openInNewTab,
      showColon,
      showLabel,
      ...rest
    } = props
    const [remaining, setRemaining] = React.useState(0)

    let periods = periodsProp * 60 * 1000 // convert into milliseconds

    const handleEnd = () => {
      if (!isDesignMode && redirectWhenTimerStops && redirectUrl)
        window.open(redirectUrl, openInNewTab ? '_blank' : '_self')
    }

    const getStartTime = (): number => {
      let startTime = startTimeProp
      if (timerType === 'evergreen') {
        const start = localStorage.getItem(COUNTDOWN_KEY)
        if (start) {
          startTime = Number.parseInt(start)
          if (startTime + periods < Date.now()) {
            // reset when end time
            startTime = Date.now()
            localStorage.setItem(COUNTDOWN_KEY, startTime.toString())
          }
        } else {
          startTime = Date.now()
          localStorage.setItem(COUNTDOWN_KEY, startTime.toString())
        }
      }
      return startTime
    }

    const checkActive = (startTime: number): boolean =>
      startTime < Date.now() && endTimeProp > Date.now()

    const handleRemaining = () => {
      let startTime = getStartTime()
      let endTime =
        timerType === 'fixed-time' ? endTimeProp : startTime + periods
      // when active, calculate remaining time
      let isActive = checkActive(startTime)
      const remainingTime = isActive ? Math.max(endTime - Date.now(), 0) : 0
      if (remainingTime > 0 && remainingTime < 1000) {
        handleEnd()
      }
      setRemaining(remainingTime)
    }

    useEffect(() => {
      let intervalFlag: ReturnType<typeof setInterval> = setInterval(
        handleRemaining,
        1000,
      )
      return () => {
        clearInterval(intervalFlag)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTimeProp, endTimeProp, periods, timerType])

    const timer = getTime(remaining)
    return (
      <div ref={ref} {...rest}>
        {TIMES.map((time) => {
          return (
            <React.Fragment key={time}>
              <TimerBlock
                label={showLabel ? time : ''}
                value={remaining === 0 ? '--' : timer[time]}
              />
              {time !== 'seconds' && (
                <div className="wv-cd-separator">
                  {showColon && <span>:</span>}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  },
)

export let css: ElementCSS = {
  '@desktop': {
    fontSize: '36px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    gap: 10,
    lineHeight: 'initial',
    '.wv-cd-block': {
      textAlign: 'center',
      '.wv-cd-label': {
        fontSize: 10,
      },
    },
    '.wv-cd-separator': {
      span: {
        lineHeight: '100%',
      },
      '.hidden': {
        visibility: 'hidden',
      },
    },
  },
}

Countdown.defaultProps = {
  timerType: 'fixed-time',
  startTime: Date.now(),
  endTime: Date.now() + 1000 * 60 * 60 * 24,
  periods: 90,
  redirectWhenTimerStops: false,
  redirectUrl: '',
  openInNewTab: false,
  showLabel: true,
  showColon: true,
}

export default Countdown
