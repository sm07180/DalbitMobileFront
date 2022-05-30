import React, {useEffect} from 'react'
import styled from 'styled-components'

export default function awardEventVoteNotice({setVoteNoticePop}) {
  const closePopup = () => {
    setVoteNoticePop(false)
  }
  const closePopupDim = (e) => {
    closePopup()
  }
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <LayerPopup onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>굿즈 상품 미리보기</h3>
        <div className="layerContent awardGoodsPop">
          <div className="scrollBox">
            <img src="https://image.dallalive.com/event/award/201214/img-pop-goods.png" alt="goods" />
          </div>
          <p>*스페셜 DJ 제공 굿즈의 경우 상품 또는 디자인 변경이 있을 수 있습니다.</p>
        </div>

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </LayerPopup>
  )
}

const LayerPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .btnClose {
    position: absolute;
    top: -40px;
    right: 0px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    background: url('https://image.dallalive.com/svg/close_w_l.svg') no-repeat 0 0;
  }

  .layerContainer {
    position: relative;
    min-width: 320px;
    max-width: 360px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    & > h3,
    .layerTitle {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .layerContent {
      padding: 16px 0;
      background: #fff;
      border-radius: 16px;
    }
  }
`
