import React, {useContext} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'
// components
import Nav from './content/nav.js'
import Profile2 from './content/profile2.js'
import Search from './content/search.js'
import Alarm from './content/alarm.js'
import Layout from 'pages/common/layout'
import LoginStay from '../login/loginState'

export default (props) => {
  // categoryArray
  const categoryList = [
    {type: 'nav', component: Nav},
    {type: 'profile', component: Profile2},
    {type: 'alarm', component: Alarm},
    {type: 'search', component: Search}
  ]
  // ctx
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  // profile check update
  if (!profile && window.location.pathname !== '/menu/search') {
    const {memNo} = token
    Api.profile({params: {memNo: memNo}}).then((profileInfo) => {
      if (profileInfo.result === 'success') {
        globalCtx.action.updateProfile(profileInfo.data)
      }
    })
    return null
  }
  //-------------------------------------------------------------------
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
// style
const MenuWrap = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #eeeeee;
`
