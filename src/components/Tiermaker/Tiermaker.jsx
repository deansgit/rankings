import React, { useEffect, useReducer } from 'react'
import {
  base64urlToJson,
  createInitialState,
  jsonToBase64url,
  tail,
  validateUrlString
} from '../../util'

import DefaultArea from './DefaultArea'
import { DragDropContext } from 'react-beautiful-dnd'
import RowContainer from './RowContainer'
import { navigate } from 'hookrouter'
import reducer from './reducer'

export const TiermakerContext = React.createContext(null)

function Tiermaker({ initialState }) {
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

  const save = () => navigate(`/t/${jsonToBase64url(data)}`, true)

  useEffect(() => {
    navigate(`/t/${jsonToBase64url(data)}`, true)
  }, [data])

  return (
    <TiermakerContext.Provider value={{ dispatch, data }}>
      <button className="reset-button" onClick={() => save()}>
        Save (to URL)
      </button>
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

function Wrapper({ data }) {
  let initialState
  if (validateUrlString(data)) {
    initialState = base64urlToJson(data)
  } else {
    initialState = createInitialState()
  }
  return <Tiermaker initialState={initialState} />
}

export default Wrapper
