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
    volume: false,
    quick: false,
    menu: false
  })
  const [shortMessage, setShortMessage] = useEffect(null)

  //---------------------------------------------------------------------
  //function

  //오른쪽 메뉴들 토글기능
  const activeMenu = e => {
    const current = e.target.className
    setToggle({
      volume: current == 'volume' ? !toggle.volume : false,
      quick: current == 'quick' ? !toggle.quick : false,
      menu: current == 'menu' ? !toggle.menu : false
    })

    // if(current === 'quick' && toggle.quick){

    // }
  }

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
    context.action.confirm({
      //콜백처리
      callback: () => {
        const res = broad_exit(props.roomNo)
        if (res) {
          sc.SendMessageChatEnd(props)
        }
        window.location.replace('https://' + window.location.hostname)
      },
      //캔슬콜백처리
      cancelCallback: () => {
        //alert('confirm callback 취소하기')
      },
      msg: '방송을 종료 하시겠습니까?'
    })
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
  const fastSendMeassage = index => {
    console.log(index)
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <button className="present" title="선물하기">
        선물하기
      </button>
      <input type="text" placeholder="대화를 입력해주세요." onKeyPress={props.onKeyPress} />
      <div>
        <button className="like" title="좋아요~">
          좋아요
        </button>
        <button className="volume" title="볼륨조정" onClick={activeMenu}>
          볼륨조정
        </button>
        <ul className={`volume-box ${toggle.volume ? 'on' : 'off'}`}>
          <li>볼륨조절바</li>
        </ul>
        <button className="quick" title="빠른말" onClick={activeMenu}>
          빠른말
        </button>

        <ul className={`quick-box ${toggle.quick ? 'on' : 'off'}`}>
          {Commandlist()}
          <li onClick={() => store.action.updateTab(11)}>세팅</li>
        </ul>
        <button className="menu" title="기타메뉴" onClick={activeMenu}>
          기타메뉴
        </button>
        <ul className={`menu-box ${toggle.menu ? 'on' : 'off'}`}>
          <li className="edit">수정하기</li>
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
    text-indent: -9999px;
    &.present {
      flex: 0 0 36px;
      background: url(${IMG_SERVER}/images/chat/ic_gift.png) no-repeat center center / cover;
    }
    &.like {
      background: url(${IMG_SERVER}/images/chat/ic_heart_i.png) no-repeat center center / cover;
    }
    &.volume {
      background: url(${IMG_SERVER}/images/chat/ic_volume.png) no-repeat center center / cover;
    }
    &.quick {
      background: url(${IMG_SERVER}/images/chat/ic_message.png) no-repeat center center / cover;
    }
    &.menu {
      background: url(${IMG_SERVER}/images/chat/ic_more.png) no-repeat center center / cover;
    }
  }

  div {
    flex: 0 0 160px;
    button + button {
      margin-left: 8px;
    }
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
        right: 15px;
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
