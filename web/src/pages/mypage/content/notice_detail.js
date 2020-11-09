import React, {useContext, useCallback} from 'react'
import {Context} from 'context'
import Api from 'context/api'
//date format
import Utility from 'components/lib/utility'

const NoticeDetail = (props) => {
  const {noticeList, detailIdx, setMoreToggle, memNo, currentPage, setModifyItem, getNotice, setIsList, setIsDetaile} = props
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
              <div key={index} className="noticeDetail">
                <h2 className="noticeDetail__title">
                  {item.title}
                  <p>{Utility.timeFormat(item.writeDt)}</p>
                </h2>
                <strong className="noticeDetail__profile">
                  <img src={item.profImg['thumb292x292']} />
                  {item.nickNm}
                </strong>
                <div className="noticeDetail__content">{item.contents}</div>

                <div className="noticeDetail__button">
                  <button
                    onClick={() => {
                      setModifyItem({...item})
                      setIsDetaile(false)
                    }}>
                    수정
                  </button>
                  <button onClick={() => deleteNotice(item.noticeIdx)}>삭제</button>
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  )
}

export default NoticeDetail
