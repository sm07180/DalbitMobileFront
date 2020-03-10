/**
 * @title 결과값이 없습니다.
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  //---------------------------------------------------------------------
  return (
    <>
      <ResultWrap>
        <div>
          <img src={`${IMG_SERVER}/images/api/img_noresult.png`} />
        </div>

        <h2>조회 된 검색 결과가 없습니다.</h2>
        <button class="back">뒤로가기</button>
      </ResultWrap>
    </>
  )
}
//------------------------------------------------------------------

//styled
const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 160px 0 90px 0;

  & h2 {
    margin-top: 40px;
    color: #757575;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.6px;
    text-align: center;
  }
  & div {
    width: 100%;
    & img {
      display: block;

      width: 298.5px;
      height: 226.7px;
      margin: 0 auto;
    }
  }
  & .back {
    width: 144px;
    height: 50px;
    margin: 44px auto 0 auto;
    border-radius: 10px;
    border: 1px solid #8556f6;
    color: #8556f6;
  }
`
