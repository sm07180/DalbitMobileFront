import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

//component
import Gnb from './gnb-layout'

export default props => {
  //---------------------------------------------------------------------

  return (
    <>
      <Gnb>
        <p>나는 마이페이지입니다. 나는 레이아웃의 차일드에요.</p>
      </Gnb>
    </>
    //       <span> 후에 로그인 로그아웃 참고
    //         <button
    //           onClick={() => {
    //             if (!context.login_state) {
    //               context.action.updatePopup('LOGIN')
    //             } else {
    //               const result = confirm('로그아웃 하시겠습니까?')
    //               if (result) {
    //                 alert('정상적으로 로그아웃 되었습니다.')
    //                 context.action.updateLogin(false)
    //               }
    //             }
    //           }}>
    //           {context.login_state ? '로그아웃' : '로그인'}
    //         </button>
    //         <NavLink
    //           title="회원가입"
    //           to="/user/join"
    //           onClick={() => {
    //             context.action.updateGnbVisible(false)
    //           }}>
    //           회원가입
    //         </NavLink>
  )
}

//---------------------------------------------------------------------
//styled
