import React, {
  createContext,
  forwardRef,
  MutableRefObject,
  useState,
} from 'react'
import type { WeaverseElementProps } from '../../types'
import * as Carousel from 'nuka-carousel'
type SliderElementProps = WeaverseElementProps

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
  // const wvId = props['data-wv-id']
  const { children, ...rest } = props
  const defaultActive = (React.Children.toArray(children)?.[0] as any)?.props
    ?.id
  const [active, setActive] = useState<string | number | null>(defaultActive)

  return (
    <div {...rest} ref={ref}>
      <SliderContext.Provider value={{ active, setActive }}>
        {children}
      </SliderContext.Provider>
      <Carousel.default>
        <div className="slide">Hi</div>
        <div className="slide">Hieee</div>
        <div className="slide">Hixxx</div>
        <div className="slide">Hi3</div>
      </Carousel.default>
    </div>
  )
})

Slider.defaultProps = {
  css: {
    '@desktop': {},
  },
}

export default Slider
