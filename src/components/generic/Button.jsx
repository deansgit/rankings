import { getBasepath, navigate } from 'hookrouter'

import React from 'react'

const setLinkProps = props => {
  const onClick = e => {
    if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault() // prevent the link from actually navigating
      navigate(e.currentTarget.getAttribute('href'))
    }

    if (props.onClick) {
      props.onClick(e)
    }
  }
  const href =
    props.href.substr(0, 1) === '/' ? getBasepath() + props.href : props.href

  return { ...props, href, onClick }
}

const Button = props => (
  <button {...setLinkProps(props)}>{props.children}</button>
)

export default Button
