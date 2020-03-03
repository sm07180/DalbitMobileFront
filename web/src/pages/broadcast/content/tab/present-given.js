import React, {useState, useEffect, useRef, useContext} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {Scrollbars} from 'react-custom-scrollbars'
import Api from 'context/api'
import {Context} from 'context'
import {BroadCastStore} from '../../store'

const totalCnt = 42
const totalGold = 7800
const list = [
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰1',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미a',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰2',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미b',
    gold: 10,
    isSecret: true,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰3',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미c',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰4',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미d',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰5',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미e',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰6',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미f',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰7',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미g',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰8',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미h',
    gold: 10,
    isSecret: true,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰9',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미i',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰10',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미j',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰11',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미k',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰12',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미l',
    gold: 10,
    isSecret: true,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰13',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미m',
    gold: 10,
    isSecret: false,
    giftTs: '15484210',
    giftDt: '20200212135734'
  },
  {
    momNo: '11578531483848',
    nickNm: '닉네임쓰14',
    profImg: '',
    itemNo: '1001',
    itemNm: '장미n',
    gold: 10,
    isSecret: true,
    giftTs: '15484210',
    giftDt: '20200212135734'
  }
]

const test = {totalCnt: totalCnt, totalGold: totalGold, list: list}

export default props => {
  //--------------------------------------------------- declare start
  const [secretYn, setSecret] = useState(false)
  const [givenData, setGivenData] = useState(test)
  const scrollbars = useRef(null)
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //--------------------------------------------------- func start

  async function fetchData() {
    const roomNo = store.roomInfo.roomNo
    const res = await Api.broadcast_room_received_gift_history({
      params: {
        roomNo: roomNo.toString(),
        page: 1,
        records: 10
      }
    })
    console.log('## res : ', res)
    if (res.result != 'fail') {
      setGivenData(res)
    }
  }

  async function commonData() {
    const res = await Api.splash({})
    console.log('## splash :', res)
  }

  useEffect(() => {
    // fetchData()
    commonData()
  }, [])
  console.log('## givenData :', givenData)
  console.log('## store :', store)
  //--------------------------------------------------- components start
  return (
    <Container>
      <Navi title={'받은 선물 내역'} prev={props.prev} _changeItem={props._changeItem} />
      <div className="title">현 방송방 내에서 받은 선물 내역 입니다.</div>
      <Info>
        <GivenThings>
          <span>받은 수</span>
          <span className="count">{givenData.totalCnt ? givenData.totalCnt : 0}</span>
        </GivenThings>
        <span className="separator">|</span>
        <GivenThings>
          <span>받은 골드</span>
          <span className="count">{givenData.totalGold ? givenData.totalGold : 0}</span>
        </GivenThings>
      </Info>
      <History>
        <Scrollbars ref={scrollbars} style={{height: '90%'}} autoHide>
          {givenData.list.length > 0 &&
            givenData.list.map((data, idx) => {
              return (
                <Contents key={idx}>
                  <UserInfo>
                    <Img />
                    <div className="user">
                      <div>{data.nickNm}</div>
                      <span>{data.giftDt}</span>
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
            })}
          {/* {givenData.list.map((data, idx) => {
            return (
              <Contents key={idx}>
                <UserInfo>
                  <Img />
                  <div className="user">
                    <div>{data.nickNm}</div>
                    <span>{data.giftDt}</span>
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
          })} */}
          {/* <Contents>
            <UserInfo>
              <Img />
              <div className="user">
                <div>야호야호</div>
                <span>17:20:00</span>
              </div>
            </UserInfo>
            <ItemInfo>
              <div className="item">
                {secretYn && <Secret>몰래</Secret>}
                <span>item name</span>
              </div>

              <div className="gold">
                <span>골드 50</span>
              </div>
            </ItemInfo>
          </Contents> */}
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
    color: #8556f6;
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
  background: url('https://devimage.dalbitcast.com/images/api/guest@2x.png') no-repeat;
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
