import React from 'react'
import { Carousel } from 'nuka-carousel/lib/carousel'
import type { ControlProps } from 'nuka-carousel/lib/types'

export let CarouselComponent = (props: any) => {
  let { itemsPerSlide, gap, children } = props
  return (
    <Carousel
      cellSpacing={gap}
      slidesToScroll={itemsPerSlide}
      slidesToShow={itemsPerSlide}
      renderCenterLeftControls={(props: ControlProps) =>
        props.currentSlide !== 0 && (
          <button className="wv-slider-btn" onClick={props.previousSlide}>
            <i className="wv-slider-arrow wv-slider-arrow-left" />
          </button>
        )
      }
      renderCenterRightControls={(props: ControlProps) =>
        props.slideCount > props.currentSlide + props.slidesToShow && (
          <button className="wv-slider-btn" onClick={props.nextSlide}>
            <i className="wv-slider-arrow wv-slider-arrow-right" />
          </button>
        )
      }
      defaultControlsConfig={{
        pagingDotsStyle: { display: 'none' },
      }}
    >
      {children}
    </Carousel>
  )
}

export let css = {
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
}

export default CarouselComponent
