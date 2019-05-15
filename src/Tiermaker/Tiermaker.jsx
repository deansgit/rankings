import React, { useReducer } from 'react'

import DefaultArea from './DefaultArea'
import { DragDropContext } from 'react-beautiful-dnd'
import RowContainer from './RowContainer'
import mockData from '../mockData.json'
import reducer from './reducer'
import { tail } from '../util'

const initialState = mockData

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

export default Tiermaker
