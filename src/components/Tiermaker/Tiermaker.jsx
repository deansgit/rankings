import {
  CLEAR_ALL_ROWS,
  MOVE_ITEM,
  MOVE_ROW,
  RENAME_ROW,
  RESET,
  SET_DATA
} from '../../redux/actions'
import React, { useEffect, useState } from 'react'
import {
  base64urlToJson,
  createInitialState,
  jsonToBase64url,
  tail,
  updateClipboard,
  validateUrlString
} from '../../util'
import {
  copyErrorText,
  copyStatusResetTimer,
  copySuccessText
} from '../../constants'
import { useDispatch, useSelector } from 'react-redux'

import DefaultArea from './DefaultArea'
import { DragDropContext } from 'react-beautiful-dnd'
import RowContainer from './RowContainer'
import className from 'classnames'
import { navigate } from 'hookrouter'
import { string } from 'prop-types'

/* 
  Main Tiermaker Component
*/
function Tiermaker() {
  const [copyStatus, setCopyStatus] = useState('')
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

  const copyToClipboard = () => {
    try {
      updateClipboard(jsonToBase64url(data)).then(() => {
        setCopyStatus(copySuccessText)
      })
    } catch {
      setCopyStatus(copyErrorText)
    }
  }

  useEffect(() => {
    if (copyStatus) {
      setTimeout(() => {
        setCopyStatus('')
      }, copyStatusResetTimer)
    }
  }, [copyStatus])

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
            <button onClick={() => save()} className="btn">
              Save to URL
            </button>
            <button
              onClick={() => copyToClipboard()}
              className={className('btn', {
                'btn--green': copyStatus === copySuccessText,
                'btn--red': copyStatus === copyErrorText
              })}
            >
              {copyStatus ? copyStatus : 'Save to clipboard'}
            </button>
            <button onClick={() => reset()} className="btn">
              Reset
            </button>
            <button onClick={() => clearRows()} className="btn">
              Clear all rows
            </button>
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

/* 
  Try to parse state from base64url encoded url string
*/
function Wrapper({ encoded }) {
  const dispatch = useDispatch()
  useEffect(() => {
    if (encoded && validateUrlString(encoded)) {
      dispatch({ type: SET_DATA, data: base64urlToJson(encoded) })
    }
  }, [encoded, dispatch])
  return <Tiermaker />
}

Wrapper.propTypes = {
  encoded: string
}

export default Wrapper
