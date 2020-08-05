import React, {useContext, useEffect} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import Nav from './content/nav.js'

import Profile from './content/profile.js'
import Search from './content/search.js'
import Alarm from './content/alarm'

import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
// component //
import Layout from 'pages/common/layout'
import Api from 'context/api'
import LoginStay from '../login/loginState'
export default (props) => {
  const categoryList = [
    {type: 'nav', component: Nav},
    {type: 'profile', component: Profile},
    {type: 'alarm', component: Alarm},
    {type: 'search', component: Search}
  ]

  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx

  useEffect(() => {
    const {memNo} = token
    Api.profile({params: {memNo: memNo}}).then((profileInfo) => {
      if (profileInfo.result === 'success') {
        globalCtx.action.updateProfile(profileInfo.data)
      }
    })
  }, [])
  return (
    <>
      {/* 로그인 대기창  */}
      {/* <LoginStay /> */}
      {/* 2.5v myProfile  */}
      <Layout {...props} status="no_gnb">
        <MenuWrap>
          <Switch>
            {categoryList.map((value) => {
              const {type, component} = value
              return <Route exact path={`/menu/${type}`} component={component} key={type} />
            })}
          </Switch>
        </MenuWrap>
      </Layout>
    </>
  )
}

const MenuWrap = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #eeeeee;
`
