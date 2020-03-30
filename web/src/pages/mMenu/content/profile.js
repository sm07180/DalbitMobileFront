import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Header from '../component/header.js'

export default props => {
  return (
    <div>
      <Header>
        <div className="category-text">마이 페이지</div>
      </Header>
    </div>
  )
}
