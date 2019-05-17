import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { func, number, string } from 'prop-types'

import React from 'react'
import SettingsModal from './SettingsModal'

/* 
  Item Settings
  Quick menu to change position of rows and a button to open a modal for furhter row customization
*/
function ItemSettings({ name, moveRow, rowIndex, totalRows }) {
  const moveRowUp = () => moveRow(name, 'up')
  const moveRowDown = () => moveRow(name, 'down')

  const canMoveUp = rowIndex !== 0
  const canMoveDown = rowIndex !== totalRows - 1
  return (
    <div className="row-settings">
      <div>
        <SettingsModal rowName={name} />
      </div>
      <div className="row-settings__controls">
        {canMoveUp && (
          <MdExpandLess
            size={30}
            onClick={() => moveRowUp()}
            className="row-settings__icon"
          />
        )}
        {canMoveDown && (
          <MdExpandMore
            size={30}
            onClick={() => moveRowDown()}
            className="row-settings__icon"
          />
        )}
      </div>
    </div>
  )
}

ItemSettings.propTypes = {
  name: string.isRequired,
  moveRow: func.isRequired,
  rowIndex: number.isRequired,
  totalRows: number.isRequired
}

export default ItemSettings
