/**
 * @title 채팅 ui 상단 정보들 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
import {BroadCastStore} from '../store'
import {useHistory} from 'react-router-dom'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//import * as timer from 'pages/broadcast/content/tab/timer'
import Timer from 'pages/broadcast/content/tab/timer'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  let history = useHistory()
  //console.log('방정보를 알아봅시다..', props)
  //state

  const [room, setRoom] = useState({
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
    ...props
  })
  //부스트 상태값. 기본값은 방장인지 아닌지만 판단함
  const [boost, setBoost] = useState(props.auth == 3 ? 'boost-off' : '')
  const [likeTimer, setLikeTimer] = useState() //  좋아요 타이머체크
  //const

  //---------------------------------------------------------------------
  //map

  const creatFanRank = () => {
    const roomInfo = context.broadcastTotalInfo.fanRank ? context.broadcastTotalInfo.fanRank : room.fanRank
    if (roomInfo.length < 1) return <></>
    return room.fanRank.map((item, index) => {
      return (
        <li className={`top${++index}`} key={index}>
          <Figure src={item.profImg.url} title={item.nickNm} onClick={() => goBjProfile({...item, isBj: false})}>
            <img src={item.profImg.url} alt={item.nickNm} />
          </Figure>
        </li>
      )
    })
  }

  // 방장일경우 게스트 초대, 청취자일경우 게스트 신청, 게스트가 있을경우 게스트 프로필 노출
  const creatGuest = () => {
    if (room.gstMemNo) {
      return (
        <Figure className="guest" src={room.gstProfImg}>
          <span>G</span>
        </Figure>
      )
    } else {
      return (
        <button className="invite" onClick={() => store.action.updateTab(1)}>
          {props.auth == 3 ? '게스트 초대' : '게스트 신청'}
        </button>
      )
    }
  }
  // const likeCheck = () => {
  //   if (context.broadcastTotalInfo === null) {
  //     return room.like
  //   } else {
  //     return context.broadcastTotalInfo.likes
  //   }
  // }
  let userTypeMemNo = ''
  async function goBjProfile(obj) {
    store.action.updateTab(6)

    if (obj.isBj) {
      userTypeMemNo = context.broadcastTotalInfo.bjMemNo
    } else {
      userTypeMemNo = obj.memNo
    }
    const res = await Api.broad_member_profile({
      params: {
        memNo: userTypeMemNo,
        roomNo: context.broadcastTotalInfo.roomNo
      },
      method: 'GET'
    })
    //Error발생시
    if (res.result === 'success') {
      store.action.updateBroadcastProfileInfo(res.data)
    }
  }

  async function getNotice() {
    store.action.updateTab(8)
    const res = await Api.broad_notice({
      params: {
        roomNo: context.broadcastTotalInfo.roomNo
      },
      method: 'GET'
    })
    //Error발생시
    if (res.result === 'success') {
      store.action.updateNoticeMsg(res.data.notice)
    }
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    setRoom({
      ...room,
      ...props
    })
    likeCheckTimer()
  }, [])

  // 방 입장후 좋아요 타이머 체크 함수
  const likeCheckTimer = () => {
    if (props.auth === 3) return
    const stop = clearInterval(likeTimer)
    setLikeTimer(stop)
    let myTime = 0
    const interval = setInterval(() => {
      myTime++
      if (myTime === 60) {
        console.log('좋아요 기능 활성화 ')
        clearInterval(interval) // 부스트 시간이 끝나면 stop
        store.action.updateLike(1)
      }
    }, 1000)
    setLikeTimer(interval)
  }

  //좋아요~부스트단계 바뀔시마다 셋팅해줘야할것들.. top랭크 영역표시 클래스 조절하기
  useEffect(() => {
    if (props.auth == 3) {
      store.action.updateLike(3)
    } else {
      if (store.like == 3) {
        //like 단계가 3일경우 부스트가 꺼진 상태임. 2단계에서 빨간하트를 클릭시 3단계로 진입함. dj는 기본값이 부스트가 꺼진상태임.
        setBoost('boost-off')
      } else if (store.like == 4) {
        //like 단계가 4일경우 부스트를 사용하는 중임.
        setBoost('boost-on')
      } else {
        //like단계가 1~2일경우 (좋아요하기전, 하고나서) top랭크 영역은 평범하게 표시해줌, 추가 클래스네임 없으므로 빈값으로 셋팅함
        setBoost('')
      }
    }
  }, [store.like])

  //---------------------------------------------------------------------
  return (
    <Content>
      {/* 시스템메시지, tip메시지 있을경우 뿌려주기 */}
      <>{props.top1Msg}</>
      <div className="top2-wrap">{props.top2Msg}</div>

      <div className="dj-info">
        {/* 모바일 백버튼 */}
        <button
          className="minimize"
          onClick={() => {
            history.goBack()
          }}>
          최소화
        </button>
        {/* 방장 프로필, 방장 닉네임, 방 제목 */}
        <Figure src={room.bjProfImg.url} holder={room.bjHolder} title={room.bjNickNm} className="dj" onClick={() => goBjProfile({isBj: true})}>
          <img src={room.bjProfImg.url} alt={room.bjNickNm} />
        </Figure>
        <div>
          <p>{room.bjNickNm}</p>
          <p>{context.broadcastTotalInfo.title}</p>
        </div>
        <ul>
          {/* 팬랭킹 영역 */}
          {creatFanRank()}
          {/* 현재 방송방 내 청취자 수 카운팅, 클릭시 청취자 탭*/}
          <li className="people" onClick={() => store.action.updateTab(0)}>
            {context.broadcastTotalInfo.userCount != '' ? context.broadcastTotalInfo.userCount : 0}
          </li>
        </ul>
      </div>
      <div className="cast-info">
        <ul>
          {/* 누적 청취자 수 */}
          <li>{context.broadcastTotalInfo.historyCount != '' ? context.broadcastTotalInfo.historyCount : 0}</li>
          {/* 현재 방송 좋아요 수 */}
          <li>{context.broadcastTotalInfo.likes !== null ? context.broadcastTotalInfo.likes : room.likes}</li>
          {/* 방송 남은 시간 */}
          {props.auth === 3 && (
            <li>
              <Timer></Timer>
            </li>
          )}
        </ul>
        <div>
          {/* 새클릭시 사연 탭 */}
          <button title="사연" onClick={() => store.action.updateTab(9)}>
            사연
          </button>
          {/* 클릭시 공지 탭 */}
          <button title="공지사항" onClick={() => getNotice()} className={context.broadcastTotalInfo.hasNotice == true ? 'on' : ''}>
            공지사항
          </button>
        </div>
      </div>
      <div className="option">
        <ul>
          {/* 
          랭킹 (부스터 사용 표시)
          boost-off 상태 -> dj일 경우, 청취자가 좋아요를 했을경우
          boost-on 상태 -> 부스터 쓸 경우. */}
          <li className={`rank ${boost}`}>TOP {context.broadcastTotalInfo.rank != '' ? context.broadcastTotalInfo.rank : room.rank}</li>
          {/* 방에 붙여진 딱지 추천, 인기, 신입 */}
          {props.isRecomm && <li className="recommend">추천</li>}
          {props.isPop && <li className="popular">인기</li>}
          {props.isNew && <li className="new">신입</li>}
        </ul>
        <div>
          {/* 방장일경우 게스트 초대 버튼, 청취자일경우 게스트 신청 버튼, 게스트가 있을경우 게스트 프로필 노출  */}
          {creatGuest()}
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
  z-index: 1;

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

  .top2-wrap {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 125px;
    width: 100%;

    & .system-msg {
      position: relative;
      top: 0;
      margin: 10px 0 0 0;
    }
  }

  .dj-info {
    display: flex;
    position: relative;
    & > * {
      flex: 0 0 auto;
    }

    .minimize {
      display: none;
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
      button.on:last-child {
        background: url(${IMG_SERVER}/images/api/ic_alarm_dot.png) no-repeat center center / cover;
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
        position: relative;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.2);
      }
      li.rank.boost-off {
        padding-left: 35px;
        border: 1px solid #9e9e9e;
        &:before {
          display: inline-block;
          position: absolute;
          left: -1px;
          top: -1px;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: #9e9e9e url(${IMG_SERVER}/images/chat/ic_chat_top_carrot.png) no-repeat center center/ cover;
          content: '';
        }
      }
      li.rank.boost-on {
        padding-right: 35px;
        border: 1px solid #feac2b;
        &:before {
          display: inline-block;
          position: absolute;
          right: -1px;
          top: -1px;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: #fff url(${IMG_SERVER}/images/chat/ic_booster.png) no-repeat center center/ cover;
          content: '';
        }
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

  /* 모바일반응형 */
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 5px;
    .system-msg {
      width: calc(100% - 10px);
      margin: 10px 5px;
      padding: 8px 10px;
      span {
        font-size: 12px;
        line-height: 18px;
      }
      &.top1 {
        top: 53px;
        padding: 4px 5px;
      }
      &.top2.tip span {
        padding-left: 46px;
        &:before {
          padding: 0 8px;
          line-height: 20px;
        }
      }
    }

    .top2-wrap {
      top: 93px;
      width: calc(100% - 10px);

      .system-msg {
        width: 100%;
        margin: 8px 0 0 0;
      }
    }

    .dj-info {
      align-items: center;
      .minimize {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 2px;
        background: url(${IMG_SERVER}/images/chat/ic_arrow_down@2x.png) no-repeat center center/ cover;
        text-indent: -9999px;
      }

      & > figure {
        flex-basis: 40px;
        height: 40px;
      }
      div {
        max-width: calc(100% - 238px);
        padding: 12px 0 9px 5px;

        p {
          overflow: hidden;
          white-space: nowrap;
        }

        p:first-child {
          font-size: 14px;
        }
        p:last-child {
          margin-top: 3px;
          font-size: 12px;
        }
      }
      ul {
        flex-basis: 148px;
        padding: 11px 0 11px 10px;
        figure {
          width: 32px;
          height: 32px;
        }
        li:nth-child(-n + 3):after {
          width: 12px;
          height: 12px;
        }
        li.people {
          width: 33px;
          height: 33px;
          background: url(${IMG_SERVER}/images/chat/ic_fan.png) no-repeat center 8px;
          background-size: 10px;
          font-size: 10px;
          line-height: 40px;
        }
        li + li {
          margin-left: 2px;
        }
      }
    }

    .cast-info {
      height: 28px;
      margin-top: 2px;
      border-radius: 28px;

      ul {
        li {
          font-size: 12px;
          line-height: 28px;
        }
      }

      div {
        padding: 2px 0;
      }
    }

    .option {
      margin-top: 10px;
      ul {
        li {
          font-size: 10px;
          line-height: 22px;
        }
      }
      div {
        button {
          font-size: 10px;
          line-height: 22px;
        }
      }
    }
  }
`

const Figure = styled.figure`
  position: relative;
  background: #fff url(${props => props.src}) no-repeat center center / cover;
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

  &.guest {
    width: 60px;
    height: 60px;
    margin: 0 0 0 auto;
    border-radius: 50%;
    span {
      display: inline-block;
      position: absolute;
      right: -2px;
      bottom: 0;
      padding: 3px 6px;
      border-radius: 50%;
      background: ${COLOR_POINT_P};
      color: #fff;
      font-size: 13px;
      transform: skew(-0.3deg);
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    &.dj:after {
      left: -9px;
      top: -9px;
      width: 56px;
      height: 56px;
    }
  }
`
