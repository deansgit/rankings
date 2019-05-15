import React, { useReducer } from 'react'

import DefaultArea from './DefaultArea'
import { DragDropContext } from 'react-beautiful-dnd'
import RowContainer from './RowContainer'
import reducer from './reducer'
import { tail } from '../../util'

export const TiermakerContext = React.createContext(null)

const IMAGE_LIST = [
  'https://i.imgur.com/oZrrEk9.png',
  'https://i.imgur.com/holSvy7.png',
  'https://i.imgur.com/33vdZnY.png',
  'https://i.imgur.com/lIc3gAm.png',
  'https://i.imgur.com/sXGKqr1.png',
  'https://i.imgur.com/TsJzbfd.png',
  'https://i.imgur.com/0U3vV2b.png',
  'https://i.imgur.com/0ahe4dB.png',
  'https://i.imgur.com/y6WYLNq.png',
  'https://i.imgur.com/NUPVPIh.png',
  'https://i.imgur.com/Lh3czPn.png',
  'https://i.imgur.com/Y05LJUk.png',
  'https://i.imgur.com/3OvYK23.png',
  'https://i.imgur.com/pxqC7UL.png',
  'https://i.imgur.com/4PnnBeo.png',
  'https://i.imgur.com/LQz8Pag.png',
  'https://i.imgur.com/OSxJTMm.png',
  'https://i.imgur.com/3LuP2CN.png',
  'https://i.imgur.com/FijLWMi.png',
  'https://i.imgur.com/0EmXish.png',
  'https://i.imgur.com/bHFXkc2.png'
]

export function createInitialState() {
  const data = []
  const defaultArea = IMAGE_LIST.map((url, i) => {
    return { name: `Item ${i + 1}`, image: url }
  })
  data.push(defaultArea)
  const rows = [
    { name: 'Love', color: 'green', items: [] },
    { name: 'Like', color: 'lightgreen', items: [] },
    { name: 'Dislike', color: 'orange', items: [] },
    { name: 'Hate', color: 'red', items: [] }
  ]
  rows.map(row => data.push(row))
  return data
}

const initialState = createInitialState()

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

  const changeName = (rowName, newName) => {
    dispatch({
      type: 'RENAME_ROW',
      oldRowName: rowName,
      newRowName: newName
    })
  }

  return (
    <TiermakerContext.Provider value={{ dispatch, data }}>
      <button
        className="reset-button"
        onClick={() => dispatch({ type: 'RESET' })}
      >
        Reset
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          {tail(data).map(({ name, color, items }, i) => (
            <RowContainer
              name={name}
              color={color}
              items={items}
              moveRow={moveRow}
              changeName={changeName}
              rowIndex={i}
              totalRows={tail(data).length}
              key={`row-${i}`}
            />
          ))}
        </div>
        <DefaultArea items={data[0]} />
      </DragDropContext>
    </TiermakerContext.Provider>
  )
}

export default Tiermaker
