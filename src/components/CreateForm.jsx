import React, { useState } from 'react'
import { createDataStructure, filesToDataURIs } from '../util'

import { SET_DATA } from '../redux/actions'
import { navigate } from 'hookrouter'
import { useDispatch } from 'react-redux'

function CreateForm() {
  const [files, setFiles] = useState('')
  const dispatch = useDispatch()

  const handleFormSubmit = e => {
    e.preventDefault()
    const rows = ['First', 'Second', 'Third']
    dispatch({ type: SET_DATA, data: createDataStructure(files, rows) })
    navigate(`/maker`, false)
  }

  const handleFileDrop = e => {
    // const blob = URL.createObjectURL(files[0])
    filesToDataURIs([...e.target.files]).then(result => setFiles(result))
  }

  const removeImage = uri => {
    setFiles(files => files.filter(file => file !== uri))
  }

  return (
    <div className="create-form">
      <h2>Create new template</h2>
      <div>
        <form onSubmit={e => handleFormSubmit(e)}>
          {!files && (
            <>
              <h3>Select Images</h3>
              <input
                accept="image/png, image/jpeg, image/jpg, image/gif"
                type="file"
                multiple={true}
                onChange={e => handleFileDrop(e)}
              />
            </>
          )}
          {files && (
            <div>
              <h3>Click to remove unwanted images</h3>
              <div className="create-form__images">
                {files.map((uri, i) => (
                  <img
                    src={uri}
                    key={i}
                    alt=""
                    className="create-form__image"
                    onClick={() => removeImage(uri)}
                  />
                ))}
              </div>
            </div>
          )}
          {files && files.length > 0 && (
            <div className="create-form__controls">
              <button type="submit" className="btn btn--blue">
                Create
              </button>
            </div>
          )}
        </form>
      </div>
      {/* <div>
        <h3>Default Rows</h3>
        <input type="text" />
      </div> */}
    </div>
  )
}

export default CreateForm
