import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
import NoResult from 'components/ui/new_noResult'

export default function eventList() {
  const history = useHistory()
  const context = useContext(Context)
  const [eventList, setEventList] = useState([])

  const countIngAlert = () => {
    if (!context.token.isLogin) {
      history.push('/login?redirect=/customer/event')
    } else {
      return context.action.alert({
        msg: '당첨자 집계 중입니다. <br/>조금만 기다려주세요.'
      })
    }
  }

  const announcePage = (eventIdx, title, announcementDate) => {
    if (!context.token.isLogin) {
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
      // console.log(data);
      // const 변수 범위 잘 보고 사용
      if (result === 'success') {
        setEventList(data)
        // setEventList사용해서 eventList의 데이터를 셋팅해야함
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
    fetchData()
    // 위에서 설정한 fetchData 선언하면서 data fetch해줌
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
              announcementDate
            } = item
            return (
              <li key={`board-${idx}`} className="event-item">
                {state === 1 && prizeWinner === 0 && (
                  <>
                    <div className="banner" onClick={() => listImgClick(mobileLinkUrl)}>
                      <img src={listImageUrl} />
                    </div>
                    <div className="textWrap">
                      <p className="title">{title}</p>
                      <span className="date">
                        {alwaysYn === 1 && <>상시</>}
                        {alwaysYn === 0 && (
                          <>
                            {dateFormat(startDate)}~{dateFormat(endDate)}
                          </>
                        )}
                      </span>
                    </div>
                  </>
                )}
                {state === 2 && (
                  <>
                    <div className="banner" onClick={() => listImgClick(mobileLinkUrl)}>
                      <img src={listImageUrl} />
                      <div className="endEvent-text">종료된 이벤트</div>
                    </div>
                    <div className="textWrap endEvent">
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
                      {(prizeWinner === 0 || winnerOpen === 0) && (
                        <button className="countIngBox" onClick={() => countIngAlert()}>
                          <span className="countIngBox-text">집계 중</span>
                        </button>
                      )}
                      {prizeWinner === 1 && winnerOpen === 1 && (
                        <button className="announceBox" onClick={() => announcePage(eventIdx, title, announcementDate)}>
                          <span className="announceBox-text">당첨자 발표</span>
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
        <NoResult text="이벤트 내역이 없습니다." />
      )}
    </div>
  )
}
