import React, {useContext, useEffect, useRef, useState} from 'react'
import API from 'context/api'
import {AttendContext} from '../attend_ctx'
import {IMG_SERVER} from 'context/config'
import {useHistory, useParams} from 'react-router-dom'

// component
import AttendPage from './attend'
import RoulettePage from './roulette'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'

import Header from 'components/ui/header/Header'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
import {useDispatch} from "react-redux";

export default () => {
  const history = useHistory()
  const params = useParams()

  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {tab} = eventAttendState
  const {webview, type} = qs.parse(location.search)
  const dispatch = useDispatch();
  const commonTopRef = useRef()
  const tabRef = useRef()

  const [tabFixed, setTabFixed] = useState(false)

  async function fetchIosJudge() {
    const {result, data} = await API.getIosJudge()
    if (result === 'success') {
      eventAttendAction.setIos(data.iosJudgeYn)
    }
  }

  const backButton = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }

  const windowScrollEvent = () => {
    let scroll = window.scrollY || window.pageYOffset

    if (scroll >= commonTopRef.current.clientHeight) {
      setTabFixed(true)
    } else {
      setTabFixed(false)
    }
  }
  //-------------------
  useEffect(() => {
    // if (type === 'roulette') {
    //   eventAttendAction.setTab('roulette')
    // } else {
    //   eventAttendAction.setTab('attend')
    // }

    if (params.type === 'roulette') {
      eventAttendAction.setTab('roulette')
    } else if (params.type === 'attend') {
      eventAttendAction.setTab('attend')
    }

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])

  useEffect(() => {
    fetchIosJudge()
  }, [])

  return (
    <div id="attendEventPage">
      <Header title='???????????? ?????????' type='back' backEvent={backButton}/>
      <div className="commonTopWrap" ref={commonTopRef}>
        {eventAttendState.ios === 'Y' ? '' : <img src={`${IMG_SERVER}/event/attend/201019/event_img_top-1.png`} />}
      </div>

      <div className={`tabWrap ${tabFixed ? 'fixed' : ''} ${tab === 'attend' ? 'attend' : 'roulette'}`} ref={tabRef}>
        <button
          type="button"
          onClick={() => eventAttendAction.setTab('attend')}
          className={`btnAttend ${tab === 'attend' ? 'active' : ''}`}>
          <img src={`${IMG_SERVER}/event/attend/201019/tab_text_01@2x.png`} alt="?????? ?????????" />
        </button>

        {eventAttendState.ios === 'Y' ? (
          ''
        ) : (
          <button
            type="button"
            onClick={()=>{
              dispatch(setGlobalCtxMessage({
                type: "alert",
                msg: ` ????????? ????????? 31 ???????????? ?????? ?????? ???????????? ?????????????????? ?????????????????? 31??? ???????????????.`,
                callback: () => {
                  history.push(`/event/keyboardhero`)
                }
              }));
            }}
            //todo: 6??? 12???
            // onClick={() => eventAttendAction.setTab('roulette')}
            className={`btnRoul ${tab === 'roulette' ? 'active' : ''}`}>
            <img src={`${IMG_SERVER}/event/attend/201019/tab_text_02@2x.png`} alt="?????? ?????????" />
          </button>
        )}
      </div>
      {/*todo: 6??? 12???*/}
      {/*<div className={`tabContent ${tabFixed ? 'isTop' : ''}`}>{tab === 'attend' ? <AttendPage /> : <RoulettePage />}</div>*/}
      <div className={`tabContent ${tabFixed ? 'isTop' : ''}`}> <AttendPage /></div>
    </div>
  )
}
