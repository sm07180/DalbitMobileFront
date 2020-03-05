/**
 * @file /mypage/content/mwallet.js
 * @brief 마이페이지 내지갑
 */

import React, {useEffect, useStet} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

const wallet = () => {
  return (
    <Wallet>
      <h3>루비 상세내역(최근 3개월)</h3>
      <ul>
        <li></li>
      </ul>
    </Wallet>
  )
}

export default wallet

const Wallet = styled.div``
