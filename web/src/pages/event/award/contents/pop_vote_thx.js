import React, {useEffect} from 'react'
import styled from 'styled-components'

export default function awardEventVoteThx({setVoteThxPop}) {
  const closePopup = () => {
    setVoteThxPop(false)
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
        <h3>감사합니다</h3>
        <div className="layerContent awardVoteThxPop">
          <img src="https://image.dalbitlive.com/event/award/201214/img_dalbit_awards.png" alt="감사합니다" />
          <p className="title">2달이 지급되었습니다.</p>
          <p>
            2020년 달라를
            <br />
            이용해주셔서 감사합니다.
            <br />
            내년에도 더욱 많은 이용과 관심 부탁드립니다.
          </p>
          <div className="btnWrap">
            <button className="btn" onClick={closePopup}>
              확인
            </button>
          </div>
        </div>
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
    background: url('https://image.dalbitlive.com/svg/close_w_l.svg') no-repeat 0 0;
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
