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
import Header from 'components/ui/header'
//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {profile} = context
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Content>
        <Header>
          <div className="category-text">달 교환</div>
        </Header>
        {/* 교환아이템 */}
        <Contents {...props} />
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------
const Content = styled.section`
  width: 1040px;
  min-height: 300px;
  margin: 0 auto;
  padding: 0 0 120px 0;
  .close-btn {
    position: absolute;
    top: 1px;
    left: 2%;
  }
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  @media (max-width: 1060px) {
    width: 91.11%;
    padding: 0 0 80px 0;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 16px;
      font-size: 24px;
    }
  }
  .swiper-pagination {
    margin-top: 0 !important;
  }
`

const Slider = styled.div`
  margin-top: 40px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 15px;
  }
`
