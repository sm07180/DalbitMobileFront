import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import {KnowHowContext} from '../store'

import {CONDITION_TYPE, ORDER_TYPE, TAB_TYPE} from '../constant'

import AttendList from './attend_list'
import {useDispatch, useSelector} from "react-redux";

const MainTab = [
  {text: '이벤트 홈', value: TAB_TYPE.HOME},
  {text: '참여하기', value: TAB_TYPE.ATTEND}
]

const Conditions = [
  {text: '전체', value: CONDITION_TYPE.ALL},
  {text: 'PC', value: CONDITION_TYPE.PC},
  {text: '모바일', value: CONDITION_TYPE.MOBILE}
]

function Attend() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)

  const {condition, order, list, tab, mine, myCnt} = KnowHowState

  const setCondition = KnowHowAction.setCondition
  const setOrder = KnowHowAction.setOrder
  const setTab = KnowHowAction.setTab
  const setMine = KnowHowAction.setMine
  const setList = KnowHowAction.setList
  const {token} = globalState

  const MainTabRef = useRef(null)
  const TabRef = useRef(null)
  const ListRef = useRef(null)
  const HomeRef = useRef(null)
  const history = useHistory()

  const [refresh, setRefresh] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchData = async () => {
    const res = await Api.knowhow_list({
      page: 1,
      records: 10000,
      slct_type: mine,
      slct_platform: condition,
      slct_order: order
    })

    if (res.result === 'success') {
      setList(res.data.list)
      scrollTo(0, 0)
    }
  }

  const MakeConditionButtonWrap = useCallback(() => {
    return Conditions.map((v, idx) => {
      return (
        <button
          key={idx}
          className={`${v.value === condition && 'active'}`}
          onClick={() => {
            setCondition(v.value)
            window.scrollTo(0, 0)
          }}>
          {v.text}
        </button>
      )
    })
  }, [condition])

  const MakeMainTabWrap = useCallback(() => {
    return MainTab.map((v, idx) => {
      return (
        <button key={idx} className={`${tab === v.value && 'active'}`} onClick={() => setTab(v.value)}>
          {v.text}
        </button>
      )
    })
  }, [tab])

  useEffect(() => {
    window.scrollTo(0, 0)
    const scrollEv = () => {
      if (tab === TAB_TYPE.ATTEND) {
        if (TabRef.current) {
          if (window.scrollY >= 40) {
            if (TabRef.current.classList.length !== 2) {
              TabRef.current.className = 'tabWrap fixed'
              MainTabRef.current.className = 'mainTabWrap fixed'
              ListRef.current.style.marginTop = '141px'
            }
          } else {
            TabRef.current.className = 'tabWrap'
            MainTabRef.current.className = 'mainTabWrap'
            ListRef.current.style.marginTop = ''
          }
        }
      }

      if (tab === TAB_TYPE.HOME) {
        if (HomeRef.current) {
          if (window.scrollY >= 40) {
            if (MainTabRef.current.classList.length !== 2) {
              MainTabRef.current.className = 'mainTabWrap fixed'
              HomeRef.current.style.marginTop = '40px'
            }
          } else {
            MainTabRef.current.className = 'mainTabWrap'
            HomeRef.current.style.marginTop = ''
          }
        }
      }
    }
    document.addEventListener('scroll', scrollEv)
    return () => {
      document.removeEventListener('scroll', scrollEv)
    }
  }, [tab])

  return (
    <>
      <div className="title">
        <h2>방송 노하우 이벤트</h2>
        <button
          onClick={() => {
            history.push('/')
          }}>
          닫기
        </button>
      </div>
      <div ref={MainTabRef} className="mainTabWrap">
        {MakeMainTabWrap()}
      </div>
      {tab === TAB_TYPE.HOME && (
        <div ref={HomeRef} className="home">
          <div className="home__top">
            <img src="https://image.dalbitlive.com/event/knowhow/20200902/img_event_top.png" />
            <div>
              <span>참여기간 : 9/17~9/27</span>
            </div>
          </div>
          <div className="home__bottom">
            <img src="https://image.dalbitlive.com/event/knowhow/20200902/img_event_bottom.png" />
            <div className="home__bottom--button">
              <button
                onClick={() => {
                  setTab(TAB_TYPE.ATTEND)
                }}>
                이벤트 참여하기
              </button>
            </div>
            <div
              className={'home__bottom--contentsWrap'}
              onClick={() => {
                setIsOpen(!isOpen)
              }}>
              {isOpen === false ? (
                <span className="open">이벤트 유의사항 확인하기</span>
              ) : (
                <span className="close">이벤트 유의사항 닫기</span>
              )}
            </div>
            {isOpen === true && (
              <div className="home__bottom--contents">
                <p className="title">선물 지급 안내</p>
                <p>
                  <span>· </span> 대상자에게는 이벤트 종료 후 9월 28일 공지와 함께 일괄 지급합니다.
                </p>
                <p>
                  <span>· </span> 운영진 회의를 통해 1~3위를 선정합니다.
                  <br />
                  단, 적합한 대상자가 없다고 판단될 경우
                  <br />
                  선정자를 발표하지않을 수 있습니다.
                </p>
                <p className="title">유의사항 안내</p>
                <p>
                  <span>· </span> 이벤트 취지와 어울리지 않는 내용 혹은 운영 정책에 위배된 이미지 또는 글이 확인되는 경우 무 통보
                  삭제 및 제재 조치를 할 수 있습니다. (예시: 타인 사진 도용, 음란성, 혐오감조성, 비속어 등)
                </p>
                <p>
                  <span>·</span> 참여한 이벤트 내용은 사전 고지 없이 서비스 마케팅으로 활용될 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === TAB_TYPE.ATTEND && (
        <div className="attendWrap">
          <div ref={TabRef} className="tabWrap">
            <div className="attendWrap__buttonWrap">
              <span className="attendWrap__buttonWrap--conditions">{MakeConditionButtonWrap()}</span>
              <span className="attendWrap__buttonWrap--other">
                {token.isLogin && myCnt > 0 && (
                  <button
                    className={`attendWrap__buttonWrap--my ${mine === 1 && 'active'}`}
                    onClick={() => {
                      if (mine === 0) {
                        setMine(1)
                      } else {
                        setMine(0)
                      }
                    }}>
                    내 글
                  </button>
                )}
                <button className="attendWrap__buttonWrap--add" onClick={() => history.push('/event_knowHow/add')}>
                  <span>등록</span>
                </button>
              </span>
            </div>
            <div className="attendWrap__header">
              <span className="attendWrap__header__countWrap">
                <span>게시글</span>
                <span className="attendWrap__header__countWrap--count">{list.length}</span>
                <button
                  className={`${refresh && 'active'}`}
                  onClick={async () => {
                    setRefresh(true)
                    await fetchData()
                    setTimeout(() => {
                      setRefresh(false)
                    }, 1000)
                  }}>
                  <img src="https://image.dalbitlive.com/main/200714/ico-refresh.svg" alt="새로고침" />
                </button>
              </span>
              <span className="attendWrap__header__sortWrap">
                <span
                  className={`${order === ORDER_TYPE.LATELY && 'active'}`}
                  onClick={() => {
                    setOrder(ORDER_TYPE.LATELY)
                    window.scrollTo(0, 0)
                  }}>
                  최근 등록 순
                </span>
                <span className="tit"></span>
                <span
                  className={`${order === ORDER_TYPE.RECOMMEND && 'active'}`}
                  onClick={() => {
                    setOrder(ORDER_TYPE.RECOMMEND)
                    window.scrollTo(0, 0)
                  }}>
                  추천 순
                </span>
              </span>
            </div>
          </div>
          <div ref={ListRef}>
            <AttendList />
          </div>
        </div>
      )}
    </>
  )
}

export default React.memo(Attend)
