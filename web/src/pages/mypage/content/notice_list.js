import React from 'react'

const NoticeList = () => {
  return (
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
  )
}

export default NoticeList
