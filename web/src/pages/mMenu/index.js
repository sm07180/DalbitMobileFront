import React, {useEffect} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import Nav from './content/nav.js'

export default props => {
  const categoryList = {
    nav: {type: 'nav', component: Nav},
    profile: {type: 'profile', component: ''},
    alarm: {type: 'alarm', component: ''},
    search: {type: 'search', component: ''}
  }
  const {category} = useParams()
  return (
    <MenuWrap>
      <Switch>
        {categoryList.map(value => {
          const {type, component} = value
          return <Route exact path={`/menu/${type}`} component={component} key={type} />
        })}
      </Switch>
    </MenuWrap>
  )
}

const MenuWrap = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 16px;
`
