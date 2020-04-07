/**
 * @file /mypage/context/alert.js
 * @brief 마이페이지 알람
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//icon
import userIco from '../component/images/ic_user_normal.svg'
import moonIco from '../component/images/ico_moon_s.svg'
import alarmIco from '../component/images/ic_alarm.svg'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state
  const [listState, setListState] = useState(-1)
  const [alertList, setAlertList] = useState(false)

  //-----------------------------------------------------------------------------
  //function

  //-----------------------------------------------------------------------------
  return (
    <Content>
      <TitleWrap style={{paddingBottom: '25px'}}>
        <TitleText>알림</TitleText>
      </TitleWrap>
      <ul className="alert-list">
        <li>
          <figure>
            <img src={userIco} />
          </figure>
          <p>
            누구누구 님이 어떻게 어떻게 하였습니다. <span>2020.02.02</span>
          </p>
        </li>
        <li>
          <figure>
            <img src={moonIco} />
          </figure>
          <p>
            누구누구 님이 어떻게 어떻게 하였습니다. <span>2020.02.02</span>
          </p>
        </li>
        <li>
          <figure>
            <img src={alarmIco} />
          </figure>
          <p>
            누구누구 님이 어떻게 어떻게 하였습니다. <span>2020.02.02</span>
          </p>
        </li>
      </ul>
    </Content>
  )
}

const Content = styled.div`
  padding-top: 40px;
  .alert-list {
    li {
      display: flex;
      margin: 20px 0;
      figure {
        flex-basis: 36px;
        margin-right: 10px;
        height: 36px;
        line-height: 34px;
        border-radius: 50%;
        background: #f6f6f6;
        text-align: center;
        img {
          vertical-align: middle;
        }
      }
      p {
        padding-top: 2px;
        color: #424242;
        font-size: 14px;
        line-height: 20px;
        transform: skew(-0.03deg);
        span {
          display: block;
          color: #bdbdbd;
          font-size: 12px;
        }
      }
    }
  }
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  border-bottom: 1px solid #8556f6;
  padding-bottom: 25px;
`
const TitleText = styled.div`
  color: #8556f6;
  font-size: 20px;
  letter-spacing: -0.5px;
  font-weight: 600;
`
