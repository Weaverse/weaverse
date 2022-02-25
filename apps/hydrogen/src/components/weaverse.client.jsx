import {createRootContext, WeaverseRoot} from '@weaverse/react'
import React from 'react'

export let weaverseContext = createRootContext({projectKey: '1'})

export const WeaverseClient = ({defaultData}) => {
  let data = {
    items: [
      {
        id: 0,
        type: 'base',
        description: 'This is item 1',
        childIds: [1, 2],
        css: {
          backgroundColor: 'blue'
        }
      },
      {
        id: 1,
        type: 'button',
        description: 'This is item 1',
        childIds: []
      },
      {
        id: 2,
        type: 'base',
        description: 'This is item 2',
        childIds: [3, 4, 5, 6],
        css: {
          display: 'grid',
          gridTemplate: 'repeat(3, 1fr) / repeat(2, 1fr)',
          backgroundColor: 'cyan'
        }
      },
      {
        id: 3,
        type: 'button',
        description: 'This is item 3',
        childIds: []
      },
      {
        id: 4,
        type: 'button',
        description: 'This is item 4',
        childIds: []
      },
      {
        id: 5,
        type: 'button',
        description: 'This is item 5',
        childIds: []
      },
      {
        id: 6,
        type: 'button',
        description: 'This is item 7',
        childIds: []
      }
    ]
  }
  return <WeaverseRoot context={weaverseContext} defaultData={data}/>
}

export default WeaverseClient
