import React, {useEffect} from 'react'
import Utility from 'components/lib/utility'
// style
import 'styles/layerpopup.scss'

export default (props) => {
  const {setPopupMoon} = props

  const handleDimClick = () => {
    setPopupMoon(false)
  }

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="layerPopupCommon" onClick={handleDimClick}>
      <div className="popup">
        <button className="btn-close">
          <span className="blind">닫기</span>
        </button>
        <div
          className="in"
          onClick={(e) => {
            e.stopPropagation()
          }}>
          {props.children}
          <div className="btnWrap">
            <button
              className="btn-ok"
              onClick={() => {
                handleDimClick()
              }}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
