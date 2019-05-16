import {
  CLEAR_ALL_ROWS,
  MOVE_ITEM,
  MOVE_ROW,
  RENAME_ROW,
  RESET,
  SET_DATA
} from '../../redux/actions'
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

function Tiermaker() {
  const dispatch = useDispatch()
  // const data = useSelector(state => state.tiermaker) // somehow this is broken? probably a memo related issue
  const state = useSelector(state => state)
  const data = state.tiermaker

  const onDragEnd = dragInfo => {
    if (!dragInfo.destination) {
      return
    }
    dispatch({ type: MOVE_ITEM, dragInfo })
  }

  const moveRow = (rowName, direction) => {
    dispatch({ type: MOVE_ROW, rowName, direction })
  }

  const changeName = (rowName, newName) => {
    dispatch({
      type: RENAME_ROW,
      oldRowName: rowName,
      newRowName: newName
    })
  }

  const save = () => navigate(`/t/${jsonToBase64url(data)}`)
  const reset = () => {
    navigate(`/maker`, false)
    dispatch({ type: RESET })
  }
  const clearRows = () => dispatch({ type: CLEAR_ALL_ROWS })

  // useEffect(() => {
  //   navigate(`/t/${jsonToBase64url(data)}`)
  // }, [data])

  useEffect(() => {
    if (data.length < 1) {
      dispatch({ type: SET_DATA, data: createInitialState() })
    }
  }, [data, dispatch])

  return (
    <>
      {data.length < 1 ? null : (
        <>
          <div className="controls">
            <button onClick={() => save()}>Save (to URL)</button>
            <button onClick={() => reset()}>Reset</button>
            <button onClick={() => clearRows()}>Clear all rows</button>
          </div>
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
        </>
      )}
    </>
  )
}

function Wrapper({ encoded }) {
  const dispatch = useDispatch()
  // if (encoded && validateUrlString(encoded)) {
  //   dispatch({ type: SET_DATA, data: base64urlToJson(encoded) })
  // }
  useEffect(() => {
    if (encoded && validateUrlString(encoded)) {
      dispatch({ type: SET_DATA, data: base64urlToJson(encoded) })
    }
  }, [encoded, dispatch])
  return <Tiermaker />
}

export default Wrapper
