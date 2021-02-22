import React, {useEffect} from 'react'

export default ({setGoodsPop}) => {
  const closePopup = () => {
    setGoodsPop(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  //--------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer goods_pop">
        <h3>굿즈 상품 미리보기</h3>
        <div className="layerContent scroll_box">
          <img src={'https://image.dalbitlive.com/event/2007/24/goods_img_640.jpg'} />
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
