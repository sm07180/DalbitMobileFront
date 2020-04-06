/**
 * @title 채팅 ui 상단 정보들 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //console.log('방정보를 알아봅시다..', props)
  //state
  const [room, setRoom] = useState({
    bjHolder: '',
    fanRank: [
      {
        profImg: {
          url: ''
        },
        nickNm: ''
      },
      {
        profImg: {
          url: ''
        },
        nickNm: ''
      },
      {
        profImg: {
          url: ''
        },
        nickNm: ''
      }
    ],
    bgImg: '',
    title: '',
    bjProfImg: '',
    rank: '',
    bjNickNm: '',
    likes: ''
  })
  //const

  //---------------------------------------------------------------------
  //map

  const creatFanRank = () => {
    if (props.fanRank.length < 1) return
    return props.fanRank.map((item, index) => {
      return (
        <li className={`top${++index}`} key={index}>
          <Figure src={item.profImg.url} title={item.nickNm}>
            <img src={item.profImg.url} alt={item.nickNm} />
          </Figure>
        </li>
      )
    })
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    setRoom({
      ...room,
      ...props
    })
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <ul>
        <h4>팬 랭킹</h4>
        {creatFanRank()}
        <li className="people">50</li>
        {/* 현재 방송방 내 청취자 수 카운팅, 클릭시 청취자 탭*/}
      </ul>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  margin-top: 22px;
  /* 팬랭킹 */
  & ul {
    display: flex;
    height: 36px;
    text-align: right;
    h4 {
      margin-right: 22px;
      font-size: 14px;
      font-weight: normal;
      line-height: 36px;
      letter-spacing: -0.35px;
      text-align: center;
      color: #9e9e9e;
      transform: skew(-0.03deg);
    }

    li {
      display: inline-block;
      width: 36px;
      height: 36px;
      position: relative;
      margin-right: 4px;
      vertical-align: top;

      & img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }

    li:nth-child(-n + 3):after {
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      content: '';
    }
    li.top1:after {
      background: url(${IMG_SERVER}/images/chat/ic_gold.png) no-repeat 0 0 / cover;
    }
    li.top2:after {
      background: url(${IMG_SERVER}/images/chat/ic_silver.png) no-repeat 0 0 / cover;
    }
    li.top3:after {
      background: url(${IMG_SERVER}/images/chat/ic_bronze.png) no-repeat 0 0 / cover;
    }
    li.people {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(255, 2555, 255, 0.7);
      background: url(${IMG_SERVER}/images/chat/ic_fan.png) no-repeat center 8px;
      background-size: 13px;
      color: rgba(255, 2555, 255, 0.7);
      font-size: 13px;
      line-height: 60px;
      text-align: center;
      transform: skew(-0.03deg);
      cursor: pointer;
    }
    li + li {
      margin-left: 3px;
    }
  }
`
const Figure = styled.div``
