import { Droppable } from 'react-beautiful-dnd'
import Item from './Item'
import React from 'react'
import className from 'classnames'
import { itemsType } from './types'

const DefaultArea = ({ items }) => (
  <div className="default-container">
    <Droppable droppableId="default" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className={className('default-container__content custom-scrollbar', {
            'default-container__content--dragging': snapshot.isDraggingOver
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
  </div>
)

DefaultArea.propTypes = {
  items: itemsType.isRequired
}

export default DefaultArea
