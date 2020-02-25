/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useState, useEffect, useContext} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'

//layout
import Layout from 'pages/common/layout'
import Contents from './layout-contents'
import Guide from './layout'
//context
import {Context} from 'context'

export default props => {
  return (
    <Guide {...props}>
      <Contents />
    </Guide>
  )
}
