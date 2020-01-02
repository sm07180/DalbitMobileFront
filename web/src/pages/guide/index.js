/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */
import React from 'react'
//pages
import Layout from './layout'
import Contents from './layout-contents'
//
export default () => {
  //---------------------------------------------------------------------
  return (
    <Layout>
      <Contents />
    </Layout>
  )
}
