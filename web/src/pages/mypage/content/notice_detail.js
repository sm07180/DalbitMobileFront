import React, {useState, useContext, useCallback, useEffect} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'
import Header from 'components/ui/new_header.js'
import Utility from 'components/lib/utility'
import {useHistory, useParams} from 'react-router-dom'

const NoticeDetail = (props) => {
  const {noticeList, currentPage, getNotice, setModifyItem} = props
  const globalCtx = useContext(Context)
  const [zoom, setZoom] = useState(false)
  let history = useHistory()
  let {memNo, category, addpage} = useParams()
  let yourMemNo
  if (props.location) {
    yourMemNo = props.location.pathname.split('/')[2]
  } else {
    yourMemNo = location.pathname.split('/')[2]
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
          globalCtx.action.confirm({
            msg: `게시글을 삭제 하시겠습니까?`,
            callback: () => {
              getNotice()
              setTimeout(() => {
                history.push(`/mypage/${memNo}/notice`)
              }, 100)
            }
          })
        } else {
          context.action.alert({
            msg: result.message
          })
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  const pramsNum = Number(addpage.substring(9))

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
            {item.noticeIdx === pramsNum && (
              <div key={index} className="noticeDetail">
                <strong className="noticeDetail__title">
                  {item.title}
                  <p>{Utility.timeFormat(item.writeDt)}</p>
                </strong>
                <span className="noticeDetail__profile">
                  <img src={item.profImg['thumb292x292']} />
                  {item.nickNm}
                </span>
                <div className="noticeDetail__content">
                  <pre>{item.contents}</pre>

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
                </div>

                {yourMemNo === globalCtx.profile.memNo && (
                  <div className="noticeDetail__button">
                    <button
                      onClick={() => {
                        history.push(`/mypage/${memNo}/notice/isModify=${item.noticeIdx}`)
                        setModifyItem({...item})
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
