import { IMAGE_LIST } from './constants'
import Joi from '@hapi/joi'
import base64url from 'base64url'

/* 
  Gets all but the first element of array
*/
export function tail(array) {
  const copy = [...array]
  copy.shift()
  return copy
}

/* 
  Moves an array item from one position in an array to another
*/
export function arrayMove(array, moveIndex, toIndex) {
  /* 
    Note: This is a pure function so a new array will be returned, instead
    of altering the array argument.
    Arguments:
    1. array     (String) : Array in which to move an item.         (required)
    2. moveIndex (Object) : The index of the item to move.          (required)
    3. toIndex   (Object) : The index to move item at moveIndex to. (required)
  */
  const item = array[moveIndex]
  const length = array.length
  const diff = moveIndex - toIndex

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length)
    ]
  } else if (diff < 0) {
    // move right
    const targetIndex = toIndex + 1
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length)
    ]
  }
  return array
}

/* 
  Insert item into array at specified position
*/
export const arrayInsert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]

/* 
  Convert JSON to base64url encoded string
*/
export const jsonToBase64url = json => base64url(JSON.stringify(json))

/* 
  Convert base64url encoded string to JSON
*/
export const base64urlToJson = string => JSON.parse(base64url.decode(string))

/* 
  "Vanilla"-ES6 object schema validation
*/
export function validateObject(object, schema) {
  return Object.entries(schema)
    .map(([property, validate]) => [property, validate(object[property])])
    .reduce((errors, [property, valid]) => {
      if (!valid) {
        errors.push(new Error(`${property} is invalid.`))
      }
      return errors
    }, [])
}

/* 
  Create image object structure
*/
export function createImageObject(name, url) {
  return { name, image: url }
}

/* 
  Create row object structure
*/
export function createRowObject(name, color, items) {
  return { name, color, items }
}

/* 
  Create general structure of Tiermaker component data set
*/
export function createDataStructure(images, rows) {
  const rowData = rows.map(rowName => createRowObject(rowName, 'grey', []))
  const imageData = [
    images.map((url, i) => createImageObject(`Item ${i + 1}`, url))
  ]
  return [...imageData, ...rowData]
}

/* 
  Create initial Tiermaker component data set (mostly used for debugging)
*/
export function createInitialState() {
  const data = []
  const defaultArea = IMAGE_LIST.map((url, i) => {
    return { name: `Item ${i + 1}`, image: url }
  })
  data.push(defaultArea)
  const rows = [
    { name: 'Love', color: 'green', items: [] },
    { name: 'Like', color: 'lightgreen', items: [] },
    { name: 'Dislike', color: 'orange', items: [] },
    { name: 'Hate', color: 'red', items: [] }
  ]
  rows.map(row => data.push(row))
  return data
}

/* 
  Validate base64encoded url string based on loose Tiermaker component data set schema
*/
export function validateUrlString(string) {
  try {
    const json = base64urlToJson(string)
    const schema = Joi.array().items(
      Joi.array().items(Joi.object()),
      Joi.object().keys({
        name: Joi.string(),
        color: Joi.string(),
        items: Joi.array()
      })
    )
    const result = Joi.validate(json, schema)
    if (!result.error) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

/* 
  Write string to clipboard
*/
export function updateClipboard(string) {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(string).then(
      () => {
        resolve('Success')
      },
      () => {
        reject('Error')
      }
    )
  })
}

/* 
  Asynchronously convert a list of Files (see: https://developer.mozilla.org/en-US/docs/Web/API/File) to dataURI strings
*/
export function asyncFileReader(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}
export function filesToDataURIs(files) {
  return new Promise(resolve => {
    const promises = files.map(file => asyncFileReader(file))
    Promise.all(promises).then(results => resolve(results))
  })
}
