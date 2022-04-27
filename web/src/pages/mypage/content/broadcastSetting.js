/**
 * @file /mypage/context/broadcastSetting.js
 * @brief 마이페이지 방송설정(금지어 관리, 매니저 관리, 차단회원 관리)
 **/
import React, {useState} from 'react'
import styled from 'styled-components'

//context
//ui

//component
import AppAlarm from 'pages/mypage/component/setting/appAlarm2'
import BroadCastSetting from 'pages/mypage/component/setting/broadcast'
import BanWord from 'pages/mypage/component/setting/banWord'
import Manager from 'pages/mypage/component/setting/manager'
import Blacklist from 'pages/mypage/component/setting/blacklist'
import PushMembers from 'pages/mypage/component/setting/push_members'

//constant
import {BC_SETTING_TYPE, SETTING_TYPE} from '../constant'
//svg
import ArrowIcon from '../component/arrow_right.svg'
import closeBtn from '../component/ic_back.svg'

const selectBoxData = [
  {value: BC_SETTING_TYPE.PUSH, text: 'Push 알림 설정'},
  {value: BC_SETTING_TYPE.BROADCAST, text: '방송 / 청취 설정'},
  {value: BC_SETTING_TYPE.BANWORD, text: '금지어 관리'},
  {value: BC_SETTING_TYPE.MANAGER, text: '매니저 관리'},
  {value: BC_SETTING_TYPE.BLACKLIST, text: '차단회원 관리'},
  {value: BC_SETTING_TYPE.PUSH_MEMBERS, text: '알림받기 설정 회원 관리'}
]

export default (props) => {
  //-----------------------------------------------------------------------------

  //state
  const [initialScreen, setInitialScreen] = useState(true)
  const [changeContents, setChangeContents] = useState(0)
  const [subContents, setSubContents] = useState(-1)
  //-----------------------------------------------------------------------------
  //function

  const createContent = () => {
    switch (changeContents) {
      case BC_SETTING_TYPE.PUSH:
        return <AppAlarm setChangeContents={setChangeContents} setInitialScreen={setInitialScreen} />
      case BC_SETTING_TYPE.BROADCAST:
        return <BroadCastSetting subContents={subContents} setSubContents={setSubContents} />
      case BC_SETTING_TYPE.BANWORD:
        return <BanWord />
      case BC_SETTING_TYPE.MANAGER:
        return <Manager />
      case BC_SETTING_TYPE.BLACKLIST:
        return <Blacklist />
      case BC_SETTING_TYPE.PUSH_MEMBERS:
        return <PushMembers />
      default:
        break
    }
  }
  // tab change content
  const ToggleContents = (value) => {
    setChangeContents(value)
    setInitialScreen(false)
  }
  // 백버튼
  const BackFunction = () => {
    if (initialScreen === false) {
      if (changeContents === BC_SETTING_TYPE.BROADCAST && subContents !== -1) {
        setSubContents(-1)
      } else {
        setInitialScreen(true)
      }
    } else {
      window.history.back()
    }
  }
  //-----------------------------------------------------------------------------
  return (
    <>
      <div className="header-wrap">
        <button className="close-btn" onClick={BackFunction}>
          <img src={closeBtn} alt="뒤로가기" />
        </button>
      </div>
      <Content>
        {initialScreen && (
          <div className="initial_contents">
            {selectBoxData.map((v, idx) => {
              return (
                <button key={idx} onClick={() => ToggleContents(v.value)}>
                  {v.text}
                  <a/>
                </button>
              )
            })}
          </div>
        )}
        {initialScreen === false && createContent()}
      </Content>
    </>
  )
}
// styled
const Content = styled.div`
  padding-top: 16px;
  .initial_contents {
    display: flex;
    flex-direction: column;
    button {
      position: relative;
      width: 100%;
      height: 44px;
      margin-bottom: 1px;
      background-color: #fff;
      text-align: left;
      padding: 0 0 0 16px;
      font-size: 16px;
      font-weight: 800;
      color: #000000;
      > a {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        display: block;
        width: 24px;
        height: 24px;
        background: url(${ArrowIcon});
      }
    }
  }
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
`
const TitleText = styled.div`
  color: #FF3C7B;
  font-size: 20px;
  letter-spacing: -0.5px;
  font-weight: 600;
`
const SelectWrap = styled.div`
  position: relative;
  transform: skew(-0.03deg);
  z-index: 8;
  > div > div {
    width: 154px;
    font-size: 14px !important;
    background-color: #fff;
    :before {
      top: 18px;
    }
    :after {
      top: 18px;
    }
  }
  > div .box-list {
    font-size: 14px !important;
    padding: 10px 10px;
  }
`

const SettingHeader = styled.div`
  position: relative;
  height: 40px;
  background-color: #fff;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  font-weight: 800;
  color: #000000;
  > button {
    position: absolute;
    display: block;
    left: 6px;
    width: 40px;
    height: 40px;
    background: url(${closeBtn});
  }
`
