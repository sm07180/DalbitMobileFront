import React, {useState, useCallback, useEffect, useContext} from 'react'
// import {useParams} from 'react-router-dom'
import Api from 'context/api'
// import {PHOTO_SERVER} from 'constant/define'
// import NoticeInsertCompnent from './insert'
// import NoticeModifyCompnent from './notice_modify'

// import './notice.scss'

// moible
import {Context} from 'context'

export default (props) => {
  // moible 유저 정보
  const {profile} = ctx
  const ctx = useContext(Context)
  const context = useContext(Context)

  // 기본 State
  const [noticeList, setNoticeList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  //Component 호출
  const [isAdd, setIsAdd] = useState(false)
  const [modifyItem, setModifyItem] = useState(null)

  //Not Component 호출
  const [detailIdx, setDetailIdx] = useState(0)
  const [moreToggle, setMoreToggle] = useState(false)

  let urlrStr
  if (props.location) {
    urlrStr = props.location.pathname.split('/')[2]
  } else {
    urlrStr = location.pathname.split('/')[2]
  }

  const getNotice = useCallback(async () => {
    setMoreToggle(false)

    const res = await mypage_notice_inquire({
      memNo: urlrStr,
      page: currentPage,
      records: 10
    })
    if (res.result === 'success') {
      setNoticeList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    }
  }, [memNo, currentPage])

  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const res = await Api.mypage_notice_delete({
          memNo: memNo,
          noticeIdx: noticeIdx
        })
        if (res.result === 'success') {
          getNotice()
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  useEffect(() => {
    getNotice()
  }, [currentPage])

  return (
    <div className="notice">
      <div className="noticeInfo">
        <h2 className="headtitle">방송공지</h2>
        {globalState.baseData.memNo === memNo && (
          <button
            onClick={() => {
              setIsAdd(!isAdd)
            }}
            className={isAdd === true ? `noticeWriter noticeWriter--active` : `noticeWriter`}>
            <span className="noticeButton">공지 작성하기</span>
          </button>
        )}
      </div>
      {isAdd === true && <NoticeInsertCompnent setIsAdd={setIsAdd} memNo={memNo} getNotice={getNotice} />}
      {modifyItem !== null && (
        <NoticeModifyCompnent modifyItem={modifyItem} setModifyItem={setModifyItem} memNo={memNo} getNotice={getNotice} />
      )}
      <ul className="noticeList">
        {noticeList !== null &&
          noticeList.map((item, index) => (
            <li key={index} className="noticeItem">
              <div
                onClick={() => {
                  setMoreToggle(false)
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
                <span className="noticeItem__date">{dateTimeFormat(item.writeDt)}</span>
              </div>
              {item.noticeIdx === detailIdx && (
                <div className="noticeSubject">
                  {memNo === globalState.baseData.memNo && (
                    <button
                      onClick={() => {
                        setMoreToggle(!moreToggle)
                      }}
                      className="moreBtn"
                    />
                  )}
                  {moreToggle === true && (
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
                  )}
                  <div className="noticeSubject__content">
                    <span className="noticeSubject__title">{item.title}</span>
                    <pre className="noticeSubject__innerTxt">{item.contents}</pre>
                    <img src={`${PHOTO_SERVER}${item.imagePath}`} />
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
      {totalPage !== 0 && noticeList !== null && (
        <Pagenation
          setPage={(param) => {
            setCurrentPage(param)
          }}
          currentPage={currentPage}
          totalPage={totalPage}
          count={5}
        />
      )}
    </div>
  )
}
