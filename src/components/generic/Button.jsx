import React from 'react'
import { setLinkProps } from 'hookrouter'

/* 
  Hookrouter Button
*/
const Button = props => <a {...setLinkProps(props)}>{props.children}</a>

export default Button
