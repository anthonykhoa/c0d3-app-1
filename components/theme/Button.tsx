import React from 'react'

import { ColorTypes, colors } from './colors'
import noop from '../../helpers/noop'

type ButtonProps = {
  border?: boolean
  type?: 'success' | 'danger' | 'primary'
  color?: ColorTypes
  m?: '1'
  ml?: '2'
  size?: 'lg' | 'sm'
  onClick?: Function
}

export const Button: React.FC<ButtonProps> = ({
  m,
  ml,
  type,
  border,
  color = 'black',
  onClick = noop,
  children,
  size
}) => {
  const classes = ['btn']

  if (border) classes.push('border')
  if (type) classes.push(`bg-${type}`)
  if (m) classes.push(`m-${m}`)
  if (ml) classes.push(`ml-${ml}`)
  if (size) classes.push(`btn-${size}`)

  return (
    <button
      className={classes.join(' ')}
      onClick={() => onClick()}
      style={{ color: colors[color] }}
    >
      {children}
    </button>
  )
}
