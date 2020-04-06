import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Header from '../component/header.js'

export default props => {
  return (
    <div>
      <Header>
        <div className="category-text">검색</div>
      </Header>
      <div>검색영역</div>
    </div>
  )
}
//-------------------------
