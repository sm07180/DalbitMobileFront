import React from 'react'
import styled from 'styled-components'
//ui
import Header from 'components/ui/new_header.js'
import Contents from './contents'

export default (props) => {
  return (
    <Container>
      <Header title="레벨" />
      <Contents></Contents>
    </Container>
  )
}

const Container = styled.section`
  background: #eee;
`
