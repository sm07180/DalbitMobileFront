/**
 * @file /level/index.js
 * @brief 레벨 별 혜택 안내 페이지
 * @todo swiper ui & 프로필 효과 및 칭호 api 호출
 */
import React from 'react'
//layout
import Layout from 'pages/common/layout'
//components
import Content from './content'

export default props => {
  return (
    <Layout {...props} status="no_gnb">
      <Content {...props} />
    </Layout>
  )
}
