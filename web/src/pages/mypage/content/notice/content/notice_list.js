import React, {useContext} from 'react'
import {PHOTO_SERVER} from 'context/config'

import NoResult from 'components/ui/new_noResult'
import Utility from 'components/lib/utility'
import {useParams, useHistory} from 'react-router-dom'

const NoticeList = (props) => {
  const history = useHistory()
  const {memNo} = useParams()
  const {noticeList} = props

  // 최신글 체크
  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)

  return (
    <>
      {noticeList !== null && noticeList.length === 0 ? (
        <NoResult type="default" text="방송공지가 없습니다." />
      ) : (
        <>
          <div className="noticeListWrap">
            <div className="noticeListTop">
              <div className="noticeList bookmark">
                {noticeList !== null &&
                  noticeList.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {item.isTop === true && (
                          <div
                            className="noticeItme"
                            key={index}
                            onClick={() => {
                              history.push(`/mypage/${memNo}/notice/isDetail?idx=${item.noticeIdx}`)
                            }}>
                            {item.imagePath ? <img src={`${PHOTO_SERVER}${item.imagePath}`} className="noticeItme__img" /> : ''}
                            <div className="noticeItme__textWrap">
                              <strong className="noticeItme__title">{item.title}</strong>
                              <span className="noticeItme__reply">
                                답글<span className="cnt">{item.replyCnt}</span>
                              </span>
                              <span className="noticeItme__date">{Utility.timeFormat(item.writeDt)}</span>
                            </div>
                            {(IntTime - item.writeTs) / 3600 < 7 && <i className="noticeItme__moreIcon">새글</i>}
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
              </div>
            </div>
          </div>

          <div className="noticeLBottom">
            <div className="noticeList">
              {noticeList !== null &&
                noticeList.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item.isTop === false && (
                        <div
                          className="noticeItme"
                          key={index}
                          onClick={() => {
                            history.push(`/mypage/${memNo}/notice/isDetail?idx=${item.noticeIdx}`)
                          }}>
                          {item.imagePath ? <img src={`${PHOTO_SERVER}${item.imagePath}`} className="noticeItme__img" /> : ''}
                          <div className="noticeItme__textWrap">
                            <strong className="noticeItme__title">{item.title}</strong>
                            <span className="noticeItme__reply">
                              답글<span className="cnt">{item.replyCnt}</span>
                            </span>
                            <span className="noticeItme__date">{Utility.timeFormat(item.writeDt)}</span>
                          </div>
                          {(IntTime - item.writeTs) / 3600 < 7 && <i className="noticeItme__moreIcon">새글</i>}
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default NoticeList
