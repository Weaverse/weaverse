import React from 'react'

export default function Grid(props: any) {
  return <div {...props} />
}

Grid.defaultProps = {
  style: {
    display: 'grid',
    gridTemplate: '1fr / 1fr'
  },
  type: 'grid'
}