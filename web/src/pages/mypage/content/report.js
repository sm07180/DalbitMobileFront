/**
 * @file /mypage/content/report.js
 * @brief 마이페이지 리포트
 */

import React, {useEffect, useStet, useContext} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

// context
import {Context} from 'context'

export default props => {
  const ctx = useContext(Context)
  return (
    <Report>
      <TitleWrap style={{paddingBottom: '16px'}}>
        <TitleText>리포트</TitleText>
        <div>
          <TypeBtn>방송</TypeBtn>
          <TypeBtn>청취</TypeBtn>
        </div>
      </TitleWrap>
      <TitleWrap style={{alignItems: 'flex-end'}}>
        <TitleText>방송요약</TitleText>
        <TitleSubMsg>데이터는 최대 6개월까지 검색 가능합니다.</TitleSubMsg>
      </TitleWrap>
      <TitleWrap>
        <TitleText>상세내역</TitleText>
      </TitleWrap>
    </Report>
  )
}

const TypeBtn = styled.button`
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 15px;
  width: 86px;

  &.active {
    border-color: #8556f6;
  }
`
const TitleSubMsg = styled.div`
  color: #bdbdbd;
  font-size: 12px;
  letter-spacing: -0.3px;
`

const TitleText = styled.div`
  color: #8556f6;
  font-size: 20px;
  font-family: NanumSquareB;
  letter-spacing: -0.5px;
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #8556f6;
  padding-bottom: 20px;
`

const Report = styled.div`
  margin-top: 40px;
`
