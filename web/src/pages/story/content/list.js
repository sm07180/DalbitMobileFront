import React from 'react'
import {useHistory} from 'react-router-dom'
import MailIcon from '../static/ic_mail_w.svg'
import Utility from 'components/lib/utility'
export default (props) => {
  const {storyList} = props
  const history = useHistory()

  return (
    <>
      {storyList.map((data, idx) => {
        const {roomNo, bgImg, title, storyCnt, startDt} = data

        return (
          <div key={`story-${idx}`} className="story-wrap" onClick={() => history.push(`/story/${roomNo}`)}>
            <img src={bgImg['thumb336x336']} className="thumb" alt={roomNo} />
            <div className="icon-wrap">
              <img src={MailIcon} />
              <span className="text">{storyCnt}</span>
            </div>
            <div className="sub-text-wrap">
              <div className="title">{title}</div>
              <div className="date">{Utility.timeFormat(startDt)}</div>
            </div>
          </div>
        )
      })}
    </>
  )
}
