import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import {BroadCastStore} from 'pages/broadcast/store'
import Navi from './navibar'
import Api from 'context/api'
import {Context} from 'context'
export default props => {
  //console.log(props.selectidx)
  //context------------------------------------------
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  console.log(store.reportData)
  //0.신고하기 Data state --------------------------------------
  //1.selected 초기state ---------------------------------------
  //2.버튼 active 비지빌리티--------------------------------------
  const [ReportInfo, setReportInfo] = useState(props.Info)
  const [select, setSelect] = useState('')
  const [active, setActive] = useState(false)
  const btnIndex = useRef('')
  //3.버튼info 배열 --------------------------------------
  //api
  const fetchData = async () => {
    // const {roomNo} = props.location.state
    const res = await Api.member_declar({
      data: {
        memNo: store.reportData.memNo,
        reason: store.reportIndex
      }
    })
    if (res.result === 'success') {
      console.log(res)
      context.action.alert({
        msg: store.reportData.nickNm + '님을 신고 하였습니다.'
      })
    } else {
      context.action.alert({
        msg: '이미 신고한 회원 입니다.'
      })
    }

    return
  }
  const BTNInfo = [
    {
      title: '프로필 사진',
      id: 0
    },
    {
      title: '음란성',
      id: 1
    },
    {
      title: '광고 및 상업성',
      id: 2
    },
    {
      title: '욕설 및 비방성',
      id: 3
    },
    {
      title: '기타',
      id: 99
    }
  ]
  //셀렉트function-----------------------------------
  const handleSelectChange = event => {
    const value = event.target.value
    const indexs = event.target.id
    setSelect(value)
    store.action.updatereportIndex(indexs)
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
    const {title, id} = live
    return (
      <BTN value={title} onClick={event => handleSelectChange(event)} className={select === title ? 'on' : ''} key={index} id={id}>
        {title}
      </BTN>
    )
  })

  //------------------------------------------------------------
  return (
    <Container>
      <Navi title={'신고'} />
      <h2>
        <span>{store.reportData.nickNm}</span>님을 신고하시겠습니까?
      </h2>
      <p>*허위 신고는 제제 대상이 될 수 있습니다.</p>

      {Reportmap}
      <SubmitBTN className={active === true ? 'on' : ''} onClick={() => fetchData()}>
        신고하기
      </SubmitBTN>
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
      color: ${COLOR_MAIN};
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
    border: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
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
    background-color: ${COLOR_MAIN};
  }
`
