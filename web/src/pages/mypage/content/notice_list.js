import React, {useContext} from 'react'
import {PHOTO_SERVER} from 'context/config'
import {Context} from 'context'

//date format
import Utility from 'components/lib/utility'

const NoticeList = (props) => {
  const {noticeList, detailIdx, setDetailIdx, setIsList, setIsDetail} = props
  const globalCtx = useContext(Context)

  // 최신글 체크
  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)

  return (
    <>
      <div className="noticeList bookmark">
        {noticeList !== null &&
          noticeList.map((item, index) => {
            return (
              <div key={index}>
                {item.isTop === true && (
                  <div
                    className="noticeItme"
                    key={index}
                    onClick={() => {
                      setIsDetail(true)
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
                  </div>
                )}
              </div>
            )
          })}
      </div>
      <div className="noticeList">
        {noticeList !== null &&
          noticeList.map((item, index) => {
            return (
              <div key={index}>
                {item.isTop === false && (
                  <div
                    className="noticeItme"
                    key={index}
                    onClick={() => {
                      setIsDetail(true)
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
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </>
  )
}

export default NoticeList
