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
import Utility from 'components/lib/utility'

//component
import NoResult from 'components/ui/noResult'

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
  //async
  async function getAlertList() {
    const res = await Api.my_notification({
      params: {
        page: 1,
        records: 10
      }
    })
    if (res.result == 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list == false) {
        setListState(0)
        setAlertList(false)
      } else {
        setListState(1)
        setAlertList(res.data.list)
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  //function
  const createAlertList = () => {
    if (alertList == false) return null
    return (
      <>
        <ul className="alert-list">
          {alertList.map((item, index) => {
            const {notiType, contents, memNo, roomNo, regDt, profImg} = item
            return (
              <li key={index}>
                <figure>
                  <img src={userIco} />
                </figure>
                <p>
                  {contents} <span>{Utility.dateFormatter(regDt, 'dot')}</span>
                </p>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  const createAlertResult = () => {
    if (listState === -1) {
      return null
    } else if (listState === 0) {
      return <NoResult className="mobile" text="알람이 없습니다." />
    } else {
      return createAlertList()
    }
  }

  useEffect(() => {
    getAlertList()
  }, [])

  //-----------------------------------------------------------------------------
  return (
    <Content>
      <TitleWrap style={{paddingBottom: '25px'}}>
        <TitleText>알림</TitleText>
      </TitleWrap>
      {createAlertResult()}
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
