import React from 'react'

const NoitceView = () => {
  return (
    <div className="noticeSubject">
      {memNo === globalCtx.profile.memNo && (
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
        {/* <img src={`${PHOTO_SERVER}${item.imagePath}`} /> */}
      </div>
    </div>
  )
}

export default NoitceView
