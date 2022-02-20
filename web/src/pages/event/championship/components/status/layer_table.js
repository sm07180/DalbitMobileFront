import React, {useEffect} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'

export default function LayerTable({nowEventNo, setLayerPointTable, content}) {
  const closePopup = () => {
    setLayerPointTable(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer championship">
        <h3>{nowEventNo === 6 ? 5 : nowEventNo}회차 순위별 승점표</h3>
        <p>
          회차별 승점은 주차별로 다르며,
          <br />
          해당 주차가 되면 공개됩니다.
        </p>
        <div className="layerContent" dangerouslySetInnerHTML={{__html: content}}></div>
        <button className="btnClose" onClick={closePopup}></button>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
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
    background: url(${IMG_SERVER}/svg/close_w_l.svg) no-repeat 0 0;
  }

  .championship {
    position: relative;
    width: calc(100% - 32px);
    max-width: 360px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    > p {
      padding: 16px 0 0;
      text-align: center;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.35px;
      color: #424242;
    }

    .layerContent {
      padding: 16px 0 32px;
      background: #fff;
      border-radius: 16px;
    }

    /* .table_box {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10%;

      table {
        width: 49%;
        border-collapse: collapse;

        thead {
          border-top: 1px solid #FF3C7B;
          border-bottom: 1px solid #FF3C7B;

          tr {
            height: 26px;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: -0.3px;
            color: #FF3C7B;
          }
        }

        tbody {
          tr {
            border-bottom: 1px solid #e0e0e0;

            td {
              height: 37px;
              font-size: 12px;
              font-weight: 500;
              text-align: center;
            }
          }
        }
      }
    } */
  }
`
