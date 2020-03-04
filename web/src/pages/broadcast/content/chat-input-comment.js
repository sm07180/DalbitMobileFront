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
const sc = require('context/socketCluster')

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  //state
  const [toggle, setToggle] = useState({
    mike: true, //마이크는 켜있는상태~
    volume: false,
    quick: false,
    menu: false,
    like: false
  })
  //const

  //---------------------------------------------------------------------
  //function

  //오른쪽 메뉴들 토글기능
  const activeMenu = e => {
    const current = e.target.name
    setToggle({
      volume: current == 'volume' ? !toggle.volume : false,
      quick: current == 'quick' ? !toggle.quick : false,
      menu: current == 'menu' ? !toggle.menu : false,
      mike: toggle.mike,
      like: toggle.like,
      boost: toggle.boost
    })
  }

  //마이크 on off 기능~
  const activeMike = () => {
    setToggle({
      ...toggle,
      mike: !toggle.mike
    })
  }

  //좋아요~!
  const activeLike = () => {
    if (store.like == 1) {
      //좋아요 성공시..
      setToggle({
        ...toggle,
        like: true
      })
      store.action.updateLike(2)
    } else if (store.like == 2) {
      store.action.updateLike(3)
    }
  }

  //부스트
  const activeBoost = () => {
    //부스트 탭 열린 후 부스트 사용에 따른 분기처리.
  }

  //좋아요 보내기
  async function broad_likes(roomNo) {
    const res = await Api.broad_likes({data: {roomNo: roomNo}})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    return res
  }

  //방나가기
  async function broad_exit(roomNo) {
    const res = await Api.broad_exit({data: {roomNo: roomNo}})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    return res
  }
  const broadcastOff = e => {
    console.log('broadcastOff = ' + JSON.stringify(props))
    let bcEndType = ''
    //bcEndType = props.auth == 3 ? '방송 종료' : '방송 나가기'
    context.action.confirm({
      //콜백처리
      callback: () => {
        //props.history.push('/')
        const res = broad_exit(props.roomNo)
        if (res) {
          sc.SendMessageChatEnd(props)
        }
        window.location.replace('https://' + window.location.hostname)
        //sc.socketClusterDestory(false, context.broadcastReToken.roomNo)
      },
      //캔슬콜백처리
      cancelCallback: () => {
        //alert('confirm callback 취소하기')
      },
      msg: '방송을 종료 하시겠습니까?'
    })
  }

  const creatLikeBoost = () => {
    // DJ일 경우 마이크 ON/OFF 버튼 노출
    // 청취자일 경우 좋아요 버튼 노출, 좋아요 했을시에는 부스트(당근모양) 버튼 노출
    if (props.auth === 3) {
      return (
        <button name="mike" className={`mike ${toggle.mike ? 'on' : 'off'}`} title="마이크" onClick={activeMike}>
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
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <button className="present" title="선물하기">
        선물하기
      </button>
      <input type="text" placeholder="대화를 입력해주세요." onKeyPress={props.onKeyPress} />
      <div>
        {/* 좋아요-부스터버튼, 마이크 버튼 */}
        {creatLikeBoost()}
        {/* 볼륨조절버튼 */}
        <button name="volume" className="volume" title="볼륨조정" onClick={activeMenu}>
          볼륨조정
        </button>
        <ul className={`volume-box ${toggle.volume ? 'on' : 'off'}`}>
          <li>볼륨조절바여기있어요~~ 여기에 넣어주세요~~</li>
        </ul>
        {/* 빠른말버튼 */}
        <button name="quick" className={`quick ${toggle.quick ? 'on' : 'off'}`} title="빠른말" onClick={activeMenu}>
          빠른말
        </button>
        <ul className={`quick-box ${toggle.quick ? 'on' : 'off'}`}>
          <li>인사</li>
          <li>박수</li>
          <li>감사</li>
          <li onClick={() => store.action.updateTab(11)}>세팅</li>
        </ul>
        {/* 기타메뉴 버튼 */}
        <button name="menu" className={`menu ${toggle.menu ? 'on' : 'off'}`} title="기타메뉴" onClick={activeMenu}>
          기타메뉴
        </button>
        <ul className={`menu-box ${toggle.menu ? 'on' : 'off'}`}>
          {props.auth === 3 && <li className="edit">수정하기</li>}
          <li className="share">공유하기</li>
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
    margin: 0 10px;
    border: 0;
    border-radius: 36px;
    line-height: 36px;
    text-indent: 18px;
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

  div {
    flex: 0 0 160px;
    ul {
      display: none;
      position: absolute;
      &.on {
        display: block;
      }
      &.volume-box {
        bottom: 53px;
        right: 102px;
        width: 22px;
        height: 106px;
        border-radius: 25px;
        background: #000;
        text-indent: -9999px;
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
`
