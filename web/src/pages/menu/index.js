import React, {useContext} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import Nav from './content/nav.js'
import Profile from './content/profile.js'
import Search from './content/search.js'
import Alarm from './content/alarm.js'

import {Context} from 'context'

// component //
import Layout from 'pages/common/layout'
import Api from 'context/api'

export default props => {
  const categoryList = [
    {type: 'nav', component: Nav},
    {type: 'profile', component: Profile},
    {type: 'alarm', component: Alarm},
    {type: 'search', component: Search}
  ]

  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx

  if (!profile && window.location.pathname !== '/menu/search') {
    const {memNo} = token
    Api.profile({params: {memNo: memNo}}).then(profileInfo => {
      if (profileInfo.result === 'success') {
        globalCtx.action.updateProfile(profileInfo.data)
      }
    })
    return null
  }

  return (
    <Layout {...props} status="no_gnb">
      <MenuWrap>
        <Switch>
          {categoryList.map(value => {
            const {type, component} = value
            return <Route exact path={`/menu/${type}`} component={component} key={type} />
          })}
        </Switch>
      </MenuWrap>
    </Layout>
  )
}

const MenuWrap = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 16px;
`
