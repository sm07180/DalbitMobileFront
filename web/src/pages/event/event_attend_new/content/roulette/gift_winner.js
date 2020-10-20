import React from 'react'

import {useHistory} from 'react-router-dom'

export default () => {
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }
  return (
    <>
      당첨자리스트
      <button onClick={goBack}>뒤로가기</button>
    </>
  )
}
