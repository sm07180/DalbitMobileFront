/**
 * @file /mypage/content/my-wallet.js
 * @brief 마이페이지 내지갑
 */

import React, {useEffect, useStet} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

const TabWallet = () => {
  return (
    <MyWallet>
      <h3>루비 상세내역(최근 3개월)</h3>
      <ul>
        <li></li>
      </ul>
    </MyWallet>
  )
}

export default TabWallet

const MyWallet = styled.div``
