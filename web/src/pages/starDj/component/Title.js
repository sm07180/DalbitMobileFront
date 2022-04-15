import React from 'react'
import { IMG_SERVER } from "constant/define";

import './title.scss'

const Title = (props) => {
  const {name} = props

  // 페이지 시작
  return (
    <div className='sectionTitle'>
      <img src={`${IMG_SERVER}/starDJ/starDJ_title-${name}.png`} alt={name}/>
    </div>
  )
}

export default Title
