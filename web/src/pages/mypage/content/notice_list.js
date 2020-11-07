import React, {useContext} from 'react'

import {Context} from 'context'

//date format
import Utility, {dateFormatterKor} from 'components/lib/utility'

const NoticeList = (props) => {
  const {noticeList, detailIdx, setMoreToggle, setDetailIdx, setIsList, memNo} = props
  const globalCtx = useContext(Context)
  return (
    <ul className="noticeList">
      {noticeList !== null &&
        noticeList.map((item, index) => (
          <li key={index} className="noticeItem">
            <div
              onClick={() => {
                setIsList(false)
                if (item.noticeIdx === detailIdx) {
                  setDetailIdx(0)
                } else {
                  setDetailIdx(item.noticeIdx)
                }
              }}
              className={item.noticeIdx === detailIdx ? 'noticeItem__Info noticeItem__Info--active' : 'noticeItem__Info'}>
              {item.isTop === true && <span className="noticeItem__icon">필독</span>}
              <span className={item.isTop === true ? 'noticeItem__title noticeItem__title--active' : 'noticeItem__title'}>
                {item.title}
              </span>
              <span className="noticeItem__date">{Utility.dateFormatter(item.writeDt)}</span>
            </div>
          </li>
        ))}
    </ul>
  )
}

export default NoticeList
