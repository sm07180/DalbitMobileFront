/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//layout
import Layout from 'pages/common/layout'
import Banner from './content/banner'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//components
import Contents from './content'
import Header from 'components/ui/header'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {profile} = context
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Content>
        <Header>
          <div className="category-text">스토어</div>
        </Header>

        {/* 배너슬라이더 */}
        {/* <Slider>
          <Banner />
        </Slider> */}
        {/* 결제아이템 */}
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
    top: 6px;
    left: 2%;
  }
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }
  .mydal {
    margin-bottom: 12px;
    color: #424242;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    text-align: right;
    transform: skew(-0.03deg);
    &:before {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      padding-right: 5px;
      vertical-align: top;
      background: url(${IMG_SERVER}/images/api/ic_moon_s@2x.png) no-repeat center center/ cover;
      content: '';
    }
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
