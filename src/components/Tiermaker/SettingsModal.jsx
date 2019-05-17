import {
  ADD_ROW,
  CHANGE_ROW_COLOR,
  CLEAR_ROW,
  REMOVE_ROW,
  RENAME_ROW
} from '../../redux/actions'
import React, { useState } from 'react'
import { func, string } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { MdSettings } from 'react-icons/md'
import Modal from '../generic/Modal'
import { SketchPicker } from 'react-color'

function SettingsModal({ rowName }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <MdSettings
        size={25}
        onClick={() => setModalOpen(true)}
        className="row-settings__modal-button"
      />
      <Modal
        ariaLabel="Settings Modal"
        open={modalOpen}
        setOpen={setModalOpen}
        width={500}
      >
        <Content setModalOpen={setModalOpen} rowName={rowName} />
      </Modal>
    </>
  )
}

SettingsModal.propTypes = {
  rowName: string.isRequired
}

function Content({ setModalOpen, rowName }) {
  const dispatch = useDispatch()
  const row = useSelector(state =>
    state.tiermaker.find(r => r.name === rowName)
  )

  const addRow = direction => {
    dispatch({ type: ADD_ROW, rowName, direction })
    setModalOpen(false)
  }
  const removeRow = () => dispatch({ type: REMOVE_ROW, rowName })
  const clearRow = () => dispatch({ type: CLEAR_ROW, rowName })
  const renameRow = e => {
    e.preventDefault()
    dispatch({
      type: RENAME_ROW,
      oldRowName: rowName,
      newRowName: e.target.value
    })
  }
  const changeRowColor = newColor => {
    dispatch({
      type: CHANGE_ROW_COLOR,
      rowName,
      newColor
    })
  }

  return (
    <div>
      {rowName}
      <div>
        <button onClick={() => addRow('above')}>Add row above</button>
        <button onClick={() => addRow('below')}>Add row below</button>
        <button onClick={() => removeRow()}>Remove row</button>
        <button onClick={() => clearRow()}>Clear row</button>
        <div>
          <input
            type="text"
            onChange={e => renameRow(e)}
            placeholder={rowName}
          />
        </div>
        <SketchPicker
          color={row.color}
          onChange={newColor => changeRowColor(newColor)}
        />
      </div>
    </div>
  )
}

Content.propTypes = {
  setModalOpen: func.isRequired,
  rowName: string.isRequired
}

export default SettingsModal
