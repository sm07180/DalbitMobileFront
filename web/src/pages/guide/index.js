/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useEffect} from 'react'
import {Switch, Route} from 'react-router-dom'

//layout
import Layout from './layout'
import Contents from './layout-contents'
import Guide from './layout'
//

function TempBroad() {
  return (
    <div>
      <div>dfdf</div>
    </div>
  )
}

export default props => {
  return (
    <Layout {...props}>
      <div>temp broadcast</div>

      <Switch>
        <Route path={`${props.match.path}/:test`} component={TempBroad} />
      </Switch>

      {/* <Contents /> */}
    </Layout>
  )
}
