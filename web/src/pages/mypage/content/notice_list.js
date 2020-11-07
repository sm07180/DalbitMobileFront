import React, {useContext} from 'react'

import {Context} from 'context'

//date format
import Utility from 'components/lib/utility'

const NoticeList = (props) => {
  const {noticeList, detailIdx, setMoreToggle, setDetailIdx, setIsList, memNo} = props
  const globalCtx = useContext(Context)
  const IntTime = parseInt(timestamp)

  return (
    <ul className="noticeList">
      {noticeList !== null &&
        noticeList.map((item, index) => (
          <li
            className={`noticeItme ${item.isTop === true && 'bookmark'}`}
            key={index}
            onClick={() => {
              setIsList(false)
              if (item.noticeIdx === detailIdx) {
                setDetailIdx(0)
              } else {
                setDetailIdx(item.noticeIdx)
              }
            }}>
            <img
              src="https://devphoto2.dalbitlive.com/profile_0/20858572800/20201105131409181232.png?700x700"
              className="noticeItme__img"
            />
            <div className="noticeItme__textWrap">
              <strong className="noticeItme__title">{item.title}</strong>
              <p className="noticeItme__date">{Utility.timeFormat(item.writeDt)}</p>
            </div>
            {(IntTime - writeTs) / 3600 < 7 && <i className="noticeItme__moreIcon">필독</i>}
          </li>
        ))}
    </ul>
  )
}

export default NoticeList
