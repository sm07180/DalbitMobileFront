import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Navi from './navibar'
import Api from 'context/api'
import {Context} from 'context'
//notice 가데이터
const NoticeData = {
  notice: '안녕하세요. 74일차 디제이 라디오입니다.입구는 있어도 출구는 없습니다.  ♥하트+스푼은 사랑입니다♥'
}
export default props => {
  //context------------------------------------------------------------
  const context = useContext(Context)
  //0.공지사항등록 체인지 글자 스테이트-----------------------------------
  const [count, setCount] = useState(0)
  //텍스트아리아 벨리데이션function
  const handleChangeNotice = event => {
    const element = event.target
    const {value} = event.target
    if (value.length > 100) {
      return
    }
    setCount(element.value.length)
  }
  //--------------------------------------------------------------------
  return (
    <Container>
      <Navi title={'공지사항'} />
      <h5>*현재 방송방에서 공지할 내용을 입력하세요.</h5>
      <div className="noticeInput">
        <textarea onChange={handleChangeNotice} maxLength="100" placeholder="최대 100자 이내로 작성해주세요.">
          {/* {NoticeData.notice} */}
        </textarea>
        <Counter>{count} / 100</Counter>
      </div>
      <h4>방송 중 공지는 가장 최근 작성한 공지만 노출됩니다.</h4>
      <RegistBTN>등록하기</RegistBTN>
    </Container>
  )
}
//----------------------------------------
//styled
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  align-items: center;
  flex-direction: column;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
  & h5 {
    margin: 20px 0 16px 0;
    color: #616161;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  & .noticeInput {
    position: relative;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    & textarea {
      display: block;
      border: none;
      appearance: none;
      width: 100%;
      min-height: 140px;
      background-color: #f5f5f5;
      font-family: NanumSquare;
      color: #424242;
      font-size: 16px;
      transform: skew(-0.03deg);
      resize: none;
      outline: none;
    }
  }
  & h4 {
    margin: 12px 0;
    color: #bdbdbd;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.14;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
const Counter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: block;
  color: #bdbdbd;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`
const RegistBTN = styled.button`
  width: 100%;
  padding: 15px 0;
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  color: #fff;
  font-size: 16px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
