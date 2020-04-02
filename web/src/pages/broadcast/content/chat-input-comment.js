/**
 * @title 채팅 ui 하단 input 영역을 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {Link, NavLink} from 'react-router-dom'
import {BroadCastStore} from '../store'
import {useHistory} from 'react-router-dom'
const sc = require('context/socketCluster')
import {getAudioDeviceCheck} from 'components/lib/audioFeature.js'
let audioStream = null
//component
import LottieLoader from 'components/module/lottieLoader'
import * as timer from 'pages/broadcast/content/tab/timer'
import Volumebar from 'pages/broadcast/content/tab/volumebar'
//const Volumebar = React.lazy(() => import('pages/broadcast/content/tab/volumebar'));
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(BroadCastStore)

  const {mediaHandler} = context
  const history = useHistory()
  //state
  const [toggle, setToggle] = useState({
    mike: true, //마이크는 켜있는상태~
    volume: false,
    quick: false,
    menu: false,
    like: false
  })
  const [shortMessage, setShortMessage] = useState(null)
  let loginCheckMsg = '로그인 후 사용 가능 합니다.'
  //---------------------------------------------------------------------
  //function

  //오른쪽 메뉴들 토글기능
  const activeMenu = e => {
    const current = e.target.name

    setToggle({
      volume: current == 'volume' ? !toggle.volume : false,
      quick: current == 'quick' ? !toggle.quick : false,
      menu: current == 'menu' ? !toggle.menu : false,
      like: toggle.like,
      boost: toggle.boost
    })

    if (current === 'quick' && !toggle.quick) {
      broad_shortcut()
    }
  }

  //마이크 on off 기능~
  const activeMike = () => {
    console.log('store.mikeState = ' + store.mikeState)
    broad_micOnOff(!store.mikeState)
  }

  //좋아요~!
  const activeLike = () => {
    console.log('store.like = ' + store.like)
    if (store.like == 0) {
      if (context.token.isLogin) {
        loginCheckMsg = '좋아요는 방송청취 1분 후에 가능합니다.'
      }
      context.action.alert({
        //콜백처리
        callback: () => {
          return
        },
        msg: loginCheckMsg
      })
    }
    if (store.like == 1) {
      broad_likes(context.broadcastTotalInfo.roomNo)
    } else if (store.like == 2) {
      store.action.updateLike(3)
    }
  }

  //부스트
  const activeBoost = () => {
    store.action.updateTab(5)
    //부스트 탭 열린 후 부스트 사용에 따른 분기처리.
  }

  //좋아요 보내기
  async function broad_likes(roomNo) {
    let myFanJoin
    const res = await Api.broad_likes({data: {roomNo: roomNo}})
    //Error발생시
    if (res.result === 'fail') {
      store.action.updateLike(3)
    } else {
      context.action.updateBroadcastTotalInfo(res.data)
      store.action.updateLike(2)
      setToggle({
        ...toggle,
        like: true
      })
    }
    context.action.alert({
      // 좋아요 중복 사용 알림 팝업
      callback: () => {},
      msg: res.message
    })
  }
  //팬등록
  async function broad_fan_insert() {
    const res = await Api.broad_fan_insert({
      data: {
        memNo: store.roomInfo.bjMemNo,
        roomNo: store.roomInfo.roomNo
      }
    })
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    return res
  }
  //방나가기
  async function broad_exit() {
    // qs 문제가 발생
    let pathUrl = window.location.search
    let UserRoomNo = pathUrl ? pathUrl.split('=')[1] : ''
    const res = await Api.broad_exit({data: {roomNo: UserRoomNo}})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    } else {
      localStorage.clear()

      context.action.updateCastState(null) //gnb 방송중-방송종료 표시 상태값
      context.action.updateBroadcastTotalInfo(null)
      mediaHandler.stop()
      timer.stopTimer() //방송 시간 멈춤
      history.push('/live')
      sc.socketClusterDestory(false, UserRoomNo)
    }
    //return res
  }
  async function broadcastOff() {
    context.action.confirm({
      callback: () => {
        broad_exit()
      },
      //캔슬콜백처리
      cancelCallback: () => {},
      msg: `방송을 ${props.auth === 3 ? '종료' : '나가기'} 하시겠습니까?`
    })
  }

  const infiniteAudioChecker = async () => {
    audioStream = await navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(result => result)
      .catch(e => e)

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioContext()

    const audioSource = audioCtx.createMediaStreamSource(audioStream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    audioSource.connect(analyser)

    // const volumeCheck = () => {
    //   const db = getDecibel(analyser)
    //   if (db <= 1) {
    //     setAudioVolume(0)
    //   } else if (db !== audioVolume) {
    //     setAudioVolume(db)
    //     if (!audioPass) {
    //       setAudioPass(true)
    //     }
    //   }
    // }

    // if (!drawId) {
    //   drawId = setInterval(volumeCheck)
    // }
  }
  const detectAudioDevice = async () => {
    const device = await getAudioDeviceCheck()
    if (drawId && device) {
      setAudioPass(false)
      setAudioVolume(0)
      clearInterval(drawId)
      drawId = null
      await infiniteAudioChecker()
    }
  }

  //마이크 on off
  async function broad_micOnOff(isMic) {
    //return
    const res = await Api.broad_state({
      data: {
        roomNo: store.roomInfo.roomNo,
        isMic: isMic,
        isCall: false
      }
    })
    //Error발생시

    if (res.result === 'success') {
      mediaHandler.setMuted(isMic)
      store.action.updateMikeState(!store.mikeState)
    }
  }
  //빠른말 가져오기
  async function broad_shortcut() {
    const res = await Api.member_broadcast_shortcut({
      method: 'GET'
    })
    //Error발생시
    if (res.result === 'success') {
      setShortMessage(res.data)
      store.action.updateShortCutList(res.data)
    }
  }
  async function broad_Link() {
    console.log(JSON.stringify(props))

    const res = await Api.broad_link({
      params: {
        link: store.roomInfo.link
      },
      method: 'GET'
    })
    //Error발생시
    if (res.result === 'success') {
      console.log('## broad_link  res = ' + res)
    } else {
      console.log('## broad_link  res = ' + res)
    }
  }
  const broadcastLink = e => {
    if (context.token.isLogin) {
    } else {
      context.action.alert({
        //콜백처리
        callback: () => {
          return
        },
        msg: loginCheckMsg
      })
    }

    //broad_Link()
  }
  const Commandlist = () => {
    const info = ['인사', '박수', '감사']

    return info.map((list, index) => {
      return (
        <li
          key={index}
          onClick={() => {
            fastSendMeassage({cmdType: index})
          }}>
          {list}
        </li>
      )
    })
  }
  const fastSendMeassage = idx => {
    const list = store.shortCutList

    if (list && idx) {
      if (context.token.isLogin) {
        sc.SendMessageChat({roomNo: props.roomNo, msg: list[idx.cmdType].text})
      } else {
        context.action.alert({
          //콜백처리
          callback: () => {},
          msg: loginCheckMsg
        })
      }
    }
  }

  const creatLikeBoost = () => {
    // DJ일 경우 마이크 ON/OFF 버튼 노출
    // 청취자일 경우 좋아요 버튼 노출, 좋아요 했을시에는 부스트(당근모양) 버튼 노출
    if (props.auth === 3) {
      return (
        <button name="mike" className={`mike ${store.mikeState ? 'on' : 'off'}`} title="마이크" onClick={activeMike}>
          마이크
        </button>
      )
    } else {
      if (store.like <= 2) {
        //1~2단계 일시 좋아요 버튼 노출
        return (
          <button name="like" className={`like ${toggle.like ? 'on' : 'off'}`} title="좋아요~" onClick={activeLike}>
            좋아요
          </button>
        )
      } else if (store.like >= 3) {
        // 3~4단계 일시 부스트버튼(당근모양) 노출
        return (
          <button name="boost" className={`boost ${toggle.boost ? 'on' : 'off'}`} title="부스트사용" onClick={activeBoost}>
            부스트사용
          </button>
        )
      }
    }
  }

  const goRecvPresent = () => {
    if (context.token.isLogin) {
      //방장인 경우 받은 선물 탭으로 이동
      if (context.broadcastTotalInfo.auth != 3) {
        store.action.updateTab(4)
      } else {
        store.action.updateTab(12)
      }
    } else {
      context.action.alert({
        //콜백처리
        callback: () => {},
        msg: loginCheckMsg
      })
    }
  }
  const actionSetting = () => {
    if (context.token.isLogin) {
      store.action.updateTab(11)
    } else {
      context.action.alert({
        //콜백처리
        callback: () => {},
        msg: loginCheckMsg
      })
    }
  }
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    toggle.mike = true
  }, [store.mikestate])

  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="present" onClick={() => goRecvPresent()}>
        <LottieLoader path={`${IMG_SERVER}/ani/lottie/chat-present.json`} width={50} height={46} loop={true}></LottieLoader>
      </div>

      <input type="text" autoComplete="off" placeholder="대화를 입력해주세요." onKeyPress={props.onKeyPress} />
      <div className="btn-wrap">
        {/* 좋아요-부스터버튼, 마이크 버튼 */}
        {creatLikeBoost()}
        {/* 볼륨조절버튼 */}
        {props.auth < 3 && (
          <button name="volume" className="volume" title="볼륨조정" onClick={activeMenu}>
            볼륨조정
          </button>
        )}

        <ul className={`volume-box ${toggle.volume ? 'on' : 'off'}`}>
          <li>
            <Volumebar></Volumebar>
          </li>
        </ul>
        {/* 빠른말버튼 */}
        <button name="quick" className={`quick ${toggle.quick ? 'on' : 'off'}`} title="빠른말" onClick={activeMenu}>
          빠른말
        </button>
        <ul className={`quick-box ${toggle.quick ? 'on' : 'off'}`}>
          {Commandlist()}
          <li onClick={actionSetting}>세팅</li>
        </ul>
        {/* 기타메뉴 버튼 */}
        <button name="menu" className={`menu ${toggle.menu ? 'on' : 'off'}`} title="기타메뉴" onClick={activeMenu}>
          기타메뉴
        </button>
        <ul className={`menu-box ${toggle.menu ? 'on' : 'off'}`}>
          {props.auth === 3 && (
            <li className="edit" onClick={() => store.action.updateTab(10)}>
              수정하기
            </li>
          )}
          <li className="share" onClick={broadcastLink}>
            공유하기
          </li>
          <li className="exit" onClick={broadcastOff}>
            {props.auth == 3 ? '방송종료' : '나가기'}
          </li>
        </ul>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 66px;
  padding: 15px;
  background: #212121;

  input {
    flex: 0 auto;
    width: 100%;
    margin: 0 10px 0 40px;
    border: 0;
    border-radius: 36px;
    line-height: 36px;
    text-indent: 18px;
  }

  div.present {
    position: absolute;
    left: 3px;
    top: 10px;
    width: 52px;
  }

  button {
    width: 36px;
    height: 36px;
    margin-left: 4px;
    text-indent: -9999px;
    &.present {
      flex: 0 0 36px;
      background: url(${IMG_SERVER}/images/chat/ic_gift.png) no-repeat center center / cover;
    }
    &.like {
      background: url(${IMG_SERVER}/images/chat/ic_heart_i.png) no-repeat center center / cover;
      &.on {
        background: url(${IMG_SERVER}/images/chat/ic_heart@3x.png) no-repeat center center / cover;
      }
    }
    &.boost {
      background: url(${IMG_SERVER}/images/chat/ic_booster_off@2x.png) no-repeat center center / cover;
      &.on {
        background: url(${IMG_SERVER}/images/chat/ic_booster@2x.png) no-repeat center center / cover;
      }
    }
    &.mike {
      background: url(${IMG_SERVER}/images/chat/ic_mic@2x.png) no-repeat center center / cover;

      &.off {
        position: relative;
        &:after {
          display: inline-block;
          position: absolute;
          left: 17px;
          top: 1px;
          width: 1px;
          height: 33px;
          background: #ec455f;
          content: '';
          transform: rotate(-40deg);
        }
      }
    }
    &.volume {
      background: url(${IMG_SERVER}/images/chat/ic_volume.png) no-repeat center center / cover;
      &.off {
        background: url(${IMG_SERVER}/images/chat/ic_volume.png) no-repeat center center / cover;
      }
    }
    &.quick {
      background: url(${IMG_SERVER}/images/chat/ic_message.png) no-repeat center center / cover;
      &.on {
        background: url(${IMG_SERVER}/images/chat/ic_message_over@2x.png) no-repeat center center / cover;
      }
    }
    &.menu {
      background: url(${IMG_SERVER}/images/chat/ic_more.png) no-repeat center center / cover;
      &.on {
        background: url(${IMG_SERVER}/images/chat/ic_more@2x.png) no-repeat center center / cover;
      }
    }
  }

  div.btn-wrap {
    flex: 0 0 160px;
    ul {
      display: none;
      position: absolute;
      &.on {
        display: block;
      }
      &.volume-box {
        /* bottom: 53px;
        right: 102px;
        width: 22px;
        height: 106px;
        border-radius: 25px;
        background: #000;
        text-indent: -9999px; */
      }
      &.quick-box,
      &.menu-box {
        position: absolute;
        bottom: 78px;
        right: 10px;
        li {
          display: inline-block;
          padding: 0 15px;
          border-radius: 30px;
          background: #dbdbdb;
          color: #212121;
          font-size: 14px;
          font-weight: 600;
          line-height: 32px;
          vertical-align: top;
          cursor: pointer;
          transform: skew(-0.03deg);
        }
        li + li {
          margin-left: 10px;
        }
      }
      &.quick-box {
        li:last-child {
          background: #dbdbdb url(${IMG_SERVER}/images/chat/ic_setting.png) no-repeat center center / cover;
          background-size: 20px;
          text-indent: -9999px;
        }
      }
      &.menu-box {
        li {
          padding: 0 15px 0 38px;
        }
        li.edit {
          background: #dbdbdb url(${IMG_SERVER}/images/chat/ic_edit.png) no-repeat 14px center;
          background-size: 20px;
        }
        li.share {
          background: #dbdbdb url(${IMG_SERVER}/images/chat/ic_share.png) no-repeat 14px center;
          background-size: 20px;
        }
        li.exit {
          background: #dbdbdb url(${IMG_SERVER}/images/chat/ic_sign_off.png) no-repeat 14px center;
          background-size: 20px;
        }
      }
    }
  }
  /* 모바일반응형 */
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 56px;
    padding: 10px 6px;
    input {
      margin: 0 4px 0 42px;
      font-size: 12px;
      text-indent: 14px;
    }
    div.present {
      position: absolute;
      left: -1px;
      top: 6px;
      width: 40px;
    }
    div.btn-wrap {
      flex: 0 0 136px;

      ul.menu-box,
      ul.quick-box {
        bottom: 66px;
        right: 10px;
      }
      ul.volume-box {
        right: 153px;
        bottom: 46px;
      }
    }
    button {
      width: 34px;
      margin-left: 0;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    div.btn-wrap {
      flex: 0 0 102px;
    }
    button {
      &.volume {
        display: none;
      }
    }
  }
`
