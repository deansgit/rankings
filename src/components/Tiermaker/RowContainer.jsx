import { func, number, string } from 'prop-types'

import ContentEditable from 'react-contenteditable'
import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'
import ItemSettings from './ItemSettings'
import React from 'react'
import className from 'classnames'
import { itemsType } from './types'

/* 
  Row Container
  Droppable item container
*/
const RowContainer = ({
  name,
  color,
  items,
  moveRow,
  changeName,
  rowIndex,
  totalRows
}) => (
  <div className="row">
    <ContentEditable
      style={{ backgroundColor: color }}
      html={name}
      onChange={e => changeName(name, e.target.value)}
      tagName="label"
      className="label"
    />
    <Droppable droppableId={name} direction="horizontal">
      {(provided, snapshot) => (
        <div
          className={className('content custom-scrollbar', {
            'content--dragging': snapshot.isDraggingOver
          })}
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

RowContainer.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  items: itemsType.isRequired,
  moveRow: func.isRequired,
  changeName: func.isRequired,
  rowIndex: number.isRequired,
  totalRows: number.isRequired
}

export default RowContainer
