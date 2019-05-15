import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { MdExpandLess, MdExpandMore, MdSettings } from 'react-icons/md'
import React, { useState } from 'react'

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

function Tiermaker() {
  const [data, setData] = useState(mockData)

  const onDragEnd = dragInfo => {
    if (!dragInfo.destination) {
      return
    }
    console.log('dragInfo', dragInfo)
    const toRow = data.findIndex(
      r => r.name === dragInfo.destination.droppableId
    )
    const fromRow = data.findIndex(r => r.name === dragInfo.source.droppableId)
    const toIndex = dragInfo.destination.index
    const fromIndex = dragInfo.source.index

    if (
      dragInfo.source.droppableId === 'default' ||
      dragInfo.destination.droppableId === 'default'
    ) {
      // Moving within default area
      if (fromRow !== toRow) {
        if (dragInfo.destination.droppableId !== 'default') {
          const copy = [...data]
          const itemToMove = copy[0][fromIndex]
          copy[toRow].items.splice(toIndex, 0, itemToMove)
          copy[0].splice(fromIndex, 1)
          setData(copy)
        } else {
          const copy = [...data]
          const itemToMove = copy[fromRow].items[fromIndex]
          copy[0].splice(toIndex, 0, itemToMove)
          copy[fromRow].items.splice(fromIndex, 1)
          setData(copy)
        }
      } else {
        const copy = [...data]
        copy[0] = arrayMove(copy[0], fromIndex, toIndex)
        setData(copy)
      }
    } else {
      // moving outside default area
      if (fromRow !== toRow) {
        const copy = [...data]
        const itemToMove = copy[fromRow].items[fromIndex]
        copy[toRow].items.splice(toIndex, 0, itemToMove)
        copy[fromRow].items.splice(fromIndex, 1)
        setData(copy)
      } else {
        const copy = [...data]
        copy[toRow].items = arrayMove(copy[toRow].items, fromIndex, toIndex)
        setData(copy)
      }
    }
  }

  const moveRow = (rowName, direction) => {
    const copy = [...data]
    const rowToMoveIndex = copy.findIndex(r => r.name === rowName)
    if (rowToMoveIndex === 0 && direction === 'up') {
      return
    } else if (rowToMoveIndex === copy.length - 1 && direction === 'down') {
      return
    } else {
      let newRowIndex
      if (direction === 'up') {
        newRowIndex = rowToMoveIndex - 1
      }
      if (direction === 'down') {
        newRowIndex = rowToMoveIndex + 1
      }
      const rearranged = arrayMove(copy, rowToMoveIndex, newRowIndex)
      setData(rearranged)
    }
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
            totalRows={data.length}
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
