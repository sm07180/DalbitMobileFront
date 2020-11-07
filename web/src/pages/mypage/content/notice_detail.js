import React, {useContext, useCallback} from 'react'
import {Context} from 'context'
import Api from 'context/api'

const NoticeDetail = (props) => {
  const {noticeList, detailIdx, setMoreToggle, memNo, currentPage, setModifyItem, getNotice, setIsList} = props
  const globalCtx = useContext(Context)

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
              getNotice()
            }
          })
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  return (
    <>
      {noticeList !== null &&
        noticeList.map((item, index) => (
          <div key={index}>
            {item.noticeIdx === detailIdx && (
              <div key={index} className="noticeSubject">
                {memNo === globalCtx.profile.memNo && (
                  <button
                    onClick={() => {
                      setMoreToggle(!moreToggle)
                    }}
                    className="moreBtn"
                  />
                )}
                <div className="moreBox">
                  <button
                    onClick={() => {
                      setModifyItem({...item})
                    }}
                    className="moreBox__list">
                    수정하기
                  </button>
                  <button onClick={() => deleteNotice(item.noticeIdx)} className="moreBox__list">
                    삭제하기
                  </button>
                </div>

                <div className="noticeSubject__content">
                  <span className="noticeSubject__title">{item.title}</span>
                  <pre className="noticeSubject__innerTxt">{item.contents}</pre>
                  {/* <img src={`${PHOTO_SERVER}${item.imagePath}`} /> */}
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  )
}

export default NoticeDetail
