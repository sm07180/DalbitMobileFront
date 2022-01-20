// context
import {Context} from 'context'

//components
import Layout from 'pages/common/layout/new_layout'
import LoginForm from './login_form'
import LoginSns from './login_sns'
import './login.scss'

import qs from 'query-string'
import React, {useContext} from 'react'
import {useParams} from 'react-router-dom'
import {Redirect, Switch} from 'react-router-dom'

export default function login(props) {
  const params = useParams()
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  return (
    <Switch>
      {token && token.isLogin ? (
        <Redirect to={'/'} />
      ) : (
        <Layout status="no_gnb">
          <div id="loginPage">
            <LoginSns props={props} />
          </div>
        </Layout>
      )}
    </Switch>
  )
}
