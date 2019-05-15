import { arrayOf, shape, string } from 'prop-types'

export const itemType = shape({
  name: string.isRequired,
  image: string.isRequired
})

export const itemsType = arrayOf(itemType)
