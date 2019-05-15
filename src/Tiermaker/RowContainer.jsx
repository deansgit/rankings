import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'
import ItemSettings from './ItemSettings'
import React from 'react'

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

export default RowContainer
