import React, {useContext, useState, useEffect, useRef} from 'react'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import Swiper from 'react-id-swiper'
import {Hybrid} from 'context/hybrid'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//layout
import Layout from 'pages/common/layout'

export default (props) => {
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      클립댓글
    </Layout>
  )
}
//---------------------------------------------------------------------
