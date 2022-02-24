import React, {useCallback, useEffect, useRef, useState} from 'react'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import './level_achieve.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let timer

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [count, setCount] = useState(null)
  const previousDt = usePrevious(count)
  const history = useHistory()
  const [viewLevel, setViewLevel] = useState('')
  const [detailData, setDetailData] = useState(null)
  const [startDt, setStartDt] = useState(null)

  function countTimerMotion(dt, previousDt) {
    return Object.keys(dt).map((v, idx) => {
      const count = dt[v].toString()
      let previousCount
      if (previousDt !== null) {
        previousCount = previousDt[v].toString()
      }
      return (
        <div className={`times ${v}`} key={idx}>
          <span className="images">
            <img src="https://image.dalbitlive.com/event/level_achieve/comma.png" />
          </span>
          <span className={`images ${count[0]} ${previousCount && previousCount[0] !== count[0] && 'active'}`}>
            <img src={`https://image.dalbitlive.com/event/level_achieve/num${count[0]}.png`} />
          </span>
          {v === 'seconds' ? (
            <span className={`images ${count[1]} always`}>
              <img src={`https://image.dalbitlive.com/event/level_achieve/num${count[1]}.png`} />
            </span>
          ) : (
            <span className={`images ${count[1]} ${previousCount && previousCount[1] !== count[1] && 'active'}`}>
              <img src={`https://image.dalbitlive.com/event/level_achieve/num${count[1]}.png`} />
            </span>
          )}
        </div>
      )
    })
  }

  async function PopupCheck() {
    const {result, code, message} = await Api.eventJoinlevelPopup({})
    if (result === 'success') {
      setViewLevel(code)
      DetailCheck(code)
    } else {
      if (globalState.token.isLogin === false) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
          callback: () => {
            history.push({
              pathname: '/login',
              state: {
                state: 'event/level_achieve'
              }
            })
          }
        }))
      } else if (globalState.token.isLogin === true) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/')
          }
        }))
      }
    }
  }

  async function DetailCheck(code) {
    const {result, data, message} = await Api.eventJoinlevelDetail({
      slctType: code
    })
    if (result === 'success') {
      setDetailData({
        joinY: String(data.endDt).substr(0, 4),
        joinM: String(data.endDt).substr(4, 2),
        joinD: String(data.endDt).substr(6, 2),
        joinTH: String(data.endDt).substr(8, 2),
        joinTM: String(data.endDt).substr(10, 2)
      })
      setStartDt(data.startDt)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message,
        callback: () => {
          history.push('/')
        }
      }))
    }
  }

  const rewardButton = useCallback(async () => {
    const {result, code, message} = await Api.eventJoinlevelReward({
      slctType: viewLevel,
      code: '0'
    })

    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert_no_close",
        msg: `${
          viewLevel === '5' ? `선물로 달 20개가 지급되었습니다.` : viewLevel === '10' ? `선물로 달 50개가 지급되었습니다.` : ''
        }`,
        callback: () => {
          history.push('/')
        }
      }))
    } else {
      if (code === '-1') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: '보상받는 대상이 아닙니다.'
        }))
      } else if (code === '-2') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: `${
            viewLevel === '5'
              ? `5레벨을 달성 후 선물받기를 눌러주세요.`
              : viewLevel === '10'
              ? `10레벨을 달성 후 선물받기를 눌러주세요.`
              : ''
          }`
        }))
      } else if (code === '-3') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: '이벤트 기간이 종료되어 선물을 받을 수 없습니다.'
        }))
      } else if (code === '-4') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: `${
            viewLevel === '5'
              ? `이미 선물을 받은 계정입니다. 5레벨 달성 선물은 1인1번만 지급하고 있습니다. `
              : viewLevel === '10'
              ? `이미 선물을 받은 계정입니다. 10레벨 달성선물은 1인1번만 지급하고 있습니다. `
              : ''
          }`
        }))
      } else if (code === '-5') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: '본인인증 후 선물을 받을 수 있습니다.',
          callback: () => {
            history.push('/self_auth/self?event=/event/level_achieve')
          }
        }))
      } else if (code === '-6') {
        dispatch(setGlobalCtxMessage({
          type: "alert_no_close",
          msg: `${
            viewLevel === '5'
              ? `이미 선물을 받은 계정입니다. 5레벨 달성선물은 1인1번만 지급하고 있습니다. `
              : viewLevel === '10'
              ? `이미 선물을 받은 계정입니다. 10레벨 달성선물은 1인1번만 지급하고 있습니다. `
              : ''
          }`
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/')
          }
        }))
      }
    }
  }, [viewLevel])
  const CountWrapComponent = useCallback(() => {
    return <div>{count !== null && countTimerMotion(count, previousDt)}</div>
  }, [count, previousDt])

  function usePrevious(value) {
    const ref = useRef()

    useEffect(() => {
      ref.current = value
    }, [value])

    return ref.current
  }

  useEffect(() => {
    function CountDownTimer() {
      let end
      if (detailData !== null) {
        const {joinD, joinM, joinTH, joinTM, joinY} = detailData
        end = new Date(`${joinY}-${joinM}-${joinD}T${joinTH}:${joinTM}`)
      }

      let _second = 1000
      let _minute = _second * 60
      let _hour = _minute * 60
      let _day = _hour * 24
      let timer

      function showRemaining() {
        let now = new Date()
        let distance = end.getTime() - now.getTime()
        if (distance < 0) {
          clearInterval(timer)
          return
        }
        const days = ('0' + Math.floor(distance / _day)).slice(-2)
        const hours = ('0' + Math.floor((distance % _day) / _hour)).slice(-2)
        const minutes = ('0' + Math.floor((distance % _hour) / _minute)).slice(-2)
        const seconds = ('0' + Math.floor((distance % _minute) / _second)).slice(-2)

        setCount({days, hours, minutes, seconds})
      }

      timer = setInterval(showRemaining, 1000)
    }
    if (detailData !== null) {
      CountDownTimer()
    }

    return () => {
      clearTimeout(timer)
    }
  }, [detailData])

  useEffect(() => {
    PopupCheck()
  }, [])

  return (
    <div id="levelAchieve">
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
      </button>
      {viewLevel === '5' ? (
        <>
          <img
            src="https://image.dalbitlive.com/event/level_achieve/img_five01.jpg"
            alt="가입후 주 이내 5레벨을 달성하시면 달 20개를 선물로 드립니다."
          />
          <div className="timeWrap">
            <img src="https://image.dalbitlive.com/event/level_achieve/bg_img_five02_1.jpg" alt="이벤트 남은시간" />
            <div className="joinDay">
              {startDt !== null && (
                <>
                  {`${startDt.substr(0, 4)}.${startDt.substr(4, 2)}.${startDt.substr(6, 2)} ${startDt.substr(
                    8,
                    2
                  )}:${startDt.substr(10, 2)} `}
                </>
              )}
            </div>
            <div className="countBox">{count !== null && CountWrapComponent()}</div>
          </div>
          <button onClick={() => rewardButton()} className="eventButton">
            <img src="https://image.dalbitlive.com/event/level_achieve/btn_five.png" alt="선물받기" />
          </button>

          <img
            src="https://image.dalbitlive.com/event/level_achieve/20201214/img_five03.jpg"
            alt="이벤트 유의사항 5레벨 달성 선물은 가입후 2주일 이내에만 유효합니다."
            className="noticeImg"
          />
        </>
      ) : viewLevel === '10' ? (
        <>
          <img
            src="https://image.dalbitlive.com/event/level_achieve/img_ten01.jpg"
            alt="5레벨 달성후 2주일 내 10레벨을 달성하시면 달 50개를 선물로 드립니다."
          />
          <div className="timeWrap">
            <img src="https://image.dalbitlive.com/event/level_achieve/20201214/new_bg_img_ten02_1.jpg" alt="이벤트 남은시간" />

            <div className="joinDay ten">
              {startDt !== null && (
                <>
                  {`${startDt.substr(0, 4)}.${startDt.substr(4, 2)}.${startDt.substr(6, 2)} ${startDt.substr(
                    8,
                    2
                  )}:${startDt.substr(10, 2)} `}
                </>
              )}
            </div>
            <div className="countBox">{count !== null && CountWrapComponent()}</div>
          </div>
          <button onClick={() => rewardButton()} className="eventButton">
            <img src="https://image.dalbitlive.com/event/level_achieve/btn_ten.png" alt="선물받기" />
          </button>

          <img
            src="https://image.dalbitlive.com/event/level_achieve/20201214/img_ten03.jpg"
            alt="10레벨 달성 선물은 5레벨 달성 후 2주일 이내에만 유효합니다."
            className="noticeImg"
          />
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
