import React from 'react'

export default function Grid(props: any) {
  return <div {...props} />
}

export let schema = {
  type: 'grid',
  label: 'Grid',
}
Grid.defaultProps = {
  style: {
    display: 'grid',
    gridTemplateRows:
      'minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%) minmax(max-content,20%);',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  },
}
