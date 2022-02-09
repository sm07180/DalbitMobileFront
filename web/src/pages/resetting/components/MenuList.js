import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// global components

const MenuList = (props) => {
  const {text,path,children} = props
  let history = useHistory()

  const onClickLink = (e) => {
    const {targetLink} = e.currentTarget.dataset
    history.push(targetLink);
  }

  return (
    <div className='menuList' data-target-link={path} onClick={onClickLink}>
      <div className='menuName'>{text}</div>
      {children}
    </div>
  )
}

export default MenuList