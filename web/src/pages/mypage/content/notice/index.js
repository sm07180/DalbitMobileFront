import React, {useState, useCallback, useEffect, useContext, useMemo} from 'react'
import {useLocation} from 'react-router-dom'

import Api from 'context/api'
import {Context} from 'context'
import {PHOTO_SERVER} from 'context/config'

import Utility from 'components/lib/utility'

// import Pagenation from 'common/ui/pagenation/Pagenation'
import NoticeInsertCompnent from './insert'
import NoticeModifyCompnent from './modify'

import {PAGE_TYPE} from './constant'

import './index.scss'

function NoticeComponent() {
  const location = useLocation()

  const memNo = useMemo(() => {
    return location.pathname.split('/')[2]
  }, [location])

  const [pageType, setPageType] = useState(PAGE_TYPE.LIST)

  const globalCtx = useContext(Context)

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

  const getNotice = useCallback(async () => {
    setMoreToggle(false)

    const {result, data} = await Api.mypage_notice_inquire({
      memNo: memNo,
      page: currentPage,
      records: 10
    })
    if (result === 'success') {
      setNoticeList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    }
  }, [memNo, currentPage])

  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const {result, data} = await Api.mypage_notice_delete({
          memNo: memNo,
          noticeIdx: noticeIdx
        })
        if (result === 'success') {
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
        {globalCtx.token.memNo === memNo && (
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
                <span className="noticeItem__date">{Utility.dateTimeFormat(item.writeDt)}</span>
              </div>
              {item.noticeIdx === detailIdx && (
                <div className="noticeSubject">
                  {globalCtx.token.memNo === memNo && (
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
      {/* {totalPage !== 0 && noticeList !== null && (
        <Pagenation
          setPage={(param) => {
            setCurrentPage(param)
          }}
          currentPage={currentPage}
          totalPage={totalPage}
          count={5}
        />
      )} */}
    </div>
  )
}

export default NoticeComponent
