/**
 * @title error페이지
 */
import React, {useContext} from 'react'
import 'styles/errorstyle.scss'

export default () => {
  return (
    <section id="error">
      <h2 className="logoImg">로고이미지</h2>
      <p className="errorTitle">에러 ERROR</p>
      <p className="details">
        죄송합니다.
        <br /> 서비스 이용에 불편을 드려 죄송합니다.
        <br /> 잠시 후 다시 시도해 주시기 바랍니다.
      </p>
      <button className="btn">확인</button>
      <span className="bottomImg">하단이미지</span>
    </section>
  )
}
