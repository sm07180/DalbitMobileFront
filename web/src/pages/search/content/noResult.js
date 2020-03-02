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
        <h2>
          결과값이 없네요 <br />
          ㅠㅠ
        </h2>
        <div>
          <div></div>
          <div>
            <img src={`${IMG_SERVER}/images/api/noresultimg.png`} />
          </div>
        </div>
      </ResultWrap>
    </>
  )
}
//------------------------------------------------------------------

//styled
const ResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 100px 0 90px 0;
  & h2 {
    color: #757575;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.6px;
    text-align: center;
  }
  & > div {
    display: flex;
    width: 100%;

    & div {
      width: 50%;
      &:last-child {
        margin-left: 182px;
        & > img {
          width: 296.4px;
          height: 424.7px;
          margin-top: 40px;
        }
      }
    }
  }
`
