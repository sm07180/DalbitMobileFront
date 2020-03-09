import React, {useEffect, useState} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import Api from 'context/api'

export default props => {
  return (
    <Layout {...props}>
      <Content>
        <SettingWrap>
          <div className="nickname">
            <img src="" />
          </div>
          <div className="user-id"></div>
          <div className="password"></div>
          <div className="gender-wrap"></div>
          <div className="msg-wrap">
            <div>프로필 메세지</div>
            <div>
              <textarea></textarea>
            </div>
          </div>
          <SaveBtn>저장</SaveBtn>
        </SettingWrap>
      </Content>
    </Layout>
  )
}

const SaveBtn = styled.div`
  padding: 16px 0;
  color: #fff;
  text-align: center;
  font-size: 16px;
  letter-spacing: -0.4px;
  background-color: #8556f6;
  cursor: pointer;
`

const SettingWrap = styled.div`
  width: 394px;
  margin: 0 auto;
`

const Content = styled.section`
  margin: 30px 0 100px 0;
`
