import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'

import './package.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const packageEventView = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const [eventState, setEventState] = useState('')

  const eventJoin = () => {
    const stateCheck = async () => {
      const res = await API.getPackageEventStateCheck()
      if (res.result === 'success') {
        setEventState(res.data)
      } else {
        if (!globalState.token.isLogin) {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: res.message,
            callback: () => {
              history.push({
                pathname: '/login',
                state: {
                  state: 'event/package'
                }
              })
            }
          }))
        } else {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: res.message,
            callback: () => {
            }
          }))
        }
      }
    }
    stateCheck()
  }

  useEffect(() => {
    if (eventState.isOk === 0) {
      //참여불가능
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `<div class="packageEventAlertColor">지원신청을 위해서는 방송시간이<br/>10시간 이상이어야 합니다.<br/><span >누적 방송 시간 : ${eventState.airTimeStr}</span></div>`,
        callback: () => {
        }
      }))
    } else if (eventState.isOk === 1) {
      //참여 가능
      history.push('/event/package/write')
    }
  }, [eventState])

  return (
    <div id="packageEvent">
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
      </button>
      <img src="https://image.dalbitlive.com/event/package/20210127/visual.jpg" alt="보이는 라디오 웹캠 지원 이벤트" />
      <img
        src="https://image.dalbitlive.com/event/package/20210127/content.jpg"
        alt="진행일정: 1월 27일 ~ 2월 1일 / 결과 발표 : 2월 2일 목요일"
      />

      {!globalState.token.isLogin ? (
        <button onClick={() => eventJoin()}>
          <img src="https://image.dalbitlive.com/event/package/20210127/button_off.jpg" alt="지원신청 비활성화"/>
        </button>
      ) : (
        <button onClick={() => eventJoin()}>
          <img src="https://image.dalbitlive.com/event/package/20210127/button_on.jpg" alt="지원신청"/>
        </button>
      )}
    </div>
  )
}

export default packageEventView
