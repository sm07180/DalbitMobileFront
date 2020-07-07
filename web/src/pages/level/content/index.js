import React from 'react'
import styled from 'styled-components'
//ui
import Header from './header'
import Contents from './contents'

export default props => {
  return (
    <Container>
      <Header>
        <div className="category-text">레벨</div>
      </Header>
      <Contents></Contents>
    </Container>
  )
}

const Container = styled.section`
  background: #eee;
`
