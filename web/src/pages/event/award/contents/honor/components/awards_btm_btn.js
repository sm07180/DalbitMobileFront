import React, {useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function AwardsBtmBtn(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {selectedDJ, djMemNo, isFan, toggleFan} = props
  const history = useHistory()

  const becomeFan = useCallback(async () => {
    const {result, message} = await Api.fan_change({data: {memNo: djMemNo}})
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert_no_close",
        msg: `${selectedDJ?.djNickNm} 님의 팬이 되었습니다`,
        callback: () => toggleFan(message)
      }))
    }
  }, [isFan, selectedDJ])

  const cancelFan = useCallback(async () => {
    const {result, message} = await Api.mypage_fan_cancel({data: {memNo: djMemNo}})
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert_no_close",
        msg: message,
        callback: () => toggleFan()
      }))
    }
  }, [isFan, selectedDJ])

  const toggleFanHandler = () => {
    if (!globalState.token.isLogin) {
      history.push({
        pathname: '/login',
        state: {state: 'event/award/2020'}
      })
    } else {
      if (isFan) {
        // a fan -> not a fan
        dispatch(setGlobalCtxMessage({
          type: "confirm",
          msg: `${selectedDJ?.djNickNm} 님의 팬을 취소 하시겠습니까?`,
          callback: () => cancelFan(),
          cancelCallback: () => dispatch(setGlobalCtxMessage({type: "confirm", visible: false}))
        }))
      } else {
        // not a fan -> a fan
        becomeFan()
      }
    }
  }

  const redirectUser = () => {
    !globalState.token.isLogin
      ? history.push({
          pathname: '/login',
          state: {state: 'event/award/2020'}
        })
      : history.push(`/profile/${djMemNo}?tab=1`)
  }

  const buttonsList = [
    {
      imgUrl: `https://image.dalbitlive.com/event/award_rank/btn_fan${isFan ? '' : '_plus'}@2x.png`,
      imgAlt: '팬 등록',
      clickHandler: toggleFanHandler
    },
    {
      imgUrl: `https://image.dalbitlive.com/event/award_rank/btn_fanboard@2x.png`,
      imgAlt: '팬보드 바로가기',
      clickHandler: redirectUser
    }
  ]

  return (
    <div className="buttonBox">
      {buttonsList.map((btn, idx) => (
        <button key={idx} onClick={btn.clickHandler}>
          <img src={btn.imgUrl} alt={btn.imgAlt} />
        </button>
      ))}
    </div>
  )
}
