import React from 'react'

import './bottom.scss'
import { IMG_SERVER } from "constant/define";

const Bottom = (props) => {
  const {children} = props

  // 페이지 시작
  return (
    <div className='starDjBottom'>
      {children}  
    </div>
  )
}

export default Bottom
