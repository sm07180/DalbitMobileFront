import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import './index.scss'

export default function noticeTab() {
  const context = useContext(Context)
  const history = useHistory()
  const [alarmActive, setAlarmActive] = useState(false)
  const [noticeActive, setNoticeActive] = useState(false)
  const [personalActive, setPersonalActive] = useState(false)
  const urlStr = history.location.pathname.split('/')[2]

  const goLink = (type) => {
    if (type === 'alarm') {
      history.push('/menu/alarm')
    } else if (type === 'notice') {
      history.push('/customer/notice')
    } else if (type === 'personal') {
      history.push('/customer/personal')
    }
  }
  useEffect(() => {
    if (urlStr === 'alarm') {
      setAlarmActive(true)
    } else if (urlStr === 'notice') {
      setNoticeActive(true)
    } else if (urlStr === 'personal' || urlStr === 'qnaList') {
      setPersonalActive(true)
    }
  }, [])
  return (
    <ul className="subTabList">
      <li className={`subTabList__item ${alarmActive ? `subTabList__item--active` : ``}`}>
        <button className="subTabList__link" onClick={() => goLink('alarm')}>
          알림<span className="cnt">5</span>
        </button>
      </li>
      <li className={`subTabList__item ${noticeActive ? `subTabList__item--active` : ``}`}>
        <button className="subTabList__link" onClick={() => goLink('notice')}>
          공지사항<span className="cnt">45</span>
        </button>
      </li>
      <li className={`subTabList__item ${personalActive ? `subTabList__item--active` : ``}`}>
        <button className="subTabList__link" onClick={() => goLink('personal')}>
          1:1문의<span className="cnt">95</span>
        </button>
      </li>
    </ul>
  )
}
