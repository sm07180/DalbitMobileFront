import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'

import PresentPop from './pop_present'
import LayerPopupExp from './layer_popup_exp'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function anniversaryEventPresnet(props) {
  const {noticeData} = props
  const [presentPop, setPresentPop] = useState(false)
  const [popupExp, setPopupExp] = useState(false)
  const [rcvDalCnt, setRcvDalCnt] = useState(0)
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState
  const history = useHistory()

  async function eventOneYearCheck() {
    const {result, message, code} = await Api.postEventOneYearCheck({memLevel: globalState.profile.level})
    if (result === 'success') {
      eventOneYearInsert()
    } else {
      if (code === '-3') {
        dispatch(setGlobalCtxMessage({type:"alert",
          msg: message,
          callback: () => {
            history.push('/selfauth?event=/event/anniversary')
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({type:"alert",
          msg: message
        }))
      }
    }
  }
  async function eventOneYearInsert() {
    const {result, message, data} = await Api.postEventOneYearInsert()
    if (result === 'success') {
      setPresentPop(true)
      console.log(data.rcvDalCnt)
      setRcvDalCnt(data.rcvDalCnt)
    } else {
      console.log(message)
    }
  }
  const onReceivePresent = () => {
    if (!token.isLogin) {
      dispatch(setGlobalCtxMessage({type:"alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/anniversary'
            }
          })
        }
      }))
    } else {
      eventOneYearCheck()
    }
  }

  return (
    <>
      <div className="tabContentWrap">
        <img src={`${IMG_SERVER}/event/anniversary/present.png`} className="contentImg" />
        <button className="button_present">
          <img
            src={`${IMG_SERVER}/event/anniversary/btn_present.png`}
            className="button_img"
            onClick={() => onReceivePresent()}
          />
        </button>
        <button className="button_level" onClick={() => setPopupExp(true)}>
          레벨 올리는 방법 알아보기
        </button>
      </div>
      <div className="notice">
        <div className="notice_title">
          <span className="alert">!</span>이벤트 유의사항
        </div>
        <div dangerouslySetInnerHTML={{__html: noticeData}}></div>
      </div>
      {presentPop && <PresentPop setPresentPop={setPresentPop} rcvDalCnt={rcvDalCnt} />}
      {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
    </>
  )
}
