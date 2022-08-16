import React, { createContext, forwardRef, useContext, useState } from 'react'
import type { WeaverseElementProps } from '../../types'

import C from 'nuka-carousel'
import type { ControlProps } from 'nuka-carousel/lib/types'
import { WeaverseContext } from '../../context'
// @ts-ignore
let Carousel = C.default

interface SliderElementProps extends WeaverseElementProps {
  fullWidth: boolean
  autoplay: boolean
  delay: number
}

interface ISliderContext {
  active: null | string | number
  setActive: (param: string | number) => void
}

export const SliderContext = createContext<ISliderContext>({
  active: null,
  setActive: () => {
    //
  },
})

const Slider = forwardRef<HTMLDivElement, SliderElementProps>((props, ref) => {
  const { isDesignMode } = useContext(WeaverseContext)
  const { autoplay, delay, children, ...rest } = props
  const childIds = React.Children.map(
    children,
    (child: any) => child.props.id
  ) as Array<string>
  const defaultActive = childIds[0]
  const [active, setActive] = useState<string | number | null>(defaultActive)
  return (
    <div {...rest} ref={ref}>
      <SliderContext.Provider value={{ active, setActive }}>
        <Carousel
          dragging={false}
          beforeSlide={(beforeIndex: number, lastIndex: number) => {
            setActive(childIds[lastIndex])
          }}
          renderCenterLeftControls={(props: ControlProps) => (
            <button
              className="wv-slider-btn"
              onClick={props.previousSlide}
              disabled={props.currentSlide === 0}
            >
              <i className="wv-slider-arrow wv-slider-arrow-left" />
            </button>
          )}
          renderCenterRightControls={(props: ControlProps) => (
            <button
              className="wv-slider-btn"
              onClick={props.nextSlide}
              disabled={props.slidesToShow === props.currentSlide}
            >
              <i className="wv-slider-arrow wv-slider-arrow-right" />
            </button>
          )}
          wrapAround={!isDesignMode}
          autoplay={!isDesignMode && autoplay}
          autoplayInterval={delay * 1000}
        >
          {children}
        </Carousel>
      </SliderContext.Provider>
    </div>
  )
})

Slider.defaultProps = {
  fullWidth: true,
  autoplay: false,
  delay: 7,
  css: {
    '@desktop': {
      '& .wv-slider-btn': {
        borderRadius: '100%',
        width: 40,
        height: 40,
        background: '#fff',
        border: 'none',
        cursor: 'pointer',
        '&[disabled]': {
          cursor: 'not-allowed',
        },
        '&:hover .wv-slider-arrow': {
          borderColor: '#999',
        },
        '& .wv-slider-arrow': {
          border: 'solid black',
          borderWidth: '0 1px 1px 0',
          display: 'inline-block',
          padding: 5,
        },
        '& .wv-slider-arrow-right': {
          transform: 'rotate(-45deg)',
          marginRight: 5,
        },
        '& .wv-slider-arrow-left': {
          transform: 'rotate(135deg)',
          marginLeft: 5,
        },
      },
    },
  },
}

export default Slider
