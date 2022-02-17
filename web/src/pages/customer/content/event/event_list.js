import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function EventList() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const [eventList, setEventList] = useState([])

  const countIngAlert = () => {
    if (!globalState.token.isLogin) {
      history.push('/login?redirect=/customer/event')
    } else {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '당첨자 집계 중입니다. <br/>조금만 기다려주세요.'
      }))
    }
  }

  const announcePage = (eventIdx, title, announcementDate) => {
    if (!globalState.token.isLogin) {
      history.push('/login?redirect=/customer/event')
    } else {
      history.push({
        pathname: `/customer/event/${eventIdx}`,
        state: {
          title: title,
          announcementDate: announcementDate
        }
      })
    }
  }

  const listImgClick = (mobileLinkUrl) => {
    history.push(mobileLinkUrl)
  }

  function dateFormat(num) {
    if (!num) return ''
    var formatNum = ''
    num = num.replace(/\-/gi, '')
    num = num.substr(0, 8)
    try {
      if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
      }
    } catch (e) {
      formatNum = num
    }
    return formatNum
  }

  useEffect(() => {
    const fetchData = async () => {
      const {result, data, message} = await Api.getEventList({})
      if (result === 'success') {
        setEventList(data)
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id="eventList">
      {eventList && eventList.length > 0 ? (
        <ul className="event-list">
          {eventList.map((item, idx) => {
            if (!item) return null
            const {
              eventIdx,
              state,
              title,
              alwaysYn,
              startDate,
              endDate,
              listImageUrl,
              pcLinkUrl,
              mobileLinkUrl,
              prizeWinner,
              winnerOpen,
              announcementDate,
              viewYn
            } = item
            return (
                <li key={`board-${idx}`} className="event-item">
                  {state === 1 && viewYn === 1 && (
                      <>
                        <div className="banner" onClick={() => listImgClick(mobileLinkUrl)}>
                          <img src={listImageUrl}/>
                        </div>
                        {alwaysYn === 0 &&
                        /* 진행 중, 상시X */
                        <div className="textWrap">
                          <p className="title">{title}</p>
                          <span className="date">{dateFormat(startDate)}~{dateFormat(endDate)}</span>
                        </div>
                        }
                        {alwaysYn === 1 && (prizeWinner === 0 || winnerOpen === 0) &&
                        /* 진행 중, 상시O, 당첨자 발표X */
                        <div className="textWrap">
                          <p className="title">{title}</p>
                          <span className="date">상시</span>
                        </div>
                        }
                        {alwaysYn === 1 && prizeWinner === 1 && winnerOpen === 1 &&
                        /* 진행 중, 상시O, 당첨자 발표O */
                        <div className="textWrap">
                          <div className="desc">
                            <p className="title">{title}</p>
                            <span className="date">상시</span>
                          </div>
                          <button
                              className="btn__announce btn__announce--isActive"
                              onClick={() => announcePage(eventIdx, title, announcementDate)}>
                            당첨자 발표
                          </button>
                        </div>
                        }
                      </>
                  )}

                  {state === 2 && viewYn === 1 && (
                      <>
                        <div className="banner" onClick={() => listImgClick(mobileLinkUrl)}>
                          <img src={listImageUrl}/>
                          <div className="endEvent-text">종료된 이벤트</div>
                        </div>
                        <div className="textWrap">
                          <div className="desc">
                            <p className="title">{title}</p>
                            <span className="date">
                          {alwaysYn === 0 && (
                              <>
                                {dateFormat(startDate)}~{dateFormat(endDate)}
                              </>
                          )}
                        </span>
                          </div>
                          {/* 종료, 당첨자 발표X */}
                          {(prizeWinner === 0 || winnerOpen === 0) && (
                              <button className="btn__announce" onClick={() => countIngAlert()}>
                                집계 중
                              </button>
                          )}
                          {/* 종료, 당첨자 발표O */}
                          {prizeWinner === 1 && winnerOpen === 1 && (
                              <button
                                  className="btn__announce btn__announce--isActive"
                                  onClick={() => announcePage(eventIdx, title, announcementDate)}>
                                당첨자 발표
                              </button>
                          )}
                        </div>
                      </>
                  )}
                </li>
            )
          })}
        </ul>
      ) : (
          <NoResult text="이벤트 내역이 없습니다."/>
      )}
    </div>
  )
}
