import React, {useContext} from 'react'
import {Context} from 'context'

export default props => {
  //----------------------------------------------------------------
  const context = useContext(Context)
  const {history} = props

  return <div>결과 페이지</div>
}
