import React, {useEffect} from 'react'
import Utility from 'components/lib/utility'
// style
import 'styles/layerpopup.scss'

export default (props) => {
  console.log(props)

  const handleDimClick = () => {
    history.goBack()
  }
  const makeTextInner = (popupData) => {
    return (
      <>
        {popupData.title && popupData.is_title_view === 1 && <div className="popup__title">{popupData.title}</div>}
        <div className="inner">
          <p className="contents" dangerouslySetInnerHTML={{__html: Utility.nl2br(popupData.contents)}}></p>
          {popupData.is_cookie === 1 && (
            <div className="checkbox-wrap">
              <label htmlFor={`chk${popupData.idx}`} className="checkbox-label">
                <input
                  type="checkbox"
                  id={`chk${popupData.idx}`}
                  onClick={(e) => {
                    setChecked({
                      idx: popupData.idx,
                      check: e.target.checked
                    })
                  }}
                  className={`${checked.check && `active`}`}
                />
                오늘 하루 보지 않기
              </label>
            </div>
          )}
          <button
            className="btn-ok"
            onClick={() => {
              {
                popupData.is_button_view === 0 && handleDimClick()
              }
              {
                popupData.is_button_view === 1 && handleRoute(popupData)
              }
            }}>
            {popupData.buttonNm}
          </button>
        </div>
      </>
    )
  }

  const makeImgInner = (popupData) => {
    return (
      <>
        <div className="contents">
          <a href={popupData.linkUrl}>
            <img src={popupData.bannerUrl} alt="" />
          </a>
        </div>
        {popupData.is_cookie === 1 && (
          <div className="checkbox-wrap" onClick={() => handleCookie(popupData.idx, 'image')}>
            <label htmlFor={`chk${popupData.idx}`} className="checkbox-label">
              <input type="checkbox" id={`chk${popupData.idx}`} />
              오늘 하루 보지 않기
            </label>
          </div>
        )}
      </>
    )
  }

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="mainLayerPopup" onClick={handleDimClick}>
      <div className="popup">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
