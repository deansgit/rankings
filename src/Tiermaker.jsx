import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { MdExpandLess, MdExpandMore, MdSettings } from 'react-icons/md'
import React, { useReducer } from 'react'

import mockData from './mockData.json'

function tail(array) {
  const copy = [...array]
  copy.shift()
  return copy
}

function arrayMove(array, moveIndex, toIndex) {
  /* #move - Moves an array item from one position in an array to another.
     Note: This is a pure function so a new array will be returned, instead
     of altering the array argument.
    Arguments:
    1. array     (String) : Array in which to move an item.         (required)
    2. moveIndex (Object) : The index of the item to move.          (required)
    3. toIndex   (Object) : The index to move item at moveIndex to. (required)
  */
  const item = array[moveIndex]
  const length = array.length
  const diff = moveIndex - toIndex

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length)
    ]
  } else if (diff < 0) {
    // move right
    const targetIndex = toIndex + 1
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length)
    ]
  }
  return array
}

const initialState = mockData

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

function Tiermaker() {
  const [data, dispatch] = useReducer(reducer, initialState)

  const onDragEnd = dragInfo => {
    if (!dragInfo.destination) {
      return
    }
    dispatch({ type: 'MOVE_ITEM', dragInfo })
  }

  const moveRow = (rowName, direction) => {
    dispatch({ type: 'MOVE_ROW', rowName, direction })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        {tail(data).map(({ name, color, items }, i) => (
          <RowContainer
            name={name}
            color={color}
            items={items}
            moveRow={moveRow}
            rowIndex={i}
            totalRows={tail(data).length}
            key={`row-${i}`}
          />
        ))}
      </div>
      <DefaultArea items={data[0]} />
    </DragDropContext>
  )
}

const DefaultArea = ({ items }) => (
  <div className="default-container">
    <Droppable droppableId="default" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className="default-container__content"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {items.map((item, i) => (
            <Item
              index={i}
              name={item.name}
              imageUrl={item.image}
              key={`item-${i}`}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
)

const RowContainer = ({ name, color, items, moveRow, rowIndex, totalRows }) => (
  <div className="row">
    <div className="label" style={{ backgroundColor: color }}>
      {name}
    </div>
    <Droppable droppableId={name} direction="horizontal">
      {(provided, snapshot) => (
        <div
          className="content"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {items.map((item, i) => (
            <Item
              index={i}
              name={item.name}
              imageUrl={item.image}
              key={`item-${i}`}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    <ItemSettings
      name={name}
      moveRow={moveRow}
      rowIndex={rowIndex}
      totalRows={totalRows}
    />
  </div>
)

const Item = ({ index, name, imageUrl }) => (
  <Draggable draggableId={name} index={index} key={name}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div
          className="item"
          key={index}
          style={{ backgroundImage: `url(${imageUrl})` }}
          title={name}
        />
      </div>
    )}
  </Draggable>
)

function ItemSettings({ name, moveRow, rowIndex, totalRows }) {
  const moveRowUp = () => moveRow(name, 'up')
  const moveRowDown = () => moveRow(name, 'down')
  const openSettingsModal = () => {
    console.log('openSettingsModal', { name })
  }

  const canMoveUp = rowIndex !== 0
  const canMoveDown = rowIndex !== totalRows - 1
  return (
    <div className="item-settings">
      <div>
        <MdSettings
          size={25}
          onClick={() => openSettingsModal(name)}
          className="item-settings__modal-button"
        />
      </div>
      <div className="item-settings__controls">
        {canMoveUp && (
          <MdExpandLess
            size={30}
            onClick={() => moveRowUp()}
            className="item-settings__icon"
          />
        )}
        {canMoveDown && (
          <MdExpandMore
            size={30}
            onClick={() => moveRowDown()}
            className="item-settings__icon"
          />
        )}
      </div>
    </div>
  )
}

export default Tiermaker
