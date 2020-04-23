import React, {useEffect} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'
import styled from 'styled-components'

import TermsofUse from './content/TermsofUse.js'
import Privacy from './content/privacy.js'
import Search from './content/sess3.js'
import Alarm from './content/sess4.js'

// component
import Layout from 'pages/common/layout'

export default props => {
  const categoryList = [
    {type: 'TermsofUse', component: TermsofUse},
    {type: 'Privacy', component: Privacy},
    {type: 'alarm', component: Alarm},
    {type: 'search', component: Search}
  ]

  return (
    <Layout {...props} status="no_gnb">
      <MenuWrap>
        <Switch>
          {categoryList.map(value => {
            const {type, component} = value
            return <Route exact path={`/agree/${type}`} component={component} key={type} />
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
