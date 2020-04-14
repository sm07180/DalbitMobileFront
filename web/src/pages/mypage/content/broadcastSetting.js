/**
 * @file /mypage/context/broadcastSetting.js
 * @brief 마이페이지 방송설정(금지어 관리, 매니저 관리, 블랙리스트 관리)
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import Header from '../component/header.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//ui
import SelectBoxs from 'components/ui/selectBox.js'

//component
import BanWord from '../component/setting/banWord'
import Manager from '../component/setting/manager'
import Blacklist from '../component/setting/blacklist'

const selectBoxData = [
  {value: 0, text: '금지어 관리'},
  {value: 1, text: '매니저 관리'},
  {value: 2, text: '블랙리스트 관리'}
]

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state
  const [currentMenu, setCurrentMenu] = useState(selectBoxData[0])

  //-----------------------------------------------------------------------------
  //function
  const selectMenu = e => {
    setCurrentMenu(selectBoxData[e])
  }

  const createContent = () => {
    switch (currentMenu.value) {
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

  //-----------------------------------------------------------------------------
  return (
    <>
      <TopWrap>
        <button onClick={() => window.history.back()}></button>
        <div className="title">방송설정</div>
      </TopWrap>
      <Content>
        <TitleWrap style={{paddingBottom: '25px'}}>
          <TitleText>{currentMenu.text}</TitleText>
          <SelectWrap>
            <SelectBoxs boxList={selectBoxData} onChangeEvent={selectMenu} inlineStyling={{right: 0, top: '-20px', zIndex: 8}} />
          </SelectWrap>
        </TitleWrap>
        {createContent()}
      </Content>
    </>
  )
}

const Content = styled.div`
  padding-top: 40px;
`

const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  border-bottom: 1px solid #632beb;
  padding-bottom: 25px;
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
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
