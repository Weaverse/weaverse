// import React, {forwardRef, useContext} from 'react'
// import {WeaverseElementProps} from '../../types'
// import {TabContext} from './index'
//
// interface TabHeaderProps extends WeaverseElementProps {
//
// }
//
// const TabHeaderWrapper  = forwardRef<HTMLDivElement, TabHeaderProps>((props, ref) => {
//   const {active, setActive} = useContext(TabContext)
//   return <div {...props} ref={ref}>
//     <div className={"tab-header-item active"}>Tab 1</div>
//     <div className={"tab-header-item"}>Tab 2</div>
//     <div className={"tab-header-item"}>Tab 3</div>
//   </div>
// })
//
// TabHeaderWrapper.defaultProps = {
//   css: {
//     '@desktop': {
//       width: "100%",
//       display: 'flex',
//       "& div.tab-header-item": {
//         backgroundColor: "#f0f2f3",
//         padding: "10px 16px",
//         "&.active": {
//           backgroundColor: "#0F71FF",
//           color: "#fff",
//         }
//       }
//     }
//   }
// }
//
// export default TabHeaderWrapper

import React, { useContext, useEffect, useState } from 'react'
import { WeaverseContext } from '../../context'
import { TabContext } from './index'
import type { ElementData } from '@weaverse/core'

function TabHeader(props: { wvId: string | number }) {
  const { wvId } = props
  const { active, setActive } = useContext(TabContext)
  const { itemInstances } = useContext(WeaverseContext)

  const instance = itemInstances.get(wvId)!
  let [data, setData] = useState<ElementData>(instance.data)
  useEffect(() => {
    let update = (data: ElementData) => setData({ ...data })
    instance.subscribe(update)
  }, [])
  const text = data.headerText!
  return (
    <div
      onClick={() => setActive(wvId)}
      className={`wv-tab-header${active === wvId ? ' active' : ''}`}
    >
      {text}
    </div>
  )
}

export function TabHeaderWrapper(props: { wvId: string }) {
  const { itemInstances } = useContext(WeaverseContext)
  const instance = itemInstances.get(props.wvId)!
  const data = instance.data
  const childIds = data.childIds!
  return (
    <div className={'wv-tab-headerWrapper'}>
      {childIds.map((id) => (
        <TabHeader key={id} wvId={id} />
      ))}
    </div>
  )
}
