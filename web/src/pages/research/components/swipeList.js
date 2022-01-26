import React from 'react'

export default (props) => {
  const {children, title} = props

  return (
    <>
      <div className='swipeTitle'>{title}</div>
      {children}
    </>
  )
}