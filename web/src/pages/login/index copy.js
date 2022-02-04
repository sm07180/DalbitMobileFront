import React, {useContext} from 'react'
import {Context} from 'context'
import {useParams, useHistory, Redirect, Switch} from 'react-router-dom'

//components
import Layout from 'pages/common/layout/new_layout'
import LoginSns from './components/loginSns'
import './style.scss'

import qs from 'query-string'

export default function login(props) {
  const {type} = useParams()
  const globalCtx = useContext(Context)
  const history = useHistory()
  const {token} = globalCtx

  const login = () => {    
    history.push('/login/sns')
  }

  return (
    <Switch>
      {token && token.isLogin ? (
        <Redirect to={'/'} />
      ) : (
        <>
          {
            !type ? 
              <Layout status="no_gnb">
                <div id="loginPage">
                  <div className='loginMain'>
                    <div className='logo'>
                      <img src='https://image.dalbitlive.com/dalla/logo/dalla_logo.png' alt='dalla'/>
                    </div>
                    <div className='textWrap'>
                      <p className='mainText'>달라에서 매일<br/>재미있는 라이브를 즐겨보아요!</p>
                      <p className='subText'>로그인 후 이용할 수 있습니다.</p>
                    </div>
                    <button className='loginBtn' onClick={login}>로그인</button>
                  </div>
                </div>
              </Layout>
              :
              <>              
                  <LoginSns props={props} />
              </>
          }
        </>       
      )}
    </Switch>
  )
}
