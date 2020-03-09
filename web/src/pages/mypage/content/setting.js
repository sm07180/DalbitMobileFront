/**
 * @file /mypage/content/setting.js
 * @brief 마이페이지 설정
 */

import React, {useEffect, useStet} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

const TabSetting = () => {
  return (
    <Setting>
      <div className="nickname">
        <img src="" />
      </div>
      <div className="user-id"></div>
      <div className="password"></div>
      <div className="gender-wrap"></div>
      <div className="msg-wrap">
        <div>프로필 메세지</div>
        <div>
          <textarea></textarea>
        </div>
      </div>
      <SaveBtn>저장</SaveBtn>
    </Setting>
  )
}

export default TabSetting

const SaveBtn = styled.div`
  font-size: 16px;
  letter-spacing: -0.4px;
  background-color: #8556f6;
`

const Setting = styled.div`
  width: 394px;
  margin: 0 auto;
`
