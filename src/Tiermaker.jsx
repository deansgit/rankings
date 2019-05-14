import React from 'react'
import mockData from './mockData.json'

function Tiermaker() {
  return (
    <div className="container">
      {mockData.map((item, i) => (
        <RowContainer
          name={item.name}
          color={item.color}
          items={item.items}
          key={`row-${i}`}
        />
      ))}
    </div>
  )
}

const RowContainer = ({ name, color, items }) => (
  <div className="row">
    <div className="label" style={{ backgroundColor: color }}>
      {name}
    </div>
    <div className="content">
      {items.map((item, i) => (
        <Item name={item.name} imageUrl={item.image} key={`item-${i}`} />
      ))}
    </div>
  </div>
)

const Item = ({ name, imageUrl }) => (
  <div
    className="item"
    style={{ backgroundImage: `url(${imageUrl})` }}
    title={name}
  />
)

export default Tiermaker
