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
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {profile} = context
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <h2>스토어</h2>
        {context.token.isLogin && profile && <p className="mydal">보유 달 {profile.dalCnt}</p>}
        {/* 배너슬라이더 */}
        <Slider>
          <Banner />
        </Slider>
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
  padding: 40px 0 120px 0;
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  @media (max-width: 1060px) {
    width: 95%;
    padding: 30px 0 100px 0;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 26px;
      font-size: 24px;
    }
  }
`

const Slider = styled.div`
  margin-top: 40px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 20px;
  }
`
