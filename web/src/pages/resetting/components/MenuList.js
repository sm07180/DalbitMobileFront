import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

// global components

const MenuList = (props) => {
  const {text,path,children, disabledClick} = props
  let history = useHistory()

  const onClickLink = (e) => {
    const {targetLink} = e.currentTarget.dataset
    history.push(targetLink);
  }

  return (
    <div className='menuList' data-target-link={path} onClick={(e) => !disabledClick ? onClickLink(e) : () => {}}>
      <div className='menuName'>{text}</div>
      {children}
      <span className={text === "선물 시 자동 스타 추가" ? "" : "arrow"}/>
    </div>
  )
}

MenuList.defaultProps = {
  disabledClick: false
}
export default MenuList