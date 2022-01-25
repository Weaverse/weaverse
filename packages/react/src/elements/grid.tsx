import React from 'react'

export default function Grid(props: any) {
  return <div {...props} />
}

Grid.defaultProps = {
  style: {
    // display: 'grid',
    // outline: '1px solid red',
  },
  type: 'grid'
}