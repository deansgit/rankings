import { func, number, string } from 'prop-types'

import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'
import ItemSettings from './ItemSettings'
import React from 'react'
import { itemsType } from './types'

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

RowContainer.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  items: itemsType.isRequired,
  moveRow: func.isRequired,
  rowIndex: number.isRequired,
  totalRows: number.isRequired
}

export default RowContainer
