import React, { useState } from 'react'
import { base64urlToJson, validateUrlString } from '../util'

import { SET_DATA } from '../redux/actions'
import { navigate } from 'hookrouter'
import { useDispatch } from 'react-redux'

function ImportForm() {
  const [importString, setImportString] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const handleFormSubmit = e => {
    e.preventDefault()
    if (importString && validateUrlString(importString)) {
      dispatch({ type: SET_DATA, data: base64urlToJson(importString) })
      navigate(`/maker`, false)
    } else {
      setError('Invalid import string')
    }
  }

  return (
    <div className="import-form">
      <h2>Load existing tier</h2>
      {error && <div className="import-form__info-box">{error}</div>}
      <div>
        <form onSubmit={e => handleFormSubmit(e)}>
          <div>
            <textarea
              value={importString}
              onChange={e => setImportString(e.target.value)}
              autoFocus
              placeholder="Paste import string into this area.."
              className="import-form__textarea"
            />
          </div>
          {importString && (
            <button type="submit" className="btn btn--blue">
              Import
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default ImportForm
