import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

// context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

import Header from 'components/ui/new_header.js'

export default () => {
  let history = useHistory()
  const context = useContext(Context)

  return (
    <>
      <div id="clipEvent">
        <h2>이벤트 페이지 추가 생성 확인</h2>
        <button
          onClick={() => {
            window.location.href = '/'
          }}>
          닫기
        </button>
      </div>
    </>
  )
}
