/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useEffect} from 'react'
//layout
import Layout from './layout'
import Contents from './layout-contents'
//

export default props => {
  return (
    <Layout {...props}>
      <div>temp broadcast</div>
      <div></div>
      {/* <Contents /> */}
    </Layout>
  )
}
