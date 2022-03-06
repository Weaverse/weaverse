import {ProjectDataType} from '../core'
import {v4} from 'uuid'

export function transformNumberIdToUuid(data: ProjectDataType) {
  let newData: ProjectDataType = {
    items: [],
    rootId: ''
  }
  let items = data.items
  let rootItem = items.find(item => item.id === 0)
  if (rootItem) {
    let newRoot = {...rootItem}
    newRoot.id = v4()
    newData.rootId = newRoot.id
    let updateChildItems = (itemIds: number[]) => {
      return Array.isArray(itemIds) ? itemIds.map(id => {
        let itemData = items.find(item => item.id === id)
        if (itemData) {
          let newItem = {...itemData}
          newItem.id = v4()
          newItem.childIds = updateChildItems(newItem.childIds as number[])
          newData.items.push(newItem)
          return newItem.id
        }
        return ''
      }).filter(id => !!id) : []
    }
    newRoot.childIds = updateChildItems(newRoot.childIds as number[])
    newData.items.push(newRoot)
  }
  return newData
}