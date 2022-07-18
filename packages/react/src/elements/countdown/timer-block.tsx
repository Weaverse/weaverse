import React, { FC } from 'react'

const TimerBlock: FC = (props: any) => {
  return (
    <div>
      <div>{props.value.toString().padStart(2, '0')}</div>
      {props.label && <div className="wv-countdown-label">{props.label}</div>}
    </div>
  )
}

export default TimerBlock
