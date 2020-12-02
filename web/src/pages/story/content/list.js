import React from 'react'
import {useHistory} from 'react-router-dom'
import MailIcon from '../static/ic_mail_w.svg'
import Utility from 'components/lib/utility'
import NoResult from 'components/ui/new_noResult'

export default (props) => {
  const {storyList} = props
  const history = useHistory()
  return (
    <>
      {storyList && storyList.length > 0 ? (
        storyList.map((data, idx) => {
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
        })
      ) : (
        <NoResult
          type="default"
          text="방송 중 받은 사연이 없습니다. <br/>
          [방송하기 > 실시간 방송]에서
          청취자에게 사연을 받으면
          해당 사연을 볼 수 있습니다."
        />
      )}
    </>
  )
}
