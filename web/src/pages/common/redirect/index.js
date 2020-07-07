/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect} from 'react'

//
export default props => {
  //state

  //useEffect
  useEffect(() => {
    window.location.href = '/'
    //   alert('redirect실행')
  }, [])

  //---------------------------------------------------------------------
  return <React.Fragment></React.Fragment>
}

//---------------------------------------------------------------------
