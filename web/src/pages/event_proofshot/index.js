import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import Layout from 'pages/common/layout'

import {STATUS_TYPE, TAB_TYPE, VIEW_TYPE} from './constant'

import AllList from './content/alllist'
import Mylist from './content/mylist'
import Write from './content/write'

import './static/proofStyle.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const [tab, setTab] = useState(0)
  const [statusObj, setStatusObj] = useState({
    eventCheck: 0,
    pcCheck: 0,
    status: 0
  })
  const [list, setList] = useState([])
  const [myList, setMyList] = useState([])
  const [totalCnt, setTotalCnt] = useState(0)
  const [viewType, setViewType] = useState(0)
  const [scrollToList, setScrollToList] = useState(false)
  const [isAdmin, setIsAdmin] = useState(0)

  const VisualWrapRef = useRef(null)
  const VisibleRef = useRef(null)
  const TabRef = useRef()

  const eventStatusCheck = useCallback(async () => {
    const {result, data} = await API.event_proofshot_status()
    if (result === 'success') setStatusObj(data)

    return data
  }, [])

  const fetchEventProofshotList = useCallback(async () => {
    const {result, data} = await API.event_proofshot_list({
      data: {
        page: 1,
        records: 999999,
        slct_type: tab
      }
    })

    if (result === 'success') {
      if (tab === TAB_TYPE.ALL) setList(data.list)
      else setMyList(data.list)
      setTotalCnt(data.totCnt)

      setIsAdmin(data.isAdmin)
    }
  }, [tab, viewType])
  useEffect(() => {
    fetchEventProofshotList()
  }, [tab])

  useEffect(() => {
    if (scrollToList === true) {
      TabRef.current.scrollIntoView({behavior: 'smooth'})
      setScrollToList(false)
    }
  }, [scrollToList])

  useEffect(() => {
    eventStatusCheck()

    const scrollEv = () => {
      if (VisualWrapRef.current) {
        if (window.scrollY >= VisualWrapRef.current.offsetHeight + 40) {
          if (TabRef.current.classList.length !== 2) {
            TabRef.current.className = 'tabWrap fixed'
            VisibleRef.current.className = 'visible'
          }
        } else {
          TabRef.current.className = 'tabWrap'
          VisibleRef.current.className = 'hidden'
        }
      }
    }

    document.addEventListener('scroll', scrollEv)
    return () => {
      document.removeEventListener('scroll', scrollEv)
    }
  }, [])

  async function handleStatus(check) {
    if (check === 'check' && !globalState.token.isLogin) {
      history.push('/login')
      return
    }

    const {eventCheck, status, pcCheck} = await eventStatusCheck()

    if (pcCheck === STATUS_TYPE.IMPOSSIBLE) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: 'PC로 10분 이상 방송을\n진행 후 참여해주세요.',
      }))
      return
    }

    if (eventCheck === STATUS_TYPE.POSSIBLE && status === STATUS_TYPE.POSSIBLE && pcCheck === STATUS_TYPE.POSSIBLE) {
      setViewType(VIEW_TYPE.WRITE)
    }
  }

  return (
    <Layout status="no_gnb">
      <div id="proofShot">
        {(viewType === VIEW_TYPE.WRITE || viewType === VIEW_TYPE.MODIFY) && (
          <Write
            setViewType={setViewType}
            viewType={viewType}
            item={myList}
            setScrollToList={setScrollToList}
            fetchEventProofshotList={fetchEventProofshotList}
            eventStatusCheck={eventStatusCheck}
          />
        )}
        {viewType === VIEW_TYPE.MAIN && (
          <>
            <div className="title">
              <h2>PC 방송 인증샷 이벤트</h2>
              <button
                onClick={() => {
                  history.push('/')
                }}>
                닫기
              </button>
            </div>
            <div className="visualWrap" ref={VisualWrapRef}>
              <div className="dayTextwrap">
                <div className="day">
                  <span>참여기간: 2020.8.31 ~ 9.13</span>
                </div>
                <img src="https://image.dalbitlive.com/event/proofshot/20200226/content01.jpg" alt="pc 방송 인증샷 이벤트" />
              </div>

              <div className="visualWrap__ButtonWrap">
                <img
                  src="https://image.dalbitlive.com/event/proofshot/20200226/new_visualcontent.jpg"
                  alt="이벤트 참여 기간에 pc로 10분 이상 방송하고 인증샷만 찍어서 선물 받아가자!"
                />

                <button
                  className="visualWrap__ButtonWrap--giftButton"
                  onClick={() => {
                    dispatch(setGlobalCtxUpdatePopup({popup: ['PROOF_SHOT']}));
                  }}></button>

                {statusObj.status === STATUS_TYPE.IMPOSSIBLE ? (
                  <div className="visualWrap__ButtonWrap--writeButton">
                    <img src="https://image.dalbitlive.com//event/proofshot/20200226/0228_button_off.png" alt="참여완료" />
                  </div>
                ) : (
                  <button
                    className="visualWrap__ButtonWrap--writeButton"
                    onClick={() => {
                      handleStatus('check')
                    }}>
                    <img src="https://image.dalbitlive.com//event/proofshot/20200226/0228_button_on.png" alt="참여하기" />
                  </button>
                )}
              </div>
            </div>
            <div className="tabWrap" ref={TabRef}>
              <div className="tabWrap__button">
                <button
                  className={`${tab === TAB_TYPE.ALL && 'active'} `}
                  onClick={() => {
                    setTab(TAB_TYPE.ALL)
                  }}>
                  전체
                </button>
                {statusObj.status === STATUS_TYPE.IMPOSSIBLE && globalState.token.isLogin && (
                  <button
                    className={`${tab === TAB_TYPE.MINE && 'active'} `}
                    onClick={() => {
                      setTab(TAB_TYPE.MINE)
                    }}>
                    나의 인증샷
                  </button>
                )}
              </div>
              {tab === TAB_TYPE.ALL && (
                <div className="tabWrap__listNumber">
                  게시글 <p>{totalCnt}</p>
                </div>
              )}
            </div>
            <div className="hidden" ref={VisibleRef}></div>
            {tab === TAB_TYPE.ALL && (
              <AllList
                list={list}
                isAdmin={isAdmin}
                eventStatusCheck={eventStatusCheck}
                fetchEventProofshotList={fetchEventProofshotList}
              />
            )}
            {tab === TAB_TYPE.MINE && myList.length > 0 && (
              <Mylist
                item={myList[0]}
                setTab={setTab}
                setViewType={setViewType}
                eventStatusCheck={eventStatusCheck}
                isAdmin={isAdmin}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
