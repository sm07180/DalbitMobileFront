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
        <div className="in">
          <span className="img img-moon">
            <img src="https://image.dalbitlive.com/main/common/img_moon_popup.png" alt="지금이닷" />
          </span>
          <h3 className="title title--purple">달이 된 병아리가 나타났습니다!</h3>
          <p className="subTitle">
            DJ님, 조금만 노력하시면
            <br />내 방송이 상단으로 올라갈 수 있어요.
            <br />날 수 없었던 저처럼 말이죠!
          </p>
          <div className="desc">
            <strong>P.S</strong>
            <p>
              저는 아무 때나 나타나지 않고,
              <br />
              DJ님이 실시간 LIVE 상단으로
              <br />
              쉽게 올라갈 수 있을 때 나타나요.
            </p>
          </div>
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
