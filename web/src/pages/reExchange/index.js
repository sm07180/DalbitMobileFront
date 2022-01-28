/**
 * @file /exchange/index.js
 * @brief 달 교환 페이지
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//components
import Contents from './content'
import Header from 'components/ui/header/Header'
// import Header from 'components/ui/new_header.js'

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {profile} = context
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Content>
        <Header type={'back'} title="달 교환" />
        {/* 교환아이템 */}
        <Contents {...props} />
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------
const Content = styled.section`
  min-height: 300px;
  height: 100%;
  margin: 0 auto;
  padding: 0 0 120px 0;
  background: #eeeeee;
`
