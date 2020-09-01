import React, {useState, useCallback, useEffect, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'

import {KnowHowContext} from '../store'

import {CONDITION_TYPE, ORDER_TYPE, TAB_TYPE} from '../constant'

import AttendList from './attend_list'

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
  const context = useContext(Context)
  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)

  const {condition, order, list, tab} = KnowHowState

  const setCondition = KnowHowAction.setCondition
  const setOrder = KnowHowAction.setOrder
  const setTab = KnowHowAction.setTab

  const {token} = context

  const TabRef = useRef(null)
  const ListRef = useRef(null)

  const history = useHistory()

  const MakeConditionButtonWrap = useCallback(() => {
    return Conditions.map((v, idx) => {
      return (
        <button
          key={idx}
          className={`${v.value === condition && 'active'}`}
          onClick={() => {
            setCondition(v.value)
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
    const scrollEv = () => {
      if (TabRef.current) {
        if (window.scrollY >= 77) {
          if (TabRef.current.classList.length !== 2) {
            TabRef.current.className = 'tabWrap fixed'
            ListRef.current.style.marginTop = '101px'
          }
        } else {
          TabRef.current.className = 'tabWrap'
          ListRef.current.style.marginTop = ''
        }
      }
    }
    document.addEventListener('scroll', scrollEv)
    return () => {
      document.removeEventListener('scroll', scrollEv)
    }
  }, [])

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
      <div className="mainTabWrap">{MakeMainTabWrap()}</div>
      {tab === TAB_TYPE.HOME && (
        <div className="HOME">
          <img />
          <h1>이벤트 홈 이미지</h1>
        </div>
      )}

      {tab === TAB_TYPE.ATTEND && (
        <div className="attendWrap">
          <div ref={TabRef} className="tabWrap">
            <div className="attendWrap__buttonWrap">
              <span className="attendWrap__buttonWrap--conditions">{MakeConditionButtonWrap()}</span>
              <span className="attendWrap__buttonWrap--other">
                {token.isLogin && <button className="attendWrap__buttonWrap--my">내 글</button>}
                <button className="attendWrap__buttonWrap--add" onClick={() => history.push('/event_knowHow/add')}>
                  <span>등록</span>
                </button>
              </span>
            </div>
            <div className="attendWrap__header">
              <span className="attendWrap__header__countWrap">
                <span>게시글</span>
                <span className="attendWrap__header__countWrap--count">{list.length}</span>
              </span>
              <span className="attendWrap__header__sortWrap">
                <span
                  className={`${order === ORDER_TYPE.LATELY && 'active'}`}
                  onClick={() => {
                    setOrder(ORDER_TYPE.LATELY)
                  }}>
                  최근 등록 순
                </span>
                <span className="tit"></span>
                <span
                  className={`${order === ORDER_TYPE.RECOMMEND && 'active'}`}
                  onClick={() => {
                    setOrder(ORDER_TYPE.RECOMMEND)
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
