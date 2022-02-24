import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import './index.scss'

export default function noticeTab() {
  const context = useContext(Context)
  const history = useHistory()

  const {token, profile} = context
  const [alarmActive, setAlarmActive] = useState(false)
  const [noticeActive, setNoticeActive] = useState(false)
  const [personalActive, setPersonalActive] = useState(false)
  const [alarmCount, setAlarmCount] = useState(false)
  const [noticeCount, setNoticeCount] = useState(false)
  const [personalCount, setPersonalCount] = useState(false)
  const urlStr = history.location.pathname.split('/')[2]

  const goLink = (type) => {
    if (type === 'alarm') {
      history.push('/menu/alarm')
    } else if (type === 'notice') {
      history.push('/oldnotice')
    } else if (type === 'personal') {
      if (personalCount > 0) {
        history.push('/customer/qnaList')
      } else {
        history.push('/customer/personal')
      }
    }
  }
  useEffect(() => {
    async function fetchData() {
      const {result, data, message} = await Api.getMyPageNew(profile.memNo)
      if (result === 'success') {
        if (data) {
          setAlarmCount(data.alarm)
          setNoticeCount(data.notice)
          setPersonalCount(data.qna)
        }
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
    if (profile && profile.memNo !== null) fetchData()

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
          알림{alarmCount > 0 && <span className="cnt">{alarmCount}</span>}
        </button>
      </li>
      <li className={`subTabList__item ${noticeActive ? `subTabList__item--active` : ``}`}>
        <button className="subTabList__link" onClick={() => goLink('notice')}>
          공지사항{noticeCount > 0 && <span className="cnt">{noticeCount}</span>}
        </button>
      </li>
      <li className={`subTabList__item ${personalActive ? `subTabList__item--active` : ``}`}>
        <button className="subTabList__link" onClick={() => goLink('personal')}>
          1:1문의{personalCount > 0 && <span className="cnt">{personalCount}</span>}
        </button>
      </li>
    </ul>
  )
}
