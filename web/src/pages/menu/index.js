import React, {useContext, useEffect} from 'react'
import {Switch, Route, useParams, useHistory, Redirect} from 'react-router-dom'
import styled from 'styled-components'

import Nav from './content/nav.js'

import Profile from './content/profile.js'
import Search from './content/search'
import Alarm from './content/alarm'

import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
// component //
import Layout from 'pages/common/layout'
import Api from 'context/api'
export default (props) => {
  let history = useHistory()
  let params = useParams()
  const categoryList = [
    {type: 'nav', component: Nav},
    {type: 'profile', component: Profile},
    {type: 'alarm', component: Alarm},
    {type: 'search', component: Search}
  ]

  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  // useEffect(() => {
  //   const {memNo} = token
  //   Api.profile({params: {memNo: memNo}}).then((profileInfo) => {
  //     if (profileInfo.result === 'success') {
  //       globalCtx.action.updateProfile(profileInfo.data)
  //     }
  //   })
  // }, [globalCtx.close])

  // if (token.isLogin === false && params.category === 'profile') {
  //   window.location.href = '/login'
  //   return null
  // }

  return (
    <>
      {/* 로그인 대기창  */}
      {/* <LoginStay /> */}
      {/* 2.5v myProfile  */}
      {!profile && token.isLogin === false && params.category === 'profile' ? (
        <Redirect to={`/login`} />
      ) : (
        <Layout {...props} status="no_gnb">
          <MenuWrap style={{backgroundColor: params && params.category === 'search' && '#fff'}}>
            <Switch>
              {categoryList.map((value) => {
                const {type, component} = value
                return <Route exact path={`/menu/${type}`} component={component} key={type} />
              })}
            </Switch>
          </MenuWrap>
        </Layout>
      )}
    </>
  )
}

const MenuWrap = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #eeeeee;
`
