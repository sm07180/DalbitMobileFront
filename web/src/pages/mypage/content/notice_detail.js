import React, {useState, useContext, useCallback, useEffect} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'
import Header from 'components/ui/new_header.js'

import Utility from 'components/lib/utility'

const NoticeDetail = (props) => {
  const {noticeList, detailIdx, memNo, currentPage, setModifyItem, getNotice, setIsList, setIsDetail, setDetailIdx} = props
  const globalCtx = useContext(Context)
  const [zoom, setZoom] = useState(false)

  const goBack = () => {
    setIsDetail(false)
    setIsList(true)
    setDetailIdx(0)
  }

  let urlrStr
  if (props.location) {
    urlrStr = props.location.pathname.split('/')[2]
  } else {
    urlrStr = location.pathname.split('/')[2]
  }

  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const res = await Api.mypage_notice_delete({
          data: {
            memNo: globalCtx.profile.memNo,
            noticeIdx: noticeIdx
          }
        })
        if (res.result === 'success') {
          globalCtx.action.alert({
            msg: res.message,
            callback: () => {
              setIsList(true)
            }
          })
          getNotice()
        } else {
          context.action.alert({
            msg: result.message,
            callback: () => {}
          })
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  return (
    <div className={` ${props.type && 'userProfileWrap'}`}>
      {props.type && (
        <Header type="noBack">
          <h2 className="header-title">방송공지</h2>
          <button className="close-btn" onClick={goBack}>
            <img src="https://image.dalbitlive.com/svg/icon_back_gray.svg" alt="뒤로가기" />
          </button>
        </Header>
      )}

      {noticeList !== null &&
        noticeList.map((item, index) => (
          <React.Fragment key={index}>
            {item.noticeIdx === detailIdx && (
              <div key={index} className="noticeDetail">
                <strong className="noticeDetail__title">
                  {item.title}
                  <p>{Utility.timeFormat(item.writeDt)}</p>
                </strong>
                <span className="noticeDetail__profile">
                  <img src={item.profImg['thumb292x292']} />
                  {item.nickNm}
                </span>
                <pre className="noticeDetail__content">
                  {item.contents}

                  {item.imagePath ? (
                    <img
                      src={`${PHOTO_SERVER}${item.imagePath}`}
                      className="noticeDetail__img"
                      onClick={() => setZoom(`${PHOTO_SERVER}${item.imagePath}`)}
                    />
                  ) : (
                    ''
                  )}

                  {zoom && (
                    <div
                      className="zoom"
                      onClick={() => {
                        setZoom(false)
                      }}>
                      <div className="zoomWrap">
                        <img src="https://image.dalbitlive.com/svg/close_w_l.svg" className="closeButton" />
                        <img src={zoom} className="zoomImg" />
                      </div>
                    </div>
                  )}
                </pre>

                {urlrStr === globalCtx.profile.memNo && (
                  <div className="noticeDetail__button">
                    <button
                      onClick={() => {
                        setModifyItem({...item})
                        setIsDetail(false)
                      }}>
                      수정
                    </button>
                    <button onClick={() => deleteNotice(item.noticeIdx)}>삭제</button>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  )
}

export default NoticeDetail
