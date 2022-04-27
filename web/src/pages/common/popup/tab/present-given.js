import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {Scrollbars} from 'react-custom-scrollbars'
import Api from 'context/api'
import {useDispatch, useSelector} from "react-redux";

export default props => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //--------------------------------------------------- declare start
  const [secretYn, setSecret] = useState(false)
  const [givenData, setGivenData] = useState()
  const scrollbars = useRef(null)

  const {broadcastTotalInfo} = globalState

  //--------------------------------------------------- func start

  async function fetchData() {
    //const roomNo = store.roomInfo.roomNo
    const res = await Api.broadcast_room_received_gift_history({
      params: {
        roomNo: broadcastTotalInfo.roomNo,
        page: 1,
        records: 10
      }
    })
    if (res.result != 'fail') {
      setGivenData(res.data)
      console.log(res.message)
    }
  }

  // 공통값 조회 - context or store로 이동 필요함
  async function commonData() {
    const res = await Api.splash({})
  }

  function dateParsing(giftDate) {
    let str = giftDate.slice(-6)
    let hour = str.slice(0, 2)
    let Min = str.slice(2, 4)
    let sec = str.slice(4, 6)

    let timeFormat = hour + ':' + Min + ':' + sec
    return timeFormat
  }
  function makeContents() {
    if (givenData) {
      return (
        givenData.list.length > 0 &&
        givenData.list.map((data, idx) => {
          return (
            <Contents key={idx}>
              <UserInfo>
                <Img profImg={data.profImg.url} />
                <div className="user">
                  <div>{data.nickNm}</div>
                  <span>{dateParsing(data.giftDt)}</span>
                </div>
              </UserInfo>
              <ItemInfo>
                <div className="item">
                  {data.isSecret && <Secret>몰래</Secret>}
                  <span>{data.itemNm}</span>
                </div>
                <div className="gold">
                  <span>골드 {data.gold}</span>
                </div>
              </ItemInfo>
            </Contents>
          )
        })
      )
    }
  }

  useEffect(() => {
    fetchData() //api 테스트 완료했지만 데이터가 없어 테스트 데이터로 바인딩
    commonData()
  }, [])
  //--------------------------------------------------- components start
  return (
    <Container>
      <Navi title={'받은 선물 내역'} prev={props.prev} _changeItem={props._changeItem} />
      <div className="title">현 방송방 내에서 받은 선물 내역 입니다.</div>
      <Info>
        <GivenThings>
          <span>받은 수</span>
          <span className="count">{givenData && givenData.totalCnt ? givenData.totalCnt : 0}</span>
        </GivenThings>
        <span className="separator">|</span>
        <GivenThings>
          <span>받은 골드</span>
          <span className="count">{givenData && givenData.totalGold ? givenData.totalGold : 0}</span>
        </GivenThings>
      </Info>
      <History>
        <Scrollbars ref={scrollbars} style={{height: '90%'}} autoHide>
          {makeContents()}
        </Scrollbars>
      </History>
    </Container>
  )
}
//-------------------------------------------------- styled start
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  & > .title {
    display: flex;
    width: 100%;
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.71;
    letter-spacing: -0.35px;
    text-align: center;
    color: #616161;
    justify-content: center;
    align-items: flex-end;
  }
`

const Info = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  margin-top: 16px;
  border-radius: 10px;
  align-items: center;

  & .separator {
    color: #e0e0e0;
  }
`
const GivenThings = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;

  & > span {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    text-align: center;
    color: #9e9e9e;
  }

  .count {
    display: flex;
    margin-left: 15px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.5px;
    color: #FF3C7B;
  }
`
const History = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 9px;
`

const Contents = styled.div`
  display: flex;
  width: 100%;
  height: 54px;
  justify-content: space-between;
  align-items: center;
`
const UserInfo = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;

  .user {
    display: flex;
    flex-direction: column;
    align-items: left;
  }

  .user > div {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: -0.4px;
    color: #424242;
  }

  .user > span {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    color: #9e9e9e;
  }
`

const ItemInfo = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  .item {
    display: flex;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.35px;
    color: #9e9e9e;
    align-items: center;
  }

  .item > span {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.35px;
    color: #9e9e9e;
    text-align: right;
  }

  .gold {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    color: #424242;
  }
`
const Img = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 75px;
  margin-right: 5px;
  background: url(${props => props.profImg}) no-repeat center center / cover;
`
const Secret = styled.div`
  display: flex;
  width: 48px;
  height: 20px;
  border-radius: 20px;
  background: #fdad2b;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  font-size: 12px;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.3px;
  color: #fff;
`
