import { arrayMove } from '../util'

function reducer(state, action) {
  switch (action.type) {
    case 'MOVE_ITEM': {
      const { destination, source } = action.dragInfo
      const toRow = state.findIndex(r => r.name === destination.droppableId)
      const fromRow = state.findIndex(r => r.name === source.droppableId)
      const toIndex = destination.index
      const fromIndex = source.index
      const copy = [...state]

      if (
        source.droppableId === 'default' ||
        destination.droppableId === 'default'
      ) {
        // moving within default area
        if (fromRow !== toRow) {
          if (destination.droppableId !== 'default') {
            const itemToMove = copy[0][fromIndex]
            copy[toRow].items.splice(toIndex, 0, itemToMove)
            copy[0].splice(fromIndex, 1)
            return copy
          } else {
            const itemToMove = copy[fromRow].items[fromIndex]
            copy[0].splice(toIndex, 0, itemToMove)
            copy[fromRow].items.splice(fromIndex, 1)
            return copy
          }
        } else {
          copy[0] = arrayMove(copy[0], fromIndex, toIndex)
          return copy
        }
      } else {
        // moving outside default area
        if (fromRow !== toRow) {
          const itemToMove = copy[fromRow].items[fromIndex]
          copy[toRow].items.splice(toIndex, 0, itemToMove)
          copy[fromRow].items.splice(fromIndex, 1)
          return copy
        } else {
          copy[toRow].items = arrayMove(copy[toRow].items, fromIndex, toIndex)
          return copy
        }
      }
    }
    case 'MOVE_ROW': {
      const copy = [...state]
      const rowToMoveIndex = copy.findIndex(r => r.name === action.rowName)
      if (rowToMoveIndex === 0 && action.direction === 'up') {
        return
      } else if (
        rowToMoveIndex === copy.length - 1 &&
        action.direction === 'down'
      ) {
        return
      } else {
        let newRowIndex
        if (action.direction === 'up') {
          newRowIndex = rowToMoveIndex - 1
        }
        if (action.direction === 'down') {
          newRowIndex = rowToMoveIndex + 1
        }
        const rearranged = arrayMove(copy, rowToMoveIndex, newRowIndex)
        return rearranged
      }
    }
    default:
      throw new Error()
  }
}

export default reducer
