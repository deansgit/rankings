import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { func, number, string } from 'prop-types'

import React from 'react'
import SettingsModal from './SettingsModal'

function ItemSettings({ name, moveRow, rowIndex, totalRows }) {
  const moveRowUp = () => moveRow(name, 'up')
  const moveRowDown = () => moveRow(name, 'down')

  const canMoveUp = rowIndex !== 0
  const canMoveDown = rowIndex !== totalRows - 1
  return (
    <div className="item-settings">
      <div>
        <SettingsModal rowName={name} />
      </div>
      <div className="item-settings__controls">
        {canMoveUp && (
          <MdExpandLess
            size={30}
            onClick={() => moveRowUp()}
            className="item-settings__icon"
          />
        )}
        {canMoveDown && (
          <MdExpandMore
            size={30}
            onClick={() => moveRowDown()}
            className="item-settings__icon"
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
