import { MdExpandLess, MdExpandMore, MdSettings } from 'react-icons/md'

import React from 'react'

function ItemSettings({ name, moveRow, rowIndex, totalRows }) {
  const moveRowUp = () => moveRow(name, 'up')
  const moveRowDown = () => moveRow(name, 'down')
  const openSettingsModal = () => {
    console.log('openSettingsModal', { name })
  }

  const canMoveUp = rowIndex !== 0
  const canMoveDown = rowIndex !== totalRows - 1
  return (
    <div className="item-settings">
      <div>
        <MdSettings
          size={25}
          onClick={() => openSettingsModal(name)}
          className="item-settings__modal-button"
        />
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

export default ItemSettings
