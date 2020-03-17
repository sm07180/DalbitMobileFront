/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import Select from 'components/ui/select'
import BroadContent from './live-broad-content'
import LiveCastBig from './live-big'
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import {isHybrid, Hybrid} from 'context/hybrid'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//context

export default props => {
  const history = useHistory()
  const context = useContext(Context)

  //state
  const [top1Data, setTop1Data] = useState()
  const [top2Data, setTop2Data] = useState()
  const [listData, setListData] = useState()

  //api

  const fetch = async () => {
    const res = await Api.broad_list({
      // params: {
      //   roomType: 1,
      //   page: 1,
      //   records: 5
      // }
    })
    if (res.result === 'success') {
      setTop1Data(res.data.list[0])
      setTop2Data(res.data.list[1])
      setListData(res.data.list.slice(2))
    } else {
    }
  }

  //exitRoom
  async function exitRoom(obj) {
    const res = await Api.broad_exit({data: {...obj}})
    if (res.result === 'success') {
      return res
    }
    alert(res.message)
  }

  //joinRoom
  async function joinRoom(obj) {
    console.log('objobjobjobjobjobj', obj)
    const {roomNo} = obj
    console.log('obj :: ', roomNo)
    const res = await Api.broad_join({data: {roomNo: obj.roomNo}})
    console.log('roomNo = ' + roomNo)
    //Error발생시 (방이 입장되어 있을때)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.join.already') {
      const exit = await exitRoom(obj)
      if (exit.result === 'success') joinRoom(obj)
    }
    //Error발생시 (종료된 방송)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.end') alert(res.message)
    //정상진입이거나,방탈퇴이후성공일경우
    if (res.result === 'success') {
      if (isHybrid()) {
        Hybrid('RoomJoin', res.data)
      } else {
        //하이브리드앱이 아닐때
        const {roomNo} = res.data
        context.action.updateBroadcastTotalInfo(res.data)
        history.push(`/broadcast?roomNo=${roomNo}`, res.data)
      }
    }
    return
  }

  const liveJoinRoom = roomNum => {
    joinRoom(roomNum)
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <>
      <Content>
        <div className="top-wrap">
          <div className="title-btn">
            <h2>실시간 LIVE</h2>
            <span
              onClick={() => {
                history.push('/live')
              }}>
              더보기
            </span>
          </div>
        </div>
        {listData && (
          <>
            <LiveCastBigWrap>
              <LiveCastBig info={top1Data} joinRoom={liveJoinRoom} />
              <LiveCastBig info={top2Data} joinRoom={liveJoinRoom} />
            </LiveCastBigWrap>
            <BroadContent info={listData} joinRoom={liveJoinRoom} className="brContent"></BroadContent>
          </>
        )}
      </Content>
    </>
  )
}

const Content = styled.div`
  width: 100%;
  padding: 60px 0 80px 0;

  .top-wrap {
    display: flex;
    & .title-btn {
      line-height: 36px;
      text-align: left;
      & h2 {
        display: inline-block;
        margin-right: 18px;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.85px;
        color: ${COLOR_MAIN};
      }
      & span {
        display: inline-block;
        width: 36px;
        height: 36px;
        font-size: 0;
        background: url(${IMG_SERVER}/images/api/ico-more-p.png) no-repeat center center / cover;
        vertical-align: top;
        cursor: pointer;
      }
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 40px 2.5% 60px 0;

    .top-wrap {
      & .title-btn {
        & h2 {
          font-size: 22px;
        }
      }
    }
  }
`
const LiveCastBigWrap = styled.div`
  overflow: hidden;
  margin-top: 35px;
  & div:nth-of-type(2) {
    margin-right: 0;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 20px;
  }
`
const Stitle = styled.div`
  width: 100%;
  height: 36px;
  margin-bottom: 43px;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  & h2 {
    float: left;
    margin-right: 16px;
    color: #8556f6;
    font-size: 34px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.85px;
    @media (max-width: ${WIDTH_MOBILE}) {
      width: calc(100% - 52px);
      font-size: 28px;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: auto;
  }
  & span {
    float: left;
    width: 36px;
    height: 36px;
    background: url('https://devimage.dalbitcast.com/images/api/ico-more-p.png') no-repeat center center / cover;
    font-size: 0;
    @media (max-width: ${WIDTH_MOBILE}) {
      float: right;
    }
  }
`
const SelectWrap = styled.div`
  float: right;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
`
