/**
 * @file /mypage/context/broadcastSetting.js
 * @brief 마이페이지 방송설정(금지어 관리, 매니저 관리, 블랙리스트 관리)
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
//ui
import SelectBoxs from 'components/ui/selectBox.js'

//component
import BanWord from '../component/setting/banWord'
import Manager from '../component/setting/manager'
import Blacklist from '../component/setting/blacklist'

//svg
import ArrowIcon from '../component/arrow_right.svg'
import closeBtn from '../component/ic_back.svg'
const selectBoxData = [
  {value: 0, text: '금지어 관리'},
  {value: 1, text: '매니저 관리'},
  {value: 2, text: '블랙리스트 관리'}
]

export default (props) => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state
  const [currentMenu, setCurrentMenu] = useState(selectBoxData[0])
  const [initialScreen, setInitialScreen] = useState(true)
  const [changeContents, setChangeContents] = useState(0)
  //-----------------------------------------------------------------------------
  //function
  const selectMenu = (e) => {
    setCurrentMenu(selectBoxData[e])
  }

  const createContent = () => {
    switch (changeContents) {
      case 0:
        return <BanWord />
        break
      case 1:
        return <Manager />
        break
      case 2:
        return <Blacklist />
        break

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
      setInitialScreen(true)
    } else {
      window.history.back()
    }
  }
  //-----------------------------------------------------------------------------
  return (
    <>
      <div className="header-wrap">
        <h2 className="header-title">
          {initialScreen && '방송설정'}
          {initialScreen === false && changeContents == 0 && '금지어 관리'}
          {initialScreen === false && changeContents == 1 && '매니저 관리'}
          {initialScreen === false && changeContents == 2 && '블랙리스트 관리'}
        </h2>
        <button className="close-btn" onClick={BackFunction}>
          <img src={closeBtn} alt="뒤로가기" />
        </button>
      </div>
      <Content>
        {initialScreen && (
          <div className="initial_contents">
            <button onClick={() => ToggleContents(0)}>
              금지어 관리<a></a>
            </button>
            <button onClick={() => ToggleContents(1)}>
              매니저 관리<a></a>
            </button>
            <button onClick={() => ToggleContents(2)}>
              블랙리스트 관리<a></a>
            </button>
          </div>
        )}
        {initialScreen === false && createContent()}
      </Content>
    </>
  )
}
// styled
const Content = styled.div`
  padding: 12px 16px 0 16px;
  .initial_contents {
    display: flex;
    flex-direction: column;
    button {
      position: relative;
      width: 100%;
      height: 44px;
      margin-bottom: 4px;
      border-radius: 12px;
      background-color: #fff;
      text-align: left;
      padding: 0 0 0 16px;
      font-size: 14px;
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
  color: #632beb;
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
