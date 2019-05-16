import {
  ADD_ROW,
  CHANGE_ROW_COLOR,
  CLEAR_ROW,
  MOVE_ITEM,
  MOVE_ROW,
  REMOVE_ROW,
  RENAME_ROW,
  RESET,
  SET_DATA
} from '../actions'
import { arrayInsert, arrayMove } from '../../util'

const initialState = []

function tiermaker(state = initialState, action) {
  switch (action.type) {
    case RESET: {
      return initialState
    }
    case SET_DATA: {
      return action.data
    }
    case MOVE_ITEM: {
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
    case ADD_ROW: {
      let copy = [...state]
      const index = copy.findIndex(r => r.name === action.rowName)
      const newRow = { name: 'New Row', color: 'grey', items: [] }
      let insertIndex
      if (action.direction === 'above') {
        insertIndex = index
      } else if (action.direction === 'below') {
        insertIndex = index + 1
      }
      const updated = arrayInsert(state, insertIndex, newRow)
      return updated
    }
    case MOVE_ROW: {
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
    case REMOVE_ROW: {
      let copy = [...state]
      const index = copy.findIndex(r => r.name === action.rowName)
      copy[0] = [...copy[0], ...copy[index].items]
      copy = copy.filter(r => r.name !== action.rowName)
      return copy
    }
    case CLEAR_ROW: {
      let copy = [...state]
      const index = copy.findIndex(r => r.name === action.rowName)
      copy[0] = [...copy[0], ...copy[index].items]
      copy[index].items = []
      return copy
    }
    case RENAME_ROW: {
      if (action.newRowName !== '') {
        const copy = [...state]
        const index = copy.findIndex(r => r.name === action.oldRowName)
        copy[index].name = action.newRowName
        return copy
      }
      return state
    }
    case CHANGE_ROW_COLOR: {
      const copy = [...state]
      const index = copy.findIndex(r => r.name === action.rowName)
      copy[index].color = action.newColor.hex
      return copy
    }
    default: {
      return state
    }
  }
}

export default tiermaker
