import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'
import Api from 'context/api'
import {Context} from 'context'
export default props => {
  //context------------------------------------------
  const context = useContext(Context)
  //0.신고하기 Data state --------------------------------------
  //1.selected 초기state ---------------------------------------
  //2.버튼 active 비지빌리티--------------------------------------
  const [ReportInfo, setReportInfo] = useState(props.Info)
  const [select, setSelect] = useState('')
  const [active, setActive] = useState(false)
  //3.버튼info 배열 --------------------------------------
  const BTNInfo = [
    {
      title: '프로필 사진'
    },
    {
      title: '음란성'
    },
    {
      title: '광고 및 상업성'
    },
    {
      title: '욕설 및 비방성'
    },
    {
      title: '기타'
    }
  ]
  //셀렉트function-----------------------------------
  const handleSelectChange = event => {
    const value = event.target.value
    setSelect(value)
  }
  //신고하기버튼 벨리데이션 function-----------------------
  const SubmitBTNChange = () => {
    if (select != '') {
      setActive(true)
    }
  }

  useEffect(() => {
    SubmitBTNChange()
  })
  //버튼map
  const Reportmap = BTNInfo.map((live, index) => {
    const {title} = live
    return (
      <BTN value={title} onClick={event => handleSelectChange(event)} className={select === title ? 'on' : ''} key={index}>
        {title}
      </BTN>
    )
  })
  //------------------------------------------------------------
  return (
    <Container>
      <Navi title={'신고'} />
      <h2>
        <span>{ReportInfo.nickNm}</span>님을 신고하시겠습니까?
      </h2>
      <p>*허위 신고는 제제 대상이 될 수 있습니다.</p>

      {Reportmap}
      <SubmitBTN className={active === true ? 'on' : ''}>신고하기</SubmitBTN>
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
  & h2 {
    margin-top: 20px;
    color: #424242;
    font-size: 16px;
    font-weight: normal;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    & > span {
      color: #8556f6;
    }
  }
  & p {
    margin: 12px 0 16px 0;
    color: #9e9e9e;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: left;
    transform: skew(-0.03deg);
  }
`
const BTN = styled.button`
  display: block;
  width: 100%;
  margin-top: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 0;
  color: #616161;
  font-size: 14px;
  transform: skew(-0.03deg);
  outline: none;
  &.on {
    border: 1px solid #8556f6;
    color: #8556f6;
    font-weight: 600;
  }
`
const SubmitBTN = styled.button`
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 15px 0;
  border-radius: 10px;
  background-color: #bdbdbd;
  font-size: 16px;
  color: #fff;
  letter-spacing: -0.4px;
  &.on {
    background-color: #8556f6;
  }
`
