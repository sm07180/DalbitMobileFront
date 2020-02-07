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
  console.log('ddd', props.match)

  return (
    <Layout {...props}>
      <div>temp broadcast</div>
      <Switch>
        <Route path={'/guide/:test'} component={TempBroad} />
      </Switch>

      {/* <Contents /> */}
    </Layout>
  )
}
