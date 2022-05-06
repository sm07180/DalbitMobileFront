/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

////---------------------------------------------------------------------
export default (props) => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h2 className="title">굿즈 상품 미리보기</h2>
      <div className="popupScroll">
        <div className="popupScroll--margin">
          <div className="popupScroll--content">
            <img src={'https://image.dalbitlive.com/event/2007/24/goods_img_640.jpg'} />
          </div>
        </div>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  width: 100%;
  padding: 0px 14px 16px 14px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    line-height: 52px;
    text-align: center;
    font-weight: bold;
    color: #000;
    padding: 0px;
    border-bottom: solid 1px #f0f0f0;
  }

  .popupScroll {
    width: 104%;
    &--margin {
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 378px;

      &::-webkit-scrollbar {
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.4);
      }
      &::-webkit-scrollbar-track {
        background-color: $white;
      }
    }
    &--content {
      padding-right: 4px;
      box-sizing: border-box;

      img {
        display: block;
        width: 100%;
      }
    }
  }
`
