import { number, string } from 'prop-types'

import { Draggable } from 'react-beautiful-dnd'
import React from 'react'
import className from 'classnames'

const Item = ({ index, name, imageUrl }) => (
  <Draggable draggableId={name} index={index} key={name}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={className({ 'item--dragging': snapshot.isDragging })}
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

Item.propTypes = {
  index: number.isRequired,
  name: string.isRequired,
  imageUrl: string.isRequired
}

export default Item
