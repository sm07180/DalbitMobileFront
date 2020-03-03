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
  // setSystemMsg({...systemMsg, 3: <div>테테테테스트</div>})
  // setTimeout(() => {
  //   const item = systemMsg
  //   delete item[3]
  //   setSystemMsg({...systemMsg, ...item})
  // }, 3000)

  const creatFanRank = () => {
    return room.fanRank.map((item, index) => {
      return (
        <li className={`top${++index}`} key={index}>
          <Figure src={item.profImg.url} title={item.nickNm}>
            <img src={item.profImg.url} alt={item.nickNm} />
          </Figure>
        </li>
      )
    })
  }

  const creatTopMsg = msgType => {}

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
      {/* 시스템메시지, tip메시지 있을경우 뿌려주기 */}
      <>{props.top1Msg}</>
      <div className="top2-wrap">{props.top2Msg}</div>

      <div className="dj-info">
        <Figure src={room.bjProfImg.url} holder={room.bjHolder} title={room.bjNickNm} className="dj">
          <img src={room.bjProfImg.url} alt={room.bjNickNm} />
        </Figure>
        <div>
          <p>{room.bjNickNm}</p>
          <p>{room.title}</p>
        </div>
        <ul>
          {room.fanRank[0].profImg.url && creatFanRank()}
          <li className="people">50</li>
          {/* 현재 방송방 내 청취자 수 카운팅, 클릭시 청취자 탭*/}
        </ul>
      </div>
      <div className="cast-info">
        <ul>
          <li>85</li>
          {/* 누적 청취자 수 */}
          <li>{room.likes}</li>
          {/* 현재 방송 좋아요 수 */}
          <li>00:30:00</li>
          {/* 방송 남은 시간 */}
        </ul>
        <div>
          <button title="사연">사연</button>
          {/* 새로운 사연 왔을시 별도 알림, 클릭시 사연 탭 */}
          <button title="공지사항">공지사항</button>
          {/* 클릭시 공지 탭 */}
        </div>
      </div>
      <div className="option">
        <ul>
          <li className="rank">TOP {room.rank}</li>
          <li className="recommend">추천</li>
          <li className="popular">인기</li>
          <li className="new">신입</li>
        </ul>
        <div>
          <button className="invite">게스트 신청</button>
        </div>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  position: relative;
  padding: 10px;

  .system-msg {
    position: absolute;
    left: 0;
    top: 125px;
    width: calc(100% - 20px);
    margin: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    background: #ec455f;
    color: #fff;
    z-index: 1;

    &.top1 {
      top: 81px;
      padding: 8px;
      border-radius: 30px;
      background: rgba(236, 69, 95, 0.8);
      text-align: center;
    }

    &.top2.tip {
      span {
        position: relative;
        padding-left: 52px;
      }

      span:before {
        display: inline-block;
        position: absolute;
        top: -2px;
        left: 0;
        margin-right: 10px;
        padding: 0 10px;
        border-radius: 30px;
        background: #fff;
        color: #ec455f;
        font-weight: 600;
        line-height: 24px;
        content: 'TIP';
      }
    }

    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      transform: skew(-0.03deg);
    }
  }

  .top2-wrap .system-msg:nth-child(2) {
    top: 179px;
  }
  .top2-wrap .system-msg:nth-child(3) {
    top: 233px;
  }
  .top2-wrap .system-msg:nth-child(4) {
    top: 287px;
  }

  .dj-info {
    display: flex;
    position: relative;
    & > * {
      flex: 0 0 auto;
    }
    img {
      display: none;
    }
    /* DJ 이미지*/
    & > figure {
      flex-basis: 60px;
      height: 60px;
      margin: 8px 10px;
      border-radius: 50%;
    }
    /* DJ 이름, 방송 제목 */
    div {
      flex-grow: 1;
      flex-basis: auto;
      padding: 18px 0 18px 12px;
      p {
        overflow: hidden;
        width: 100%;
        color: #fff;
        text-overflow: ellipsis;
        /* white-space: nowrap; */
        letter-spacing: -0.45px;

        &:first-child {
          font-size: 18px;
        }
        &:last-child {
          margin-top: 6px;
          font-size: 16px;
          transform: skew(-0.03deg);
        }
      }
    }
    /* 팬랭킹 */
    ul {
      flex-basis: 200px;
      padding: 16px 0;
      text-align: right;
      li {
        display: inline-block;
        position: relative;
        vertical-align: top;
      }
      figure {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
      li:nth-child(-n + 3):after {
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 18px;
        height: 18px;
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
        width: 47px;
        height: 47px;
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
  }

  .cast-info {
    display: flex;
    height: 34px;
    border-radius: 34px;
    background: rgba(0, 0, 0, 0.2);
    ul {
      flex: 1 0 auto;
      li {
        display: inline-block;
        margin-left: 16px;
        padding-left: 26px;
        background-size: 18px !important;
        color: #fff;
        font-size: 15px;
        line-height: 34px;
        transform: skew(-0.03deg);
      }
      li:nth-child(1) {
        background: url(${IMG_SERVER}/images/chat/ic_people.png) no-repeat 1px center;
      }
      li:nth-child(2) {
        background: url(${IMG_SERVER}/images/chat/ic_heart.png) no-repeat 1px center;
      }
      li:nth-child(3) {
        background: url(${IMG_SERVER}/images/chat/ic_time.png) no-repeat 1px center;
      }
    }
    div {
      flex: 0 0 60px;
      margin-right: 10px;
      padding: 5px 0;

      button {
        width: 24px;
        height: 24px;
        text-indent: -9999px;
      }
      button:first-child {
        background: url(${IMG_SERVER}/images/chat/ic_mail.png) no-repeat center center / cover;
      }
      button:last-child {
        margin-left: 6px;
        background: url(${IMG_SERVER}/images/chat/ic_alarm.png) no-repeat center center / cover;
      }
    }
  }

  .option {
    display: flex;
    margin-top: 14px;
    ul {
      flex: 1 0 auto;
      li {
        display: inline-block;
        padding: 0 10px;
        border-radius: 28px;
        font-size: 14px;
        color: #fff;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
      li.rank {
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.2);
      }
      .dj li.rank {
        padding-left: 34px;
        border: 1px solid #9e9e9e;
        background: rgba(255, 255, 255, 0.2);
        line-height: 26px;
      }
      li.recommend {
        background: ${COLOR_MAIN};
      }
      li.popular {
        background: ${COLOR_POINT_P};
      }
      li.new {
        background: ${COLOR_POINT_Y};
      }
      li + li {
        margin-left: 5px;
      }
    }
    div {
      flex: 1 0 100px;
      text-align: right;
      button {
        display: inline-block;
        padding: 0 15px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.2);
        font-size: 14px;
        color: #fff;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
    }
  }
`

const Figure = styled.figure`
  position: relative;
  background: url(${props => props.src}) no-repeat center center / cover;
  cursor: pointer;

  &.dj:after {
    display: block;
    position: absolute;
    left: -12px;
    top: -11px;
    width: 82px;
    height: 82px;
    background: url(${props => props.holder}) no-repeat 0 0 / cover;
    content: '';
  }
`
