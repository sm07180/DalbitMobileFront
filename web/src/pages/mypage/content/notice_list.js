import React, {useContext, useMemo} from 'react'
import {PHOTO_SERVER} from 'context/config'
import {Context} from 'context'

import styled from 'styled-components'

//date format
import Utility from 'components/lib/utility'

const NoticeList = (props) => {
  const {noticeList, detailIdx, setMoreToggle, setDetailIdx, setIsList, memNo, setIsDetaile, isDetaile} = props
  const globalCtx = useContext(Context)
  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)

  return (
    <>
      <ul className="noticeList bookmark">
        {noticeList !== null &&
          noticeList.map((item, index) => {
            return (
              <>
                {item.isTop === true && (
                  <li
                    className="noticeItme"
                    key={index}
                    onClick={() => {
                      setIsDetaile(true)
                      setIsList(false)
                      if (item.noticeIdx === detailIdx) {
                        setDetailIdx(0)
                      } else {
                        setDetailIdx(item.noticeIdx)
                      }
                    }}>
                    {item.imagePath ? <img src={`${PHOTO_SERVER}${item.imagePath}`} className="noticeItme__img" /> : ''}
                    <div className="noticeItme__textWrap">
                      <strong className="noticeItme__title">{item.title}</strong>
                      <p className="noticeItme__date">{Utility.timeFormat(item.writeDt)}</p>
                    </div>
                    {(IntTime - item.writeTs) / 3600 < 7 && <i className="noticeItme__moreIcon">새글</i>}
                  </li>
                )}
              </>
            )
          })}
      </ul>
      <ul className="noticeList">
        {noticeList !== null &&
          noticeList.map((item, index) => {
            return (
              <>
                {item.isTop === false && (
                  <li
                    className="noticeItme"
                    key={index}
                    onClick={() => {
                      setIsDetaile(true)
                      setIsList(false)
                      if (item.noticeIdx === detailIdx) {
                        setDetailIdx(0)
                      } else {
                        setDetailIdx(item.noticeIdx)
                      }
                    }}>
                    {item.imagePath ? <img src={`${PHOTO_SERVER}${item.imagePath}`} className="noticeItme__img" /> : ''}
                    <div className="noticeItme__textWrap">
                      <strong className="noticeItme__title">{item.title}</strong>
                      <p className="noticeItme__date">{Utility.timeFormat(item.writeDt)}</p>
                    </div>
                    {(IntTime - item.writeTs) / 3600 < 7 && <i className="noticeItme__moreIcon">새글</i>}
                  </li>
                )}
              </>
            )
          })}
      </ul>
    </>
  )
}

export default NoticeList
