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
          <ProfileImg />
          <div className="nickname">
            <NicknameInput autoComplete="off" />
          </div>
          <UserId>@elpapp01</UserId>
          <PasswordInput autoComplete="new-password" />
          <BirthDate />
          <GenderWrap>
            <GenderTab>남자</GenderTab>
            <GenderTab>여자</GenderTab>
          </GenderWrap>

          <GenderAlertMsg>* 생년월일과 성별 수정을 원하시는 경우 고객센터로 문의해주세요.</GenderAlertMsg>

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

const GenderAlertMsg = styled.div`
  color: #bdbdbd;
  font-size: 12px;
`

const GenderTab = styled.div`
  width: 50%;
  text-align: center;
  user-select: none;
`
const GenderWrap = styled.div`
  display: flex;
  flex-direction: row;
`

const BirthDate = styled.div`
  padding: 16px;
  background-color: #eee;
  box-sizing: border-box;
`

const PasswordInput = styled.input.attrs({type: 'password'})``
const UserId = styled.div`
  padding: 16px;
  background-color: #eee;
  box-sizing: border-box;
  color: #616161;
  letter-spacing: -0.4px;
`
const NicknameInput = styled.input.attrs({type: 'text'})`
  display: block;
`

const ProfileImg = styled.img`
  display: block;
  margin: 0 auto;
  margin-bottom: 32px;
  border-radius: 50%;
  width: 88px;
  height: 88px;
  cursor: pointer;
`

const SettingWrap = styled.div`
  width: 394px;
  margin: 0 auto;
`

const Content = styled.section`
  margin: 30px 0 100px 0;
`
