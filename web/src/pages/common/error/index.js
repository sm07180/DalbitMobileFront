/**
 * @title 404페이지
 */
import React, {useEffect} from 'react'
//import './style.css'
import styled from 'styled-components'
//pages

// import Guide from ' pages/common/layout/guide.js'
export default () => {
  return (
    <>
      <section>
        <ul>
          <li class="logoImg">로고이미지</li>
          <li class="errorTitle">에러 ERROR</li>
          <li class="details">
            죄송합니다.
            <br /> 서비스 이용에 불편을 드려 죄송합니다.
            <br /> 잠시 후 다시 시도해 주시기 바랍니다.
          </li>
          <li class="btn">
            <a onClick={() => window.location('/')}>확인</a>
          </li>
          <li class="bottomImg">하단이미지</li>
        </ul>
      </section>
    </>
  )
}
