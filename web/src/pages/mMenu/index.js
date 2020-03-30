import React, {useEffect} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import Nav from './content/nav.js'
import Profile from './content/profile.js'
import Search from './content/search.js'
import Alarm from './content/alarm.js'

export default props => {
  const categoryList = [
    {type: 'nav', component: Nav},
    {type: 'profile', component: ''},
    {type: 'alarm', component: ''},
    {type: 'search', component: ''}
  ]
  // const {category} = useParams()
  // console.log('category', category)

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
