/**
 * @file /ranking/content/rankList.js
 * @brief 랭킹 리스트 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//component
import Figure from './Figure'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  /**
   *
   * @returns
   */

  //---------------------------------------------------------------------
  return (
    <>
      <RankList>
        <li>
          <h3>100</h3>
          <Figure url="https://www.mbcsportsplus.com/data/board/attach/2019/09/20190922103929_fklrgnkf.jpg" />
          <div>
            <strong>Lv 300</strong>
            <p>트와이스 😎 feel special</p>
          </div>
        </li>
      </RankList>
    </>
  )
}
//---------------------------------------------------------------------

const Contents = styled.div``

const RankList = styled.ul``
