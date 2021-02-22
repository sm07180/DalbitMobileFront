import React, {useEffect} from 'react'

import NumberImg01 from '../static/num01.png'
import NumberImg02 from '../static/num02.png'
import NumberImg03 from '../static/num03.png'

export default ({setConditionPop}) => {
  const closePopup = () => {
    setConditionPop(false)
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
      <div className="layerContainer condition_pop">
        <h3>스페셜 DJ 선발 요건</h3>

        <div className="layerContent scroll_box">
          <p className="note">스페셜 DJ 선발요건은 다음과 같습니다.</p>

          <ul>
            <li>
              <img src={NumberImg01} className="number_img" />
              방송 점수, 청취자 점수, 방송 퀄리티 및 호응도,
              <br />
              받은 선물 총 4가지 항목으로 나누어
              <br />
              신청자를 평가 합니다. (각각 25%)
            </li>

            <li>
              <img src={NumberImg02} className="number_img" />
              공개된 4개 항목을 합산하여
              <br />총 100점으로 점수를 산정합니다.
            </li>

            <li>
              <img src={NumberImg03} className="number_img" />
              합산된 100점에 DJ 타임 랭킹 가산점
              <br />
              (1위: 1.5점 / 0.5위: 1점 / 3위 0.3점)을 적용하여
              <br />총 110점 만점으로 총 점수를 산정합니다.
            </li>
          </ul>
        </div>

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
