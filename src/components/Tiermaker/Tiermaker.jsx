import React, { useEffect } from 'react'
import {
  base64urlToJson,
  createInitialState,
  jsonToBase64url,
  tail,
  validateUrlString
} from '../../util'
import { useDispatch, useSelector } from 'react-redux'

import DefaultArea from './DefaultArea'
import { DragDropContext } from 'react-beautiful-dnd'
import RowContainer from './RowContainer'
import { navigate } from 'hookrouter'

export const TiermakerContext = React.createContext(null)

function Tiermaker() {
  const dispatch = useDispatch()
  const data = useSelector(state => state.tiermaker)

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

  const save = () => navigate(`/t/${jsonToBase64url(data)}`)
  const reset = () => {
    navigate(`/maker`, false)
    dispatch({ type: 'RESET' })
  }

  // useEffect(() => {
  //   navigate(`/t/${jsonToBase64url(data)}`)
  // }, [data])

  useEffect(() => {
    if (data.length < 1) {
      dispatch({ type: 'SET_DATA', data: createInitialState() })
    }
  }, [data, dispatch])

  return (
    <>
      {data.length < 1 ? null : (
        <TiermakerContext.Provider value={{ dispatch, data }}>
          <button className="reset-button" onClick={() => save()}>
            Save (to URL)
          </button>
          <button className="reset-button" onClick={() => reset()}>
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
      )}
    </>
  )
}

function Wrapper({ encoded }) {
  const dispatch = useDispatch()
  // if (encoded && validateUrlString(encoded)) {
  //   dispatch({ type: 'SET_DATA', data: base64urlToJson(encoded) })
  // }
  useEffect(() => {
    if (encoded && validateUrlString(encoded)) {
      dispatch({ type: 'SET_DATA', data: base64urlToJson(encoded) })
    }
  }, [encoded, dispatch])
  return <Tiermaker />
}

export default Wrapper
