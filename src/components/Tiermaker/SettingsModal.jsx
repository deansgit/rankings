import {
  ADD_ROW,
  CHANGE_ROW_COLOR,
  CLEAR_ROW,
  REMOVE_ROW,
  RENAME_ROW
} from '../../redux/actions'
import { CirclePicker, SketchPicker } from 'react-color'
import React, { useState } from 'react'
import { func, string } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { MdSettings } from 'react-icons/md'
import Modal from '../generic/Modal'

/* 
  Settings Modal
  List of options to change appearance of rows
*/
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

/* 
  Modal Content
*/
function Content({ setModalOpen, rowName }) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
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
    <div className="row-settings-modal">
      <h3 className="row-settings-modal__title">Row Settings</h3>
      <div>
        <div className="row-settings-modal__controls">
          <button
            onClick={() => addRow('above')}
            className="row-settings-modal__button"
          >
            Add row above
          </button>
          <button
            onClick={() => addRow('below')}
            className="row-settings-modal__button"
          >
            Add row below
          </button>
          <button
            onClick={() => removeRow()}
            className="row-settings-modal__button"
          >
            Remove row
          </button>
          <button
            onClick={() => clearRow()}
            className="row-settings-modal__button"
          >
            Clear row
          </button>
        </div>
        <div>
          <input
            type="text"
            onChange={e => renameRow(e)}
            placeholder={rowName}
            autoFocus
            className="row-settings-modal__input"
          />
        </div>
        {!showCustomPicker && (
          <div className="row-settings-modal__colorpicker">
            <CirclePicker
              color={row.color}
              onChange={newColor => changeRowColor(newColor)}
            />
          </div>
        )}
        <div className="row-settings-modal__colorpicker">
          {!showCustomPicker && (
            <button className="btn" onClick={() => setShowCustomPicker(true)}>
              Choose custom color
            </button>
          )}
          {showCustomPicker && (
            <SketchPicker
              color={row.color}
              onChange={newColor => changeRowColor(newColor)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

Content.propTypes = {
  setModalOpen: func.isRequired,
  rowName: string.isRequired
}

export default SettingsModal
